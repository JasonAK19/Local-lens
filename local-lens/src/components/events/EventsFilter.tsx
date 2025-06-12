import React from 'react';
import { DollarSign, MapPin } from 'lucide-react';

interface EventsFilterProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
  selectedPrice: 'free' | 'paid' | 'all';
  onPriceChange: (price: 'free' | 'paid' | 'all') => void;
  radius: string;
  onRadiusChange: (radius: string) => void;
  analytics?: {
    categories: Record<string, number>;
    price: Record<string, number>;
  };
}

export default function EventsFilter({  
  selectedPrice,
  onPriceChange,
  radius,
  onRadiusChange,
  analytics 
}: EventsFilterProps) {
  const priceOptions = [
    { value: 'all', label: 'All Events', icon: null },
    { value: 'free', label: 'Free', icon: null },
    { value: 'paid', label: 'Paid', icon: DollarSign },
  ] as const;

  const radiusOptions = [
    { value: '5', label: '5 miles' },
    { value: '10', label: '10 miles' },
    { value: '25', label: '25 miles' },
    { value: '50', label: '50 miles' },
  ];

  return (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <h3 className="font-semibold text-gray-900 mb-3">Event Filters</h3>
      
      <div className="space-y-4">
        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
          <div className="flex flex-wrap gap-2">
            {priceOptions.map((option) => {
              const Icon = option.icon;
              const count = option.value !== 'all' ? analytics?.price[option.value] || 0 : null;
              const isSelected = selectedPrice === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => onPriceChange(option.value)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isSelected 
                      ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500'
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

        {/* Radius Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-1" />
            Search Radius
          </label>
          <select
            value={radius}
            onChange={(e) => onRadiusChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {radiusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}