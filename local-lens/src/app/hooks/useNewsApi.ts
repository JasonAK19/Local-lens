import { useState, useEffect } from 'react';

interface NewsArticle {
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

interface NewsResponse {
  articles: NewsArticle[];
  totalResults: number;
  location: string;
  analytics: {
    categories: Record<string, number>;
    sentiment: Record<string, number>;
    averageImpact: number;
    averageRelevance: number;
  };
  searchTerms: string[];
  sources: string[];
}

export function useNewsApi(location: string, filters?: {
  category?: string;
  sentiment?: string;
  minImpact?: number;
}) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [analytics, setAnalytics] = useState<NewsResponse['analytics'] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      if (!location) {
        setArticles([]);
        setAnalytics(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          location,
          pageSize: '20'
        });

        if (filters?.category) params.append('category', filters.category);
        if (filters?.sentiment) params.append('sentiment', filters.sentiment);
        if (filters?.minImpact) params.append('minImpact', filters.minImpact.toString());

        const response = await fetch(`/api/news?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: NewsResponse = await response.json();
        setArticles(data.articles);
        setAnalytics(data.analytics);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news';
        setError(errorMessage);
        console.error('News API Error:', err);
        setArticles([]);
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [location, filters?.category, filters?.sentiment, filters?.minImpact]);

  return { articles, analytics, loading, error };
}
