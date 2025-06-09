export interface RedditPost {
  id: string;
  title: string;
  selftext: string;
  author: string;
  created_utc: number;
  score: number;
  num_comments: number;
  subreddit: string;
  permalink: string;
  url: string;           
  thumbnail: string;     
  is_video: boolean;     
  domain: string;        
  flair_text?: string;  
}

// Smart content relevance function
function isLocationRelevant(post: RedditPost, location: string): boolean {
  const [city, state] = location.split(', ');
  
  // Create search terms for the location
  const searchTerms = [
    city.toLowerCase(),
    state?.toLowerCase(),
    // Add common location variations
    city.toLowerCase().replace(/\s+/g, ''),
    // Add neighborhood/area terms
    ...(city.toLowerCase() === 'baltimore' ? ['charm city', 'bmore', 'balt'] : []),
    ...(city.toLowerCase() === 'annapolis' ? ['naval academy', 'usna'] : []),
    ...(location.includes('DC') ? ['washington', 'dc', 'dmv'] : [])
  ].filter(Boolean);
  
  // Combine title and content for searching - add null checks
  const postText = `${post.title || ''} ${post.selftext || ''}`.toLowerCase();
  
  // Check if any search terms appear in the post
  const hasLocationMention = searchTerms.some(term => 
    postText.includes(term)
  );
  
  // Always include posts from highly local subreddits - add null check
  const localSubreddits = ['baltimore', 'annapolis', 'columbia', 'rockville'];
  const isFromLocalSubreddit = post.subreddit ? localSubreddits.includes(post.subreddit.toLowerCase()) : false;
  
  return hasLocationMention || isFromLocalSubreddit;
}

// Relevance scoring function
function calculateRelevanceScore(post: RedditPost, location: string): number {
  const [city, state] = location.split(', ');
  let score = 0;
  
  // Add null checks
  const postText = `${post.title || ''} ${post.selftext || ''}`.toLowerCase();
  
  // Higher score for city mentions
  if (postText.includes(city.toLowerCase())) score += 10;
  if (postText.includes(state?.toLowerCase() || '')) score += 5;
  
  // Score based on subreddit relevance - add null check
  if (post.subreddit) {
    if (post.subreddit.toLowerCase() === city.toLowerCase()) score += 15;
    if (post.subreddit.toLowerCase().includes(city.toLowerCase())) score += 10;
  }
  
  // Score based on engagement (normalize by age)
  const ageInHours = (Date.now() / 1000 - post.created_utc) / 3600;
  const engagementScore = (post.score + post.num_comments) / Math.max(ageInHours, 1);
  score += engagementScore * 0.1;
  
  return score;
}

function getSubredditsForLocation(location: string): string[] {
  const locationMap: Record<string, string[]> = {
    // Baltimore Metro Area
    'Baltimore, MD': ['baltimore', 'maryland', 'charm_city'],
    'Towson, MD': ['towson', 'baltimore', 'maryland'],
    'Dundalk, MD': ['dundalk', 'baltimore', 'maryland'],
    'Catonsville, MD': ['catonsville', 'baltimore', 'maryland'],
    'Essex, MD': ['essex', 'baltimore', 'maryland'],
    
    // Anne Arundel County
    'Annapolis, MD': ['annapolis', 'maryland', 'annearndelcounty'],
    'Glen Burnie, MD': ['glenburnie', 'maryland', 'annearndelcounty'],
    'Severna Park, MD': ['severnapark', 'maryland', 'annearndelcounty'],
    'Arnold, MD': ['arnold', 'maryland', 'annearndelcounty'],
    
    // Howard County
    'Columbia, MD': ['columbia', 'maryland', 'howardcounty'],
    'Ellicott City, MD': ['ellicottcity', 'maryland', 'howardcounty'],
    
    // Montgomery County
    'Rockville, MD': ['rockville', 'maryland', 'montgomerycounty'],
    'Gaithersburg, MD': ['gaithersburg', 'maryland', 'montgomerycounty'],
    'Silver Spring, MD': ['silverspring', 'maryland', 'montgomerycounty'],
    'Bethesda, MD': ['bethesda', 'maryland', 'montgomerycounty'],
    'Germantown, MD': ['germantown', 'maryland', 'montgomerycounty'],
    'Chevy Chase, MD': ['chevychase', 'maryland', 'montgomerycounty'],
    'Takoma Park, MD': ['takomapark', 'maryland', 'montgomerycounty'],
    
    // Prince George's County
    'Bowie, MD': ['bowie', 'maryland', 'princegeorgescounty'],
    'College Park, MD': ['collegepark', 'maryland', 'princegeorgescounty'],
    'Greenbelt, MD': ['greenbelt', 'maryland', 'princegeorgescounty'],
    'Hyattsville, MD': ['hyattsville', 'maryland', 'princegeorgescounty'],
    'Laurel, MD': ['laurel', 'maryland', 'princegeorgescounty'],
    'Upper Marlboro, MD': ['uppermarlboro', 'maryland', 'princegeorgescounty'],
    
    // Frederick County
    'Frederick, MD': ['frederick', 'maryland', 'frederickcounty'],
    
    // Washington County
    'Hagerstown, MD': ['hagerstown', 'maryland', 'washingtoncounty'],
    
    // Wicomico County
    'Salisbury, MD': ['salisbury', 'maryland', 'wicomico'],
    
    // Allegany County
    'Cumberland, MD': ['cumberland', 'maryland', 'alleganycounty'],
    
    // Charles County
    'Waldorf, MD': ['waldorf', 'maryland', 'charlescounty'],
    'La Plata, MD': ['laplata', 'maryland', 'charlescounty'],
    
    // Calvert County
    'Prince Frederick, MD': ['princefrederick', 'maryland', 'calvertcounty'],
    
    // St. Mary's County
    'Lexington Park, MD': ['lexingtonpark', 'maryland', 'stmaryscounty'],
    
    // Harford County
    'Bel Air, MD': ['belair', 'maryland', 'harfordcounty'],
    'Aberdeen, MD': ['aberdeen', 'maryland', 'harfordcounty'],
    
    // Cecil County
    'Elkton, MD': ['elkton', 'maryland', 'cecilcounty'],
    
    // Carroll County
    'Westminster, MD': ['westminster', 'maryland', 'carrollcounty'],
    
    // Eastern Shore
    'Ocean City, MD': ['oceancity', 'maryland', 'easternshore'],
    'Cambridge, MD': ['cambridge', 'maryland', 'easternshore'],
    'Easton, MD': ['easton', 'maryland', 'easternshore'],
    
    // DC Metro Area (Virginia side)
    'Arlington, VA': ['arlington', 'virginia', 'dmv'],
    'Alexandria, VA': ['alexandria', 'virginia', 'dmv'],
    'Fairfax, VA': ['fairfax', 'virginia', 'dmv'],
    'Vienna, VA': ['vienna', 'virginia', 'dmv'],
    'McLean, VA': ['mclean', 'virginia', 'dmv'],
    
    // Washington DC
    'Washington, DC': ['washingtondc', 'dmv', 'dc'],
  };
  
  return locationMap[location] || ['baltimore', 'maryland'];
}

export async function fetchLocationPosts(
  location: string, 
  sortBy: 'hot' | 'new' | 'top' | 'relevant' = 'hot',
  timeframe: 'hour' | 'day' | 'week' | 'month' = 'day'
): Promise<RedditPost[]> {
  const subreddits = getSubredditsForLocation(location);
  const posts: RedditPost[] = [];
  
  for (const subreddit of subreddits) {
    try {
      // Use your API route instead of direct Reddit API
      const params = new URLSearchParams({
        subreddit,
        sort: sortBy === 'relevant' ? 'hot' : sortBy,
        limit: sortBy === 'relevant' ? '20' : '15',
        ...(sortBy === 'top' && { timeframe })
      });
      
      const response = await fetch(`/api/reddit?${params}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Subreddit r/${subreddit} not found`);
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data?.children) {
        // Add filtering to ensure we only add posts with required fields
        const validPosts = data.data.children
          .map((child: any) => child.data)
          .filter((post: any) => post && post.title && post.subreddit); // Filter out invalid posts
        
        posts.push(...validPosts);
      }
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error);
    }
  }
  
  // Apply relevance filtering and sorting
  if (sortBy === 'relevant') {
    const relevantPosts = posts
      .filter(post => isLocationRelevant(post, location))
      .map(post => ({
        ...post,
        relevanceScore: calculateRelevanceScore(post, location)
      }))
      .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore);
    
    return relevantPosts.slice(0, 30);
  }
  
  // For other sort types, just sort by time and limit
  return posts.sort((a, b) => b.created_utc - a.created_utc).slice(0, 30);
}