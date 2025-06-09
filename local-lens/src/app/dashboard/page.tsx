"use client";
import React, { useState } from 'react';
import Header from '@/components/dashboard/header';
import StatsCards from '@/components/dashboard/statscard';
import Post from '@/components/dashboard/post'; 
import Sidebar from '@/components/dashboard/sidebar';
import { 
  Search, 
  Bell, 
  User, 
  MapPin, 
  MessageSquare, 
  Calendar, 
  FileText, 
  MoreHorizontal,
  Users,
  Clock,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState('Baltimore, MD');
  const [activeFilter, setActiveFilter] = useState('All');
  const [contentSources, setContentSources] = useState([
    { name: 'Reddit', count: 1247, active: true },
    { name: 'X (Twitter)', count: 23, active: true },
    { name: 'Events', count: 89, active: true },
    { name: 'Local News', count: 156, active: true }
  ]);

  const toggleContentSource = (index: number) => {
    setContentSources(prev => 
      prev.map((source, i) => 
        i === index ? { ...source, active: !source.active } : source
      )
    );
  };

  // Mock data for the dashboard
  const stats = {
    reddit: 1247,
    twitter: 23,
    events: 89,
    news: 156
  };

  const trendingTopics = [
    '#Baltimore',
    '#CharmCity',
    '#BaltimoreEvents',
    '#Traffic95',
    '#InnerHarbor'
  ];

  const posts = [
    {
      id: 1,
      source: 'r/baltimore',
      title: 'Best crab cake spots in Fells Point?',
      content: 'Visiting Baltimore next week and want to try authentic Maryland crab cakes. Any recommendations in the Fells Point area?',
      time: '2h',
      comments: 15,
      upvotes: 34,
      type: 'reddit'
    },
    {
      id: 2,
      source: 'Eventbrite',
      title: 'Baltimore Book Festival - Inner Harbor',
      content: 'Annual literary celebration featuring local authors, book vendors, and reading workshops. Free admission to all events.',
      time: '3h',
      attending: 247,
      interested: 589,
      type: 'event'
    },
    {
      id: 3,
      source: 'Baltimore Sun',
      title: 'New bike share stations coming to Federal Hill',
      content: 'The city announced plans to expand the bike share program with 15 new stations throughout Federal Hill and Riverside.',
      time: '4h',
      comments: 8,
      shares: 23,
      type: 'news'
    },
    {
      id: 4,
      source: 'r/maryland',
      title: 'I-95 construction delays through Baltimore',
      content: 'Major lane closures on I-95 northbound near Fort McHenry Tunnel. Traffic backed up for miles. Use alternate routes.',
      time: '1h',
      comments: 22,
      upvotes: 89,
      type: 'reddit'
    },
    {
      id: 5,
      source: '@BaltimorePolice',
      title: 'Road closure update',
      content: 'Light Street closed between Conway and Pratt due to water main break. MTA buses rerouted. Repairs expected by 6 PM.',
      time: '30m',
      likes: 18,
      retweets: 12,
      type: 'twitter'
    },
    {
      id: 6,
      source: 'Meetup',
      title: 'Baltimore Tech Meetup - Canton',
      content: 'Monthly networking event for Baltimore tech professionals. Guest speaker from Under Armour discussing digital innovation.',
      time: '5h',
      attending: 67,
      interested: 134,
      type: 'event'
    },
    {
      id: 7,
      source: '@BaltimoreOriolos',
      title: 'Orioles game tonight!',
      content: 'First pitch at 7:05 PM vs Yankees. Beautiful evening for baseball at Camden Yards! 🧡⚾ #BirdLand',
      time: '45m',
      likes: 156,
      retweets: 43,
      type: 'twitter'
    },
    {
      id: 8,
      source: 'WBAL-TV',
      title: 'Ravens training camp opens at Under Armour facility',
      content: 'Baltimore Ravens begin summer training camp preparations. Fans can attend select practices at the Owings Mills facility.',
      time: '6h',
      comments: 31,
      shares: 67,
      type: 'news'
    },
    {
      id: 9,
      source: 'r/baltimore',
      title: 'Parking situation in Federal Hill?',
      content: 'Moving to Federal Hill next month. What\'s the parking situation like? Any tips for finding street parking?',
      time: '3h',
      comments: 28,
      upvotes: 12,
      type: 'reddit'
    },
    {
      id: 10,
      source: 'Baltimore Farmers Market',
      title: 'Weekend Market at Waverly',
      content: 'Fresh local produce, baked goods, and artisan crafts. Every Saturday 7 AM - 12 PM under the JFX overpass.',
      time: '8h',
      attending: 89,
      interested: 203,
      type: 'event'
    }
  ];

  // Filter posts based on active filter and content source settings
  const getFilteredPosts = () => {
    let filtered = posts;

    // First filter by content source checkboxes
    const activeSourceTypes = contentSources
      .filter(source => source.active)
      .map(source => {
        switch(source.name) {
          case 'Reddit': return 'reddit';
          case 'X (Twitter)': return 'twitter';
          case 'Events': return 'event';
          case 'Local News': return 'news';
          default: return source.name.toLowerCase();
        }
      });

    filtered = filtered.filter(post => activeSourceTypes.includes(post.type));

    // Then filter by active tab filter
    if (activeFilter !== 'All') {
      const filterType = activeFilter.toLowerCase() as 'reddit' | 'twitter' | 'events' | 'news';
      const typeMap: Record<string, string> = {
        'reddit': 'reddit',
        'twitter': 'twitter',
        'events': 'event',
        'news': 'news'
      };
      
      filtered = filtered.filter(post => post.type === typeMap[filterType]);
    }

    return filtered;
  };

  // Get count for each filter tab
  const getFilterCount = (filter: string) => {
    if (filter === 'All') return posts.length;
    
    const filterType = filter.toLowerCase() as 'reddit' | 'twitter' | 'events' | 'news';
    const typeMap = {
      'reddit': 'reddit',
      'twitter': 'twitter', 
      'events': 'event',
      'news': 'news'
    } as const;
    
    return posts.filter(post => post.type === typeMap[filterType]).length;
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          contentSources={contentSources}
          toggleContentSource={toggleContentSource}
          trendingTopics={trendingTopics}
        />

        {/* Main Content */}
         <main className="flex-1 p-6">
          <StatsCards stats={stats} />

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex space-x-8">
                {['All', 'Reddit', 'Twitter', 'Events', 'News'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`pb-2 text-sm font-medium border-b-2 flex items-center space-x-2 ${
                      activeFilter === filter
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <span>{filter}</span>
                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                      {getFilterCount(filter)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Feed */}
            <div className="divide-y divide-gray-200">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <Post key={post.id} post={post} />
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No content found</h3>
                  <p className="text-gray-500">
                    Try adjusting your filters or content source settings to see more posts.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Load More Button - only show if there are posts */}
          {filteredPosts.length > 0 && (
            <div className="text-center">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                Load More Content
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}