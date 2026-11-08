export type MediaType = 'movie' | 'series';
export type WatchStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
export type MediaSource = 'topcinema' | 'ahwak' | 'manual';

export interface MediaItem {
  id: string;
  titleAr: string;
  titleEn?: string;
  type: MediaType;
  posterUrl: string;
  overview?: string;
  releaseYear?: number;
  genres?: string[];
  source: MediaSource;
  sourceUrl?: string;
  createdAt?: string;
}

export interface UserTracking {
  id: string;
  userId?: string;
  remoteId?: string; // Supabase user_tracking.id when synced
  remoteMediaId?: string; // Supabase media_items.id when synced
  mediaId: string;
  status: WatchStatus;
  currentSeason: number;
  currentEpisode: number;
  totalEpisodes?: number;
  totalSeasons?: number;
  userRating?: number; // 1 to 10
  userNotes?: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt: string;
  media?: MediaItem;
}

export interface SearchResultItem {
  id: string;
  title: string;
  originalTitle?: string;
  type: MediaType;
  posterUrl: string;
  year?: string;
  overview?: string;
  source: 'topcinema' | 'ahwak';
  sourceUrl: string;
}
