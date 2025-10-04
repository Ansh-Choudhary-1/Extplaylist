import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'YouTube Playlist Extractor - Extract & Search Playlists',
  description: 'Extract all videos from any YouTube playlist. Search, filter, and access videos instantly with our fast and optimized playlist extractor.',
  keywords: ['youtube', 'playlist', 'extractor', 'videos', 'search', 'download'],
  openGraph: {
    title: 'YouTube Playlist Extractor',
    description: 'Extract all videos from any YouTube playlist instantly',
    type: 'website',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-24 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">
            YouTube Playlist Extractor
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Extract, search, and manage YouTube playlists with ease
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/playlist">Get Started</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Fast Extraction</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Instantly extract all videos from any YouTube playlist
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Smart Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quickly find specific videos with real-time search
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cached Results</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Lightning-fast performance with intelligent caching
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
