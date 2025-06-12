import React from 'react';
import { Clock, ExternalLink, TrendingUp, Heart, AlertTriangle } from 'lucide-react';

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

interface NewsCardProps {
  article: NewsArticle;
}

export default function NewsCard({ article }: NewsCardProps) {
  const formatTimeFromDate = (dateString: string): string => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const getSentimentIcon = () => {
    switch (article.sentiment) {
      case 'positive':
        return <Heart className="h-4 w-4 text-green-500" />;
      case 'negative':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getSentimentColor = () => {
    switch (article.sentiment) {
      case 'positive':
        return 'border-l-green-500 bg-green-50';
      case 'negative':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-400 bg-gray-50';
    }
  };

  const getImpactBadge = () => {
    if (article.impactScore >= 70) {
      return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">High Impact</span>;
    } else if (article.impactScore >= 40) {
      return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Medium Impact</span>;
    } else if (article.impactScore >= 20) {
      return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Low Impact</span>;
    }
    return null;
  };

  return (
    <div className={`border-l-4 ${getSentimentColor()} bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 mb-4`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          {getSentimentIcon()}
          <span className="text-sm font-medium text-gray-700 capitalize">
            {article.sentiment}
          </span>
          {getImpactBadge()}
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          {formatTimeFromDate(article.publishedAt)}
        </div>
      </div>

      {article.urlToImage && (
        <img 
          src={article.urlToImage} 
          alt={article.title}
          className="w-full h-48 object-cover rounded-lg mb-3"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}

      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {article.title}
      </h3>

      {article.description && (
        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
          {article.description}
        </p>
      )}

      <div className="flex flex-wrap gap-1 mb-3">
        {article.categories.slice(0, 3).map((category) => (
          <span 
            key={category}
            className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded capitalize"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{article.source.name}</span>
          <div className="flex items-center text-xs text-gray-500">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>Relevance: {article.relevanceScore}</span>
          </div>
        </div>
        
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm"
        >
          Read more
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
}