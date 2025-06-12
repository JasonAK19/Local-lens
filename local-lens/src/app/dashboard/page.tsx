"use client";
import React, { useState, useEffect } from 'react';
import { useRedditPosts } from '../hooks/useRedditPost';
import { useNewsApi } from '../hooks/useNewsApi';
import { useTicketmasterEvents } from '../hooks/useTicketMasterApi';
import Header from '@/components/dashboard/header';
import StatsCards from '@/components/dashboard/statscard';
import Post from '@/components/dashboard/post'; 
import Sidebar from '@/components/dashboard/sidebar';
import { Search } from 'lucide-react';
import { useLocation } from '@/contexts/locationContext';
import { locationService } from '@/utils/locationService';
import NewsCard from '@/components/news/NewsCard';
import SentimentFilter from '@/components/news/SentimentFilter';
import EventCard from '@/components/events/EventCard';
//import EventsFilter from '@/components/events/EventsFilter';

export default function Dashboard() {
  const { currentLocation, setLocation} = useLocation();
  const [selectedSentiment, setSelectedSentiment] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [minImpact, setMinImpact] = useState<number>(0);
  const [selectedEventCategory, setSelectedEventCategory] = useState<string | null>(null);
  const [selectedEventPrice, setSelectedEventPrice] = useState<'free' | 'paid' | 'all'>('all');
  const [eventRadius, setEventRadius] = useState<string>('25');

  const getLocationString = (location: any) => {
    if (!location) return 'Baltimore, MD'; // fallback
    
    if (location.city && location.state) {
      return `${location.city}, ${location.state}`;
    }
    
    if (location.displayName) {
      const parts = location.displayName.split(',');
      if (parts.length >= 2) {
        return `${parts[0].trim()}, ${parts[1].trim()}`;
      }
    }
    
    return `${location.latitude}, ${location.longitude}`;
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now() / 1000;
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600);
    if (hours < 1) return `${Math.floor(diff / 60)}m`;
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

    const formatTimeFromDate = (dateString: string): string => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMs = now.getTime() - publishedDate.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    
    if (diffInHours < 1) return `${Math.floor(diffInMs / (1000 * 60))}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  

  const [selectedLocation, setSelectedLocation] = useState(currentLocation ? getLocationString(currentLocation) : 'Baltimore, MD');
  useEffect(() => {
    if (currentLocation) {
      const newLocation = getLocationString(currentLocation);
      setSelectedLocation(newLocation);
    }
  }, [currentLocation]);

  const handleLocationChange = (newLocationString: string) => {
    setSelectedLocation(newLocationString);
    
    const [city, state] = newLocationString.split(', ');
    const newLocation = {
      latitude: 0,
      longitude: 0,
      city: city,
      state: state,
      displayName: newLocationString
    };
    
    setLocation(newLocation);
  };

  const [activeFilter, setActiveFilter] = useState('All');
 
  const [redditSort, setRedditSort] = useState<'hot' | 'new' | 'top' | 'relevant'>('relevant');
  

  const { posts: redditPosts, 
    loading, error 
  } = useRedditPosts(selectedLocation, redditSort);

  const { 
    articles: newsArticles, 
    analytics,
    loading: newsLoading, 
    error: newsError 
  } = useNewsApi(selectedLocation, {
    sentiment: selectedSentiment || undefined,
    category: selectedCategory || undefined,
    minImpact: minImpact || undefined
  });

  const { events: ticketmasterEvents, loading: eventsLoading, error: eventsError } = useTicketmasterEvents(
  selectedLocation,
  eventRadius,
  undefined, // keyword
  selectedEventCategory || undefined,
  selectedEventPrice !== 'all' ? selectedEventPrice : undefined
);

  const transformedRedditPosts = redditPosts.map((post, index) => ({
    id: index + 1000, 
    source: `r/${post.subreddit}`,
    title: post.title,
    content: post.selftext || 'Click to view full post',
    time: formatTime(post.created_utc),
    comments: post.num_comments,
    upvotes: post.score,
    type: 'reddit' as const,
    permalink: post.permalink,
    url: post.url,
    subreddit: post.subreddit
  }));


  const transformedNewsArticles = newsArticles.map((article, index) => ({
    id: `news-${index}`,
    source: article.source.name,
    title: article.title,
    content: article.description || 'Click to read full article',
    time: formatTimeFromDate(article.publishedAt),
    url: article.url,
    urlToImage: article.urlToImage,
    type: 'news' as const
  }));


  const transformedEvents = ticketmasterEvents.map((event, index) => ({
  id: event.id || `event-${index}`,
  title: event.name || 'Untitled Event',
  description: event.info || 'Click to view event details',
  startTime: event.dates?.start?.dateTime || event.dates?.start?.localDate || '',
  endTime: event.dates?.end?.dateTime || event.dates?.end?.localDate || '',
  timezone: event.dates?.timezone || 'UTC',
  url: event.url || '',
  venue: event._embedded?.venues?.[0] || null,
  isOnline: false,
  logoUrl: event.images?.[0]?.url || undefined,
  categoryId: event.classifications?.[0]?.segment?.id || undefined,
  subcategoryId: event.classifications?.[0]?.genre?.id || undefined,
  isFree: event.priceRanges ? event.priceRanges.some(price => price.min === 0) : false,
  capacity: undefined,
  hasAvailableTickets: true, 
  source: event._embedded?.venues?.[0]?.name || 'Ticketmaster',
  content: event.info || 'Click to view event details',
  time: event.dates?.start?.dateTime ? formatTimeFromDate(event.dates.start.dateTime) : 
        event.dates?.start?.localDate ? formatTimeFromDate(event.dates.start.localDate) : 'TBA',
  type: 'event' as const
}));



   const [contentSources, setContentSources] = useState([
    { name: 'Reddit', count: redditPosts.length, active: true },
    { name: 'X (Twitter)', count: 23, active: true },
    { name: 'Events', count: transformedEvents.length, active: true },
    { name: 'Local News', count: newsArticles.length, active: true }
  ]);


  const toggleContentSource = (index: number) => {
    setContentSources(prev => 
      prev.map((source, i) => 
        i === index ? { ...source, active: !source.active } : source
      )
    );
  };

  useEffect(() => {
    setContentSources(prev => prev.map(source => 
      source.name === 'Local News' 
        ? { ...source, count: newsArticles.length }
        : source.name === 'Reddit'
        ? { ...source, count: redditPosts.length }
        : source.name === 'Events'
        ? { ...source, count: transformedEvents.length }
        : source
    ));
  }, [newsArticles.length, redditPosts.length, transformedEvents.length]);

  const isLoading = loading || newsLoading;
  const hasError = error || newsError;

  // Mock data for the dashboard
  const stats = {
    reddit: redditPosts.length,
    twitter: 23,
    events: transformedEvents.length,
    news: newsArticles.length,
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

   const mockNonRedditPosts = posts.filter(post => post.type !== 'reddit' && post.type !== 'news');
    const allPosts = [...transformedRedditPosts,
       ...transformedNewsArticles, 
       ...transformedEvents,
        ...mockNonRedditPosts];

  const getFilteredPosts = () => {
    let filtered = allPosts;

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
    if (filter === 'All') return allPosts.length;
    
    const filterType = filter.toLowerCase() as 'reddit' | 'twitter' | 'events' | 'news';
    const typeMap = {
      'reddit': 'reddit',
      'twitter': 'twitter', 
      'events': 'event',
      'news': 'news'
    } as const;
    
    return allPosts.filter(post => post.type === typeMap[filterType]).length;
  };

  const filteredPosts = getFilteredPosts();

 

return (
  <div className="min-h-screen bg-gray-50">
    <Header />

    <div className="flex">
      <Sidebar
        selectedLocation={selectedLocation}
        setSelectedLocation={handleLocationChange}
        contentSources={contentSources}
        toggleContentSource={toggleContentSource}
        trendingTopics={trendingTopics}
      />

      {/* Main Content */}
      <main className="flex-1 p-6">
      
        {/* Events Filter - Only show when Events tab is active 
        {(activeFilter === 'Events' || activeFilter === 'All') && (
          <EventsFilter
            selectedCategory={selectedEventCategory}
            onCategoryChange={setSelectedEventCategory}
            selectedPrice={selectedEventPrice}
            onPriceChange={setSelectedEventPrice}
            radius={eventRadius}
            onRadiusChange={setEventRadius}
          />
        )}*/}
        
        
      
        {/* Sentiment Filter - Only show when News tab is active */}
        {(activeFilter === 'News' || activeFilter === 'All') && (
          <SentimentFilter
            selectedSentiment={selectedSentiment}
            onSentimentChange={setSelectedSentiment}
            analytics={analytics || undefined}
          />
        )}

        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-blue-800">
              Showing content for: {selectedLocation}
            </span>
          </div>
        </div>

        <StatsCards stats={stats} />

        {/* Loading/error states */}
        {loading && (
          <div className="bg-white rounded-lg border border-gray-200 mb-6 p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading content for {selectedLocation}...</p>
          </div>
        )}

        {hasError && (
          <div className="bg-red-50 border border-red-200 rounded-lg mb-6 p-6">
            <p className="text-red-600">{error || newsError || eventsError}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Show specific loading indicators */}
        {newsLoading && !loading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg mb-6 p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-blue-800 text-sm">Loading local news...</p>
            </div>
          </div>
        )}

        {eventsLoading && !loading && (
          <div className="bg-green-50 border border-green-200 rounded-lg mb-6 p-4">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600"></div>
              <p className="text-green-800 text-sm">Loading local events...</p>
            </div>
          </div>
        )}

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

          {/* Reddit Sort Options */}
          {(activeFilter === 'Reddit' || activeFilter === 'All') && (
            <div className="bg-white rounded-lg border border-gray-200 mb-6 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Reddit Posts</h3>
                <div className="flex items-center space-x-2">
                  <label htmlFor="reddit-sort" className="text-sm text-gray-600">Sort by:</label>
                  <select
                    id="reddit-sort"
                    value={redditSort}
                    onChange={(e) => setRedditSort(e.target.value as 'hot' | 'new' | 'top' | 'relevant')}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="relevant">Most Relevant</option>
                    <option value="hot">Hot</option>
                    <option value="new">New</option>
                    <option value="top">Top</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Events Section - Only when Events filter is active */}
          {activeFilter === 'Events' && (
            <div className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Local Events</h3>
              {eventsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading events...</p>
                </div>
              ) : transformedEvents.length > 0 ? (
                transformedEvents.map((event, index) => (
                  <EventCard key={`${event.id}-${index}`} event={event} />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No events found</h3>
                  <p className="text-gray-500">No events found for this location. Try adjusting your filters or search radius.</p>
                </div>
              )}
            </div>
          )}

          {/* News Articles with Enhanced Cards - Only when News filter is active */}
          {activeFilter === 'News' && (
            <div className="space-y-4 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Local News</h3>
              {newsLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading news...</p>
                </div>
              ) : newsArticles.length > 0 ? (
                newsArticles.map((article, index) => (
                  <NewsCard key={`${article.url}-${index}`} article={article} />
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-12 w-12 mx-auto" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No news found</h3>
                  <p className="text-gray-500">No news articles found for this location.</p>
                </div>
              )}
            </div>
          )}

          {/* Mixed Posts Feed - For All and other filters */}
          {activeFilter !== 'News' && activeFilter !== 'Events' && (
            <div className="divide-y divide-gray-200">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  // Use specific cards for different content types
                  if (post.type === 'news' && 'url' in post) {
                    const newsArticle = newsArticles.find(article => article.url === post.url);
                    return newsArticle ? (
                      <div key={post.id} className="p-6">
                        <NewsCard article={newsArticle} />
                      </div>
                    ) : (
                      <Post key={post.id} post={post} />
                    );
                  }
                  
                  if (post.type === 'event') {
                    const event = ticketmasterEvents.find(event => event.id === post.id);
                    return event ? (
                      <div key={post.id} className="p-6">
                        <EventCard event={event} />
                      </div>
                    ) : (
                      <Post key={post.id} post={post} />
                    );
                  }
                  
                  return <Post key={post.id} post={post} />;
                })
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
          )}
        </div>

        {/* Load More Button - only show if there are posts and not on specific sections */}
        {filteredPosts.length > 0 && activeFilter !== 'News' && activeFilter !== 'Events' && (
          <div className="text-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Load More Content
            </button>
          </div>
        )}

        {/* Load More Button for News */}
        {activeFilter === 'News' && newsArticles.length > 0 && (
          <div className="text-center mt-6">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              Load More News
            </button>
          </div>
        )}

        {/* Load More Button for Events */}
        {activeFilter === 'Events' && transformedEvents.length > 0 && (
          <div className="text-center mt-6">
            <button className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Load More Events
            </button>
          </div>
        )}
      </main>
    </div>
  </div>
);

}