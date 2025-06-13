import React from 'react';
import Image from 'next/image';
import { Calendar, Clock, MapPin, Users, ExternalLink} from 'lucide-react';

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  timezone: string;
  url: string;
  venue: {
    id: string;
    name: string;
  } | null;
  isOnline: boolean;
  logoUrl?: string;
  categoryId?: string;
  subcategoryId?: string;
  isFree: boolean;
  capacity?: number;
  hasAvailableTickets: boolean;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatEventDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays < 7) return `In ${diffInDays} days`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const formatEventTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const truncateDescription = (text: string, maxLength: number = 150): string => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-6 mb-4">
      {/* Header with logo and price */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          {event.logoUrl && (
            <Image
              src={event.logoUrl} 
              alt={event.title}
              className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 line-clamp-2">
              {event.title}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{formatEventDate(event.startTime)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{formatEventTime(event.startTime)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            event.isFree 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {event.isFree ? 'Free' : 'Paid'}
          </div>
          
          {!event.hasAvailableTickets && (
            <div className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">
              Sold Out
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {truncateDescription(event.description)}
        </p>
      )}

      {/* Event details */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            {event.isOnline ? (
              <>
                <div className="h-4 w-4 mr-1 bg-purple-500 rounded-full flex items-center justify-center">
                  <div className="h-2 w-2 bg-white rounded-full"></div>
                </div>
                <span>Online Event</span>
              </>
            ) : (
              <>
                <MapPin className="h-4 w-4 mr-1" />
                <span>{event.venue?.name || 'Venue TBA'}</span>
              </>
            )}
          </div>
          
          {event.capacity && (
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Up to {event.capacity} attendees</span>
            </div>
          )}
        </div>
        
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View Event
          <ExternalLink className="h-3 w-3 ml-1" />
        </a>
      </div>
    </div>
  );
}