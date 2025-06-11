import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  console.log('Proxy request for:', imageUrl); // Debug log

  if (!imageUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    console.log('Fetching image:', imageUrl); // Debug log
    
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'LocalLens/1.0.0',
        'Accept': 'image/*',
        'Referer': 'https://www.reddit.com/'
      },
    });

    console.log('Fetch response status:', response.status); // Debug log

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    console.log('Returning image, content-type:', contentType, 'size:', imageBuffer.byteLength); // Debug log

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json(
      { error: 'Failed to proxy image' },
      { status: 500 }
    );
  }
}