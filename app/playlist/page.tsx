'use client';

import { useState, useMemo } from 'react';
import { Search, Link, Loader, Copy, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { PlaylistData, Video } from '@/types/playlist';

export default function PlaylistPage() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUrls, setShowUrls] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchPlaylist = async () => {
    if (!playlistUrl.trim()) {
      setError('Please enter a playlist URL');
      return;
    }

    setLoading(true);
    setError('');
    setPlaylistData(null);

    try {
      const response = await fetch(`/api/playlist?url=${encodeURIComponent(playlistUrl)}`);

      if (!response.ok) {
        let errorMessage = 'Failed to fetch playlist';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
          if (errorData.details) {
            errorMessage += `. ${errorData.details}`;
          }
        } catch {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }

      const data: PlaylistData = await response.json();
      setPlaylistData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching the playlist');
    } finally {
      setLoading(false);
    }
  };

  const filteredVideos = useMemo(() => {
    if (!playlistData?.videos) return [];

    if (!searchQuery.trim()) return playlistData.videos;

    const query = searchQuery.toLowerCase();
    return playlistData.videos.filter(video =>
      video.title.toLowerCase().includes(query) ||
      video.video_id.toLowerCase().includes(query)
    );
  }, [playlistData, searchQuery]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      fetchPlaylist();
    }
  };

  const copyTitles = async () => {
    if (!playlistData?.videos) return;
    
    const titlesText = playlistData.videos
      .map(video => `${video.position}. ${video.title}`)
      .join('\n');
    
    try {
      await navigator.clipboard.writeText(titlesText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-3">
            YouTube Playlist Extractor
          </h1>
          <p className="text-slate-600 text-lg">
            Extract and search through YouTube playlists instantly
          </p>
        </div>

        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle>Enter Playlist URL</CardTitle>
            <CardDescription>
              Paste a YouTube playlist URL to extract all videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="https://www.youtube.com/playlist?list=..."
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
                disabled={loading}
              />
              <Button
                onClick={fetchPlaylist}
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Loading
                  </>
                ) : (
                  'Extract'
                )}
              </Button>
            </div>
            {error && (
              <p className="text-red-600 text-sm mt-3">{error}</p>
            )}
          </CardContent>
        </Card>

        {playlistData && (
          <>
            <Card className="mb-6 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search videos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="show-urls"
                      checked={showUrls}
                      onCheckedChange={setShowUrls}
                    />
                    <Label htmlFor="show-urls" className="cursor-pointer">
                      Show URLs
                    </Label>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    {filteredVideos.length} of {playlistData.count} videos
                  </Badge>
                  <Button
                    onClick={copyTitles}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy All
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              {filteredVideos.length === 0 ? (
                <Card className="shadow-md">
                  <CardContent className="py-12 text-center">
                    <p className="text-slate-500">No videos found matching your search</p>
                  </CardContent>
                </Card>
              ) : (
                filteredVideos.map((video) => (
                  <Card
                    key={video.video_id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardContent className="py-4">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center font-semibold text-slate-700">
                          {video.position}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 mb-2 leading-snug">
                            {video.title}
                          </h3>
                          {showUrls && (
                            <a
                              href={video.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              <Link className="h-3 w-3 mr-1" />
                              {video.video_url}
                            </a>
                          )}
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <a
                              href={video.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Watch
                            </a>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}