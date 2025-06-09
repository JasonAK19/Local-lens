import { useState, useEffect } from 'react';
import { fetchLocationPosts, RedditPost } from '@/lib/reddit';

export function useRedditPosts(location: string) {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    try {
      setLoading(true);
      setError(null);
      const redditPosts = await fetchLocationPosts(location);
      setPosts(redditPosts);
    } catch (err) {
      setError('Failed to load Reddit posts');
      console.error('Reddit API error:', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPosts();
  }, [location]);

  return { posts, loading, error, refetch: () => loadPosts() };
}

