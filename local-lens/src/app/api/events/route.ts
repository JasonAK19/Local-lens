import { NextRequest, NextResponse } from 'next/server';
import { TicketmasterEvent } from '../../hooks/useTicketMasterApi';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location');
  const pageSize = parseInt(searchParams.get('pageSize') || '20');
  const radius = searchParams.get('radius') || '25';
  const category = searchParams.get('category');
  const price = searchParams.get('price');

  if (!location) {
    return NextResponse.json({ error: 'Location parameter required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.TICKETMASTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Ticketmaster API key not configured' }, { status: 500 });
    }

    // Parse city and state from location string
    const [city, state] = location.split(',').map(s => s.trim());

    // Build Ticketmaster API URL
    const tmUrl = new URL('https://app.ticketmaster.com/discovery/v2/events.json');
    tmUrl.searchParams.append('apikey', apiKey);
    tmUrl.searchParams.append('city', city);
    if (state) tmUrl.searchParams.append('stateCode', state);
    tmUrl.searchParams.append('radius', radius);
    tmUrl.searchParams.append('unit', 'miles');
    tmUrl.searchParams.append('size', pageSize.toString());
    tmUrl.searchParams.append('sort', 'date,asc');
    if (category) tmUrl.searchParams.append('classificationName', category);
    // Add price filtering if needed
    if (price && price !== 'all') {
      if (price === 'free') {
        tmUrl.searchParams.append('priceRange', '0-0');
      }
      // Add other price range logic if needed
    }

    const response = await fetch(tmUrl.toString());
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: 'Ticketmaster API error', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    const events = (data._embedded?.events || []).map((event: TicketmasterEvent) => ({
      id: event.id,
      name: event.name || 'Untitled Event',
      info: event.info || '',
      url: event.url,
      dates: {
        start: {
          dateTime: event.dates?.start?.dateTime,
          localDate: event.dates?.start?.localDate,
          localTime: event.dates?.start?.localTime
        },
        end: {
          dateTime: event.dates?.end?.dateTime,
          localDate: event.dates?.end?.localDate,
          localTime: event.dates?.end?.localTime
        },
        timezone: event.dates?.timezone || 'UTC'
      },
      _embedded: {
        venues: event._embedded?.venues || []
      },
      images: event.images || [],
      classifications: event.classifications || [],
      priceRanges: event.priceRanges || []
    }));

    return NextResponse.json({
      events,
      totalResults: data.page?.totalElements || events.length,
      location,
    });
  } catch (err) {
    console.error('Error fetching events data:', err);
    return NextResponse.json(
      { error: 'Failed to fetch events data' },
      { status: 500 }
    );
  }
}