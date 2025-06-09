import React from 'react';
import { MapPin } from 'lucide-react';

interface ContentSource {
  name: string;
  count: number;
  active: boolean;
}

interface SidebarProps {
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  contentSources: ContentSource[];
  toggleContentSource: (index: number) => void;
  trendingTopics: string[];
}

export default function Sidebar({
  selectedLocation,
  setSelectedLocation,
  contentSources,
  toggleContentSource,
  trendingTopics
}: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      {/* Location Selector */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          Currently viewing local content
        </div>
        <div className="relative">
          <select 
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full p-2 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Baltimore, MD">Baltimore, MD</option>
            <option value="Annapolis, MD">Annapolis, MD</option>
            <option value="Columbia, MD">Columbia, MD</option>
            <option value="Towson, MD">Towson, MD</option>
          </select>
        </div>
        <button className="w-full mt-2 px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Change Location
        </button>
      </div>

      {/* Content Sources */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Content Sources</h3>
        <div className="space-y-2">
          {contentSources.map((source, index) => (
            <label key={index} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={source.active}
                onChange={() => toggleContentSource(index)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{source.name}</span>
              <span className="ml-auto text-xs text-gray-500">{source.count}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Trending Topics */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Trending Topics</h3>
        <div className="space-y-2">
          {trendingTopics.map((topic, index) => (
            <button
              key={index}
              className="block text-sm text-blue-600 hover:text-blue-700"
            >
              {topic}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}