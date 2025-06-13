import { useState, useEffect, useCallback } from 'react';
import { fetchLocationPosts, RedditPost } from '@/lib/reddit';

export function useRedditPosts(location: string, redditSort: 'hot' | 'new' | 'top' | 'relevant') {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Pass the redditSort parameter to fetchLocationPosts
      const redditPosts = await fetchLocationPosts(location, redditSort);
      setPosts(redditPosts);
    } catch (err) {
      setError('Failed to load Reddit posts');
      console.error('Reddit API error:', err);
    } finally {
      setLoading(false);
    }
  }, [location, redditSort]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]); 

  return { posts, loading, error, refetch: loadPosts };
}