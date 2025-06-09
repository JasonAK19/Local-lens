import React from 'react';
import { MessageSquare, Calendar, FileText } from 'lucide-react';

interface Stats {
  reddit: number;
  twitter: number;
  events: number;
  news: number;
}

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <MessageSquare className="h-8 w-8 text-orange-500 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.reddit}</p>
            <p className="text-sm text-gray-500">Reddit Posts</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <div className="h-8 w-8 bg-blue-500 rounded mr-3 flex items-center justify-center">
            <span className="text-white font-bold text-xs">X</span>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.twitter}</p>
            <p className="text-sm text-gray-500">X Posts</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-yellow-500 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.events}</p>
            <p className="text-sm text-gray-500">Events</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <div className="flex items-center">
          <FileText className="h-8 w-8 text-green-500 mr-3" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{stats.news}</p>
            <p className="text-sm text-gray-500">News Updates</p>
          </div>
        </div>
      </div>
    </div>
  );
}