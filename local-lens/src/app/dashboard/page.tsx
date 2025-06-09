"use client";
import React, { useState } from 'react';
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
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">LocalLens</h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search locations..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Stats Cards */}
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
                  <div key={post.id} className="p-6">
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        post.type === 'reddit' ? 'bg-orange-100' :
                        post.type === 'twitter' ? 'bg-blue-100' :
                        post.type === 'event' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        {post.type === 'reddit' && <MessageSquare className="h-5 w-5 text-orange-600" />}
                        {post.type === 'twitter' && <span className="text-blue-600 font-bold text-xs">X</span>}
                        {post.type === 'event' && <Calendar className="h-5 w-5 text-yellow-600" />}
                        {post.type === 'news' && <FileText className="h-5 w-5 text-green-600" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-medium text-gray-900">{post.source}</span>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-500">{post.time} ago</span>
                        </div>
                        
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{post.title}</h3>
                        <p className="text-gray-700 mb-3">{post.content}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          {post.comments && (
                            <div className="flex items-center space-x-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>{post.comments} comments</span>
                            </div>
                          )}
                          {post.upvotes && (
                            <div className="flex items-center space-x-1">
                              <span>↑ {post.upvotes}</span>
                            </div>
                          )}
                          {post.attending && (
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{post.attending} attending</span>
                            </div>
                          )}
                          {post.shares && (
                            <div className="flex items-center space-x-1">
                              <ExternalLink className="h-4 w-4" />
                              <span>{post.shares} shares</span>
                            </div>
                          )}
                          {post.likes && (
                            <div className="flex items-center space-x-1">
                              <span>❤️ {post.likes}</span>
                            </div>
                          )}
                          {post.retweets && (
                            <div className="flex items-center space-x-1">
                              <span>🔄 {post.retweets}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <button className="p-1 text-gray-400 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
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