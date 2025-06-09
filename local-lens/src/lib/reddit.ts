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
    
    // Prince George\'s County
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
    
    // St. Mary\'s County
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
    'Washington, DC': ['washingtondc', 'dmv', 'dc', 'washingtondc'],
  };
  
  return locationMap[location] || ['baltimore', 'maryland'];
}

export async function fetchLocationPosts(location: string): Promise<RedditPost[]> {
  const subreddits = getSubredditsForLocation(location);
  const posts: RedditPost[] = [];
  
  for (const subreddit of subreddits) {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${subreddit}/hot.json?limit=10`,
        {
          headers: {
            'User-Agent': 'LocalLens/1.0.0'
          }
        }
      );
      
      if (!response.ok) {
        if (response.status === 404) {
          console.warn(`Subreddit r/${subreddit} not found`);
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.data?.children) {
        posts.push(...data.data.children.map((child: any) => child.data));
      }
    } catch (error) {
      console.error(`Error fetching from r/${subreddit}:`, error);
    }
  }
  
  return posts.sort((a, b) => b.created_utc - a.created_utc).slice(0, 30);
}