import { NextRequest, NextResponse } from 'next/server';

// Dynamic location data structure
interface LocationConfig {
  aliases: string[];
  sources: string[];
  metro?: string[];
  state?: string;
}

// Create location-specific configurations dynamically
const generateLocationConfig = (location: string): LocationConfig => {
  const [city, state] = location.split(',').map(s => s.trim());
  const cityLower = city.toLowerCase();
  const stateLower = state?.toLowerCase() || '';
  
  // Base configuration
  const config: LocationConfig = {
    aliases: [cityLower],
    sources: [],
    metro: [],
    state: stateLower
  };
  
  // Dynamic alias generation based on patterns
  const aliasPatterns = {
    // Cities ending in 'ville' often have nickname patterns
    ville: cityLower.endsWith('ville') ? [cityLower.replace('ville', '')] : [],
    
    // Common city nickname patterns
    saint: cityLower.startsWith('saint ') ? [cityLower.replace('saint ', 'st. '), cityLower.replace('saint ', 'st ')] : [],
    
    // Fort cities
    fort: cityLower.startsWith('fort ') ? [cityLower.replace('fort ', 'ft. '), cityLower.replace('fort ', 'ft ')] : [],
    
    // Mount cities
    mount: cityLower.startsWith('mount ') ? [cityLower.replace('mount ', 'mt. '), cityLower.replace('mount ', 'mt ')] : [],
  };
  
  // Add pattern-based aliases
  Object.values(aliasPatterns).forEach(aliases => {
    config.aliases.push(...aliases);
  });
  
  // Add metro area terms based on city size/importance (you could enhance this with a city database)
  const majorCities = ['new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san antonio', 'san diego', 'dallas', 'san jose'];
  if (majorCities.includes(cityLower)) {
    config.metro = [`${cityLower} metro`, `${cityLower} area`, `greater ${cityLower}`];
  }
  
  // Add county variations
  config.aliases.push(`${cityLower} county`);
  
  // State-based aliases
  if (stateLower) {
    config.aliases.push(`${cityLower} ${stateLower}`);
    config.aliases.push(`${cityLower}, ${stateLower}`);
  }
  
  return config;
};

// Dynamic news source detection based on location
const getNewsSourcesForLocation = (location: string): string[] => {
  const [city, state] = location.split(',').map(s => s.trim().toLowerCase());
  
  // Major news sources that have local coverage
  const nationalSources = ['abc-news', 'cbs-news', 'nbc-news', 'cnn', 'fox-news'];
  
  // State-based sources (you could expand this with a database)
  const stateSources: Record<string, string[]> = {
    'maryland': ['the-baltimore-sun'],
    'virginia': ['the-washington-post'],
    'dc': ['the-washington-post'],
    'california': ['los-angeles-times'],
    'new york': ['the-new-york-times'],
    'florida': ['miami-herald'],
    'texas': ['the-dallas-morning-news'],
    'illinois': ['chicago-tribune'],
    'pennsylvania': ['the-philadelphia-inquirer']
  };
  
  const stateSpecificSources = stateSources[state] || [];
  
  return [...stateSpecificSources, ...nationalSources];
};

// Generate search queries dynamically
const generateSearchQueries = (location: string, config: LocationConfig): string[] => {
  const [city, state] = location.split(',').map(s => s.trim());
  
  const baseQueries = [
    `"${city}" "${state}" news`,
    `"${city}" local news`,
    `"${city}" breaking news`,
    `${city} ${state}`,
    `"${city}" weather`,
    `"${city}" traffic`,
    `"${city}" government`,
    `"${city}" police`,
    `"${city}" school district`
  ];
  
  // Add metro area queries for major cities
  if (config.metro && config.metro.length > 0) {
    baseQueries.push(...config.metro.map(metro => `"${metro}" news`));
  }
  
  // Add alias-based queries
  config.aliases.slice(0, 3).forEach(alias => {
    baseQueries.push(`"${alias}" news`);
  });
  
  return baseQueries.slice(0, 6); // Limit to prevent too many API calls
};

// Enhanced relevance scoring
const calculateRelevanceScore = (article: any, config: LocationConfig, location: string): number => {
  let score = 0;
  const title = article.title?.toLowerCase() || '';
  const description = article.description?.toLowerCase() || '';
  const content = `${title} ${description}`;
  
  // Score based on location term mentions
  config.aliases.forEach(alias => {
    const regex = new RegExp(`\\b${alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const titleMatches = (title.match(regex) || []).length;
    const descMatches = (description.match(regex) || []).length;
    
    score += titleMatches * 15; // Title matches are more valuable
    score += descMatches * 8;
  });
  
  // Boost local/regional sources
  const source = article.source?.name?.toLowerCase() || '';
  if (source.includes('local') || source.includes('herald') || source.includes('tribune') || source.includes('gazette')) {
    score += 10;
  }
  
  // Geographic indicators
  const geoIndicators = ['mayor', 'city council', 'county', 'sheriff', 'school district', 'downtown', 'police department'];
  geoIndicators.forEach(indicator => {
    if (content.includes(indicator)) score += 5;
  });
  
  // Recency bonus
  const publishedAt = new Date(article.publishedAt);
  const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (hoursOld < 24) score += 8;
  if (hoursOld < 12) score += 5;
  if (hoursOld < 6) score += 3;
  
  return score;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  
  if (!location) {
    return NextResponse.json({ error: 'Location parameter required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.NEWS_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ error: 'News API key not configured' }, { status: 500 });
    }

    // Generate dynamic configuration for this location
    const locationConfig = generateLocationConfig(location);
    const searchQueries = generateSearchQueries(location, locationConfig);
    const localSources = getNewsSourcesForLocation(location);
    
    let allArticles: any[] = [];
    
    // 1. Try local/regional sources first
    if (localSources.length > 0) {
      try {
        const sourcesQuery = localSources.slice(0, 5).join(','); // Limit sources
        const localSourceResponse = await fetch(
          `https://newsapi.org/v2/top-headlines?` +
          `sources=${sourcesQuery}&` +
          `pageSize=15&` +
          `apiKey=${apiKey}`,
          { 
            next: { revalidate: 300 },
            headers: { 'User-Agent': 'LocalLens/1.0.0' }
          }
        );
        
        if (localSourceResponse.ok) {
          const localData = await localSourceResponse.json();
          // Filter by relevance to location
          const relevantLocalArticles = localData.articles.filter((article: any) => {
            return calculateRelevanceScore(article, locationConfig, location) > 5;
          });
          allArticles.push(...relevantLocalArticles);
        }
      } catch (error) {
        console.warn('Local sources fetch failed:', error);
      }
    }

    // 2. Search with generated queries
    for (let i = 0; i < Math.min(searchQueries.length, 4); i++) {
      try {
        const query = encodeURIComponent(searchQueries[i]);
        const response = await fetch(
          `https://newsapi.org/v2/everything?` +
          `q=${query}&` +
          `sortBy=publishedAt&` +
          `language=en&` +
          `pageSize=8&` +
          `apiKey=${apiKey}`,
          { 
            next: { revalidate: 300 },
            headers: { 'User-Agent': 'LocalLens/1.0.0' }
          }
        );

        if (response.ok) {
          const data = await response.json();
          allArticles.push(...data.articles);
        }
        
        // Rate limiting
        if (i < searchQueries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 150));
        }
      } catch (error) {
        console.warn(`Search query ${i} failed:`, error);
      }
    }

    // 3. Score, filter, and deduplicate
    const scoredArticles = allArticles
      .map(article => ({
        ...article,
        relevanceScore: calculateRelevanceScore(article, locationConfig, location)
      }))
      .filter(article => article.relevanceScore > 3) // Minimum relevance threshold
      .sort((a, b) => b.relevanceScore - a.relevanceScore);

    // 4. Deduplicate
    const uniqueArticles: any[] = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    for (const article of scoredArticles) {
      if (!article.url || seenUrls.has(article.url)) continue;
      
      const titleKey = article.title?.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .substring(0, 50);
      if (seenTitles.has(titleKey)) continue;
      
      seenUrls.add(article.url);
      seenTitles.add(titleKey);
      uniqueArticles.push(article);
      
      if (uniqueArticles.length >= pageSize) break;
    }

    // Remove scoring data from response
    const finalArticles = uniqueArticles.map(({ relevanceScore, ...article }) => article);

    console.log(`Found ${finalArticles.length} relevant articles for ${location}`);

    return NextResponse.json({
      articles: finalArticles,
      totalResults: finalArticles.length,
      location: location,
      searchTerms: locationConfig.aliases.slice(0, 5), // Debug info
      sources: localSources
    });

  } catch (error) {
    console.error('Error fetching news data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news data' },
      { status: 500 }
    );
  }
}