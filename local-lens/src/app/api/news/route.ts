import { NextRequest, NextResponse } from 'next/server';

// Dynamic location data structure
interface LocationConfig {
  aliases: string[];
  sources: string[];
  metro?: string[];
  state?: string;
}

// Enhanced article interface
interface EnhancedArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
  categories: string[];
  sentiment: 'positive' | 'negative' | 'neutral';
  impactScore: number;
  relevanceScore: number;
}

// Enhanced Content Analysis & Categorization
const categorizeArticle = (article: any): string[] => {
  const content = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  const categories: string[] = [];
  
  const categoryKeywords = {
    'breaking': ['breaking', 'urgent', 'alert', 'emergency', 'developing', 'just in'],
    'politics': ['mayor', 'council', 'election', 'government', 'policy', 'senator', 'representative', 'political', 'vote', 'campaign'],
    'crime': ['police', 'arrest', 'crime', 'robbery', 'incident', 'shooting', 'theft', 'investigation', 'suspect', 'charged'],
    'traffic': ['traffic', 'accident', 'road', 'highway', 'construction', 'closure', 'commute', 'transit', 'detour', 'congestion'],
    'weather': ['weather', 'storm', 'rain', 'snow', 'temperature', 'forecast', 'warning', 'advisory', 'hurricane', 'tornado'],
    'business': ['business', 'economy', 'jobs', 'market', 'company', 'employment', 'economic', 'retail', 'restaurant', 'store'],
    'sports': ['sports', 'game', 'team', 'player', 'stadium', 'season', 'championship', 'tournament', 'coach', 'league'],
    'events': ['festival', 'concert', 'celebration', 'event', 'gathering', 'fair', 'parade', 'show', 'exhibition', 'conference'],
    'education': ['school', 'university', 'college', 'student', 'education', 'teacher', 'campus', 'graduation', 'enrollment'],
    'health': ['hospital', 'health', 'medical', 'doctor', 'patient', 'healthcare', 'clinic', 'treatment', 'medicine'],
    'transportation': ['bus', 'train', 'metro', 'transit', 'airport', 'flight', 'transportation', 'subway', 'rail'],
    'development': ['development', 'construction', 'building', 'project', 'housing', 'downtown', 'renovation', 'zoning'],
    'community': ['community', 'neighborhood', 'residents', 'local', 'volunteer', 'charity', 'nonprofit', 'meeting']
  };
  
  Object.entries(categoryKeywords).forEach(([category, keywords]) => {
    const matchCount = keywords.filter(keyword => content.includes(keyword)).length;
    if (matchCount > 0) {
      categories.push(category);
    }
  });
  
  return categories.length > 0 ? categories : ['general'];
};

// Sentiment Analysis
const analyzeSentiment = (article: any): 'positive' | 'negative' | 'neutral' => {
  const content = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  
  const positiveWords = [
    'success', 'celebration', 'achievement', 'improvement', 'growth', 'win', 'victory',
    'award', 'honor', 'opening', 'launch', 'new', 'better', 'progress', 'recover',
    'help', 'support', 'benefit', 'positive', 'good', 'great', 'excellent', 'wonderful'
  ];
  
  const negativeWords = [
    'accident', 'crime', 'emergency', 'problem', 'issue', 'crisis', 'concern', 'worry',
    'damage', 'loss', 'death', 'injury', 'fire', 'flood', 'arrest', 'guilty',
    'controversy', 'scandal', 'protest', 'violence', 'threat', 'warning', 'closure'
  ];
  
  const positiveScore = positiveWords.filter(word => content.includes(word)).length;
  const negativeScore = negativeWords.filter(word => content.includes(word)).length;
  
  if (positiveScore > negativeScore && positiveScore > 1) return 'positive';
  if (negativeScore > positiveScore && negativeScore > 1) return 'negative';
  return 'neutral';
};

// Impact Scoring
const calculateImpactScore = (article: any, location: string): number => {
  let impact = 0;
  const content = `${article.title || ''} ${article.description || ''}`.toLowerCase();
  
  // High impact keywords (immediate public concern)
  const highImpactKeywords = [
    'emergency', 'breaking', 'closure', 'evacuation', 'shooting', 'fire',
    'accident', 'death', 'injury', 'storm', 'flood', 'power outage'
  ];
  
  // Medium impact keywords (significant but not urgent)
  const mediumImpactKeywords = [
    'traffic', 'weather', 'construction', 'event', 'meeting', 'election',
    'school', 'business', 'restaurant', 'development'
  ];
  
  // Low impact keywords (general interest)
  const lowImpactKeywords = [
    'sports', 'entertainment', 'arts', 'culture', 'history', 'anniversary'
  ];
  
  // Calculate base impact
  if (highImpactKeywords.some(keyword => content.includes(keyword))) impact += 50;
  else if (mediumImpactKeywords.some(keyword => content.includes(keyword))) impact += 25;
  else if (lowImpactKeywords.some(keyword => content.includes(keyword))) impact += 10;
  
  // Boost for government/official sources
  const source = article.source?.name?.toLowerCase() || '';
  if (source.includes('gov') || source.includes('official') || source.includes('city')) {
    impact += 15;
  }
  
  // Boost for recency
  const publishedAt = new Date(article.publishedAt);
  const hoursOld = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60);
  if (hoursOld < 6) impact += 20;
  else if (hoursOld < 24) impact += 10;
  
  return Math.min(impact, 100); // Cap at 100
};

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
    ville: cityLower.endsWith('ville') ? [cityLower.replace('ville', '')] : [],
    saint: cityLower.startsWith('saint ') ? [cityLower.replace('saint ', 'st. '), cityLower.replace('saint ', 'st ')] : [],
    fort: cityLower.startsWith('fort ') ? [cityLower.replace('fort ', 'ft. '), cityLower.replace('fort ', 'ft ')] : [],
    mount: cityLower.startsWith('mount ') ? [cityLower.replace('mount ', 'mt. '), cityLower.replace('mount ', 'mt ')] : [],
  };
  
  // Add pattern-based aliases
  Object.values(aliasPatterns).forEach(aliases => {
    config.aliases.push(...aliases);
  });
  
  // Add metro area terms based on city size/importance
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
  
  // State-based sources
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
  const category = searchParams.get('category'); // New: filter by category
  const sentiment = searchParams.get('sentiment'); // New: filter by sentiment
  const minImpact = parseInt(searchParams.get('minImpact') || '0'); // New: minimum impact score
  
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
        const sourcesQuery = localSources.slice(0, 5).join(',');
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

    // 3. Enhanced processing: Score, categorize, analyze sentiment, and calculate impact
    const enhancedArticles: EnhancedArticle[] = allArticles
      .map(article => {
        const relevanceScore = calculateRelevanceScore(article, locationConfig, location);
        const categories = categorizeArticle(article);
        const sentiment = analyzeSentiment(article);
        const impactScore = calculateImpactScore(article, location);
        
        return {
          ...article,
          categories,
          sentiment,
          impactScore,
          relevanceScore
        };
      })
      .filter(article => article.relevanceScore > 3); // Minimum relevance threshold

    // 4. Apply filters
    let filteredArticles = enhancedArticles;
    
    if (category) {
      filteredArticles = filteredArticles.filter(article => 
        article.categories.includes(category.toLowerCase())
      );
    }
    
    if (sentiment) {
      filteredArticles = filteredArticles.filter(article => 
        article.sentiment === sentiment
      );
    }
    
    if (minImpact > 0) {
      filteredArticles = filteredArticles.filter(article => 
        article.impactScore >= minImpact
      );
    }

    // 5. Sort by relevance and impact
    filteredArticles.sort((a, b) => {
      // Primary sort: relevance score
      const relevanceDiff = b.relevanceScore - a.relevanceScore;
      if (relevanceDiff !== 0) return relevanceDiff;
      
      // Secondary sort: impact score
      return b.impactScore - a.impactScore;
    });

    // 6. Deduplicate
    const uniqueArticles: EnhancedArticle[] = [];
    const seenUrls = new Set();
    const seenTitles = new Set();

    for (const article of filteredArticles) {
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

    // 7. Generate analytics
    const categoryStats = uniqueArticles.reduce((acc, article) => {
      article.categories.forEach(cat => {
        acc[cat] = (acc[cat] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const sentimentStats = uniqueArticles.reduce((acc, article) => {
      acc[article.sentiment] = (acc[article.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`Found ${uniqueArticles.length} relevant articles for ${location}`);

    return NextResponse.json({
      articles: uniqueArticles,
      totalResults: uniqueArticles.length,
      location: location,
      analytics: {
        categories: categoryStats,
        sentiment: sentimentStats,
        averageImpact: uniqueArticles.reduce((sum, a) => sum + a.impactScore, 0) / uniqueArticles.length,
        averageRelevance: uniqueArticles.reduce((sum, a) => sum + a.relevanceScore, 0) / uniqueArticles.length
      },
      searchTerms: locationConfig.aliases.slice(0, 5),
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