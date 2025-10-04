import { NextRequest, NextResponse } from 'next/server';
import { PlaylistData } from '@/types/playlist';

export const dynamic = 'force-dynamic';

const CACHE_DURATION_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  data: PlaylistData;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const playlistUrl = searchParams.get('url');
  
  if (!playlistUrl) {
    return NextResponse.json(
      { error: 'Playlist URL is required' },
      { status: 400 }
    );
  }

  try {
    const apiUrl = `https://playlist-extractor.onrender.com/get_playlist?playlist_url=${encodeURIComponent(playlistUrl)}`;
    
    console.log('Fetching from:', apiUrl);
    
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }

    const data = await response.json();
    console.log('Data received:', data);
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch' },
      { status: 500 }
    );
  }
}
