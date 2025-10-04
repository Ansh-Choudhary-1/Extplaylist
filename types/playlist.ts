export interface Video {
  title: string;
  video_id: string;
  video_url: string;
  position: number;
}

export interface PlaylistData {
  count: number;
  videos: Video[];
}

export interface PlaylistCache {
  id: string;
  playlist_url: string;
  data: PlaylistData;
  created_at: string;
  updated_at: string;
}
