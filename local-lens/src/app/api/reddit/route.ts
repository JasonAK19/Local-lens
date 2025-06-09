import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');
  const sort = searchParams.get('sort') || 'hot';
  const limit = searchParams.get('limit') || '15';
  const timeframe = searchParams.get('timeframe') || 'day';

  if (!subreddit) {
    return NextResponse.json({ error: 'Subreddit is required' }, { status: 400 });
  }

  try {
    const url = sort === 'top' 
      ? `https://www.reddit.com/r/${subreddit}/top.json?limit=${limit}&t=${timeframe}`
      : sort === 'relevant'
      ? `https://www.reddit.com/r/${subreddit}/hot.json?limit=20`
      : `https://www.reddit.com/r/${subreddit}/${sort}.json?limit=${limit}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'LocalLens/1.0.0',
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: 'Subreddit not found' }, { status: 404 });
      }
      throw new Error(`Reddit API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching Reddit data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Reddit data' },
      { status: 500 }
    );
  }
}