import { useState, useEffect } from 'react';

export interface TicketmasterEvent {
  id: string;
  name: string;
  url: string;
  dates: { 
    start: { 
      dateTime?: string;
      localDate?: string;
      localTime?: string;
    };
    end?: {
      dateTime?: string;
      localDate?: string;
      localTime?: string;
    };
    timezone?: string;
  };
  info?: string;
  priceRanges?: { min: number; max: number; currency: string }[];
  _embedded?: { 
    venues: { 
      id: string;
      name: string; 
      city: { name: string };
      state?: { stateCode: string };
    }[] 
  };
  images?: { url: string; width: number; height: number }[];
  classifications?: {
    segment?: { id: string; name: string };
    genre?: { id: string; name: string };
  }[];
}

export function useTicketmasterEvents(
  location: string,
  radius: string = '25',
  keyword?: string,
  category?: string,
  price?: string
) {
  const [events, setEvents] = useState<TicketmasterEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location) return;
    setLoading(true);

    const params = new URLSearchParams({
      location,
      radius,
      pageSize: '20',
    });
    if (keyword) params.append('keyword', keyword);
    if (category) params.append('category', category);
    if (price) params.append('price', price);

    fetch(`/api/events?${params}`)
      .then(res => res.json())
      .then(data => {
        setEvents(data.events || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch events');
        setLoading(false);
      });
  }, [location, radius, keyword, category, price]);

  return { events, loading, error };
}