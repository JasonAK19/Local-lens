import React from 'react';
import { Heart, AlertTriangle, Minus } from 'lucide-react';

interface SentimentFilterProps {
  selectedSentiment: string | null;
  onSentimentChange: (sentiment: string | null) => void;
  analytics?: {
    sentiment: Record<string, number>;
  };
}

export default function SentimentFilter({ 
  selectedSentiment, 
  onSentimentChange, 
  analytics 
}: SentimentFilterProps) {
  const sentimentOptions = [
    { value: null, label: 'All', icon: null, color: 'bg-gray-100 text-gray-700' },
    { value: 'positive', label: 'Positive', icon: Heart, color: 'bg-green-100 text-green-700' },
    { value: 'neutral', label: 'Neutral', icon: Minus, color: 'bg-gray-100 text-gray-700' },
    { value: 'negative', label: 'Negative', icon: AlertTriangle, color: 'bg-red-100 text-red-700' },
  ];

  return (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">News Sentiment</h3>
      
      <div className="flex flex-wrap gap-2">
        {sentimentOptions.map((option) => {
          const Icon = option.icon;
          const count = option.value ? analytics?.sentiment[option.value] || 0 : null;
          const isSelected = selectedSentiment === option.value;
          
          return (
            <button
              key={option.value || 'all'}
              onClick={() => onSentimentChange(option.value)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                isSelected 
                  ? option.color + ' ring-2 ring-blue-500'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              <span>{option.label}</span>
              {count !== null && (
                <span className="bg-white bg-opacity-50 px-1 rounded text-xs">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}