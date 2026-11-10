'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { MediaItem, UserTracking, WatchStatus, MediaType } from '@/types/media';
import { translations, Language, TranslationRecord } from '@/lib/i18n';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';

interface TrackingContextType {
  items: UserTracking[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationRecord;
  syncStatus: SyncStatus;
  view: AppView;
  setView: (v: AppView) => void;
  activeTab: WatchStatus | 'all';
  setActiveTab: (tab: WatchStatus | 'all') => void;
  filterType: 'all' | MediaType;
  setFilterType: (type: 'all' | MediaType) => void;
  searchFilter: string;
  setSearchFilter: (q: string) => void;
  addMedia: (media: Omit<MediaItem, 'id'>, initialTracking: Partial<UserTracking>) => void;
  updateTracking: (id: string, updates: Partial<UserTracking>) => void;
  incrementEpisode: (id: string) => void;
  removeTracking: (id: string) => void;
  markCompleted: (id: string) => void;
  stats: {
    totalMovies: number;
    totalSeries: number;
    totalEpisodes: number;
    avgRating: string;
  };
}

export type SyncStatus = 'off' | 'local' | 'connecting' | 'synced' | 'error';
export type { WatchStatus, MediaType } from '@/types/media';
export type AppView = 'home' | 'stats' | 'settings' | 'about';

const STORAGE_KEY = 'shahadt_tracker_items_v1';
const LANG_STORAGE_KEY = 'shahadt_tracker_lang_v1';

const INITIAL_DEMO_ITEMS: UserTracking[] = [];

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

/* ---------- Cloud sync helpers (Supabase) ---------- */

type TrackingRow = {
  id: string;
  media_id: string;
  status: string;
  current_season: number | null;
  current_episode: number | null;
  total_episodes: number | null;
  user_rating: number | null;
  user_notes: string | null;
  started_at: string | null;
  completed_at: string | null;
  updated_at: string | null;
};

type MediaRow = {
  id: string;
  title_ar: string;
  title_en: string | null;
  type: string;
  poster_url: string | null;
  overview: string | null;
  release_year: number | null;
  source: string;
  source_url: string | null;
  created_at: string | null;
};

function rowToItem(row: TrackingRow, media?: MediaRow | null): UserTracking | null {
  if (!media) return null;
  return {
    id: row.id,
    remoteId: row.id,
    remoteMediaId: media.id,
    mediaId: media.id,
    status: row.status as WatchStatus,
    currentSeason: row.current_season ?? 1,
    currentEpisode: row.current_episode ?? 0,
    totalEpisodes: row.total_episodes ?? undefined,
    userRating: row.user_rating ?? undefined,
    userNotes: row.user_notes ?? undefined,
    startedAt: row.started_at ?? undefined,
    completedAt: row.completed_at ?? undefined,
    updatedAt: row.updated_at ?? new Date().toISOString(),
    media: {
      id: media.id,
      titleAr: media.title_ar,
      titleEn: media.title_en ?? undefined,
      type: media.type as MediaType,
      posterUrl: media.poster_url ?? '',
      overview: media.overview ?? undefined,
      releaseYear: media.release_year ?? undefined,
      source: media.source as MediaItem['source'],
      sourceUrl: media.source_url ?? undefined,
      createdAt: media.created_at ?? undefined,
    },
  };
}

function trackingPayload(item: UserTracking) {
  return {
    status: item.status,
    current_season: item.currentSeason ?? 1,
    current_episode: item.currentEpisode ?? 0,
    total_episodes: item.totalEpisodes ?? null,
    user_rating: item.userRating ?? null,
    user_notes: item.userNotes || null,
    completed_at: item.completedAt || null,
  };
}

function mediaPayload(media: MediaItem) {
  return {
    title_ar: media.titleAr,
    title_en: media.titleEn || null,
    type: media.type,
    poster_url: media.posterUrl || null,
    overview: media.overview || null,
    release_year: media.releaseYear ?? null,
    genres: media.genres ?? null,
    source: media.source,
    source_url: media.sourceUrl || null,
  };
}

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [items, setItems] = useState<UserTracking[]>([]);
  const [activeTab, setActiveTab] = useState<WatchStatus | 'all'>('watching');
  const [filterType, setFilterType] = useState<'all' | MediaType>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('local');
  const [view, setView] = useState<AppView>('home');

  // Keep a ref of items for async sync functions to read the latest version.
  const itemsRef = useRef<UserTracking[]>([]);
  const updateItemRefs = useRef<(id: string, patch: Partial<UserTracking>) => void>(() => {});

  /* ---------- Language ---------- */
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {}
    if (typeof document !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  };

  const t = translations[language];

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E50914', '#FFB800', '#FFFFFF', '#38BDF8'],
      });
    } catch {}
  };

  /* ---------- Cloud sync ---------- */

  const pushItem = useCallback(async (item: UserTracking) => {
    if (!isSupabaseConfigured || !supabase) return false;
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData?.session?.user?.id;
      if (!userId) return false;

      // 1) Resolve the media row.
      let mediaDbId = item.remoteMediaId ?? null;
      if (!mediaDbId) {
        if (item.media?.sourceUrl) {
          const { data: existing } = await supabase
            .from('media_items')
            .select('id')
            .eq('source_url', item.media.sourceUrl)
            .limit(1);
          if (existing && existing[0]) mediaDbId = existing[0].id;
        }
        if (!mediaDbId && item.media) {
          const { data: inserted, error } = await supabase
            .from('media_items')
            .insert(mediaPayload(item.media))
            .select('id');
          if (error) throw error;
          if (inserted && inserted[0]) mediaDbId = inserted[0].id;
        }
      }
      if (!mediaDbId) return false;

      // 2) Upsert the tracking row.
      let trackingDbId = item.remoteId ?? null;
      const payload = { ...trackingPayload(item), media_id: mediaDbId, user_id: userId };

      if (trackingDbId) {
        const { error } = await supabase
          .from('user_tracking')
          .update(trackingPayload(item))
          .eq('id', trackingDbId);
        if (error) throw error;
      } else {
        const { data: insertedRows, error } = await supabase
          .from('user_tracking')
          .insert(payload)
          .select('id');
        if (error) {
          // The row may exist (unique user_id+media_id) — try to find it.
          const { data: found } = await supabase
            .from('user_tracking')
            .select('id')
            .eq('user_id', userId)
            .eq('media_id', mediaDbId)
            .limit(1);
          if (found && found[0]) trackingDbId = found[0].id;
          else throw error;
        } else if (insertedRows && insertedRows[0]) {
          trackingDbId = insertedRows[0].id;
        }
      }
      if (!trackingDbId) return false;

      updateItemRefs.current(item.id, {
        remoteId: trackingDbId,
        remoteMediaId: mediaDbId,
      });
      return true;
    } catch (err) {
      console.error('Supabase sync error (pushItem):', err);
      setSyncStatus('error');
      return false;
    }
  }, []);

  const remoteRemove = useCallback(async (item: UserTracking) => {
    if (!isSupabaseConfigured || !supabase || !item.remoteId) return;
    try {
      await supabase.from('user_tracking').delete().eq('id', item.remoteId);
    } catch (err) {
      console.error('Supabase sync error (remove):', err);
    }
  }, []);

  /* ---------- Local helpers ---------- */

  const applyItemUpdate = useCallback((id: string, patch: Partial<UserTracking>) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...patch,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );
  }, []);

  useEffect(() => {
    updateItemRefs.current = (id, patch) => {
      applyItemUpdate(id, patch);
    };
  }, [applyItemUpdate]);

  // Persist to localStorage
  useEffect(() => {
    itemsRef.current = items;
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {}
  }, [items, isLoaded]);

  /* ---------- Startup: local load + cloud restore ---------- */
  useEffect(() => {
    const init = async () => {
      // 1) Language
      try {
        const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as Language;
        if (savedLang === 'ar' || savedLang === 'en') {
          setLanguageState(savedLang);
        }
      } catch {}

      // 2) Local items
      setItems(INITIAL_DEMO_ITEMS);
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
          setItems(JSON.parse(savedData));
        }
      } catch (e) {
        console.error('Error loading stored items:', e);
      }
      setIsLoaded(true);

      // 3) Cloud restore
      if (!isSupabaseConfigured || !supabase) {
        setSyncStatus('local');
        return;
      }

      setSyncStatus('connecting');
      try {
        // Ensure we have a session (anonymous sign-in) — falls back to local mode
        // if anonymous users are disabled for the project.
        let { data } = await supabase.auth.getSession();
        if (!data?.session) {
          const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
          if (anonError || !anonData?.session) {
            console.warn('Anonymous sign-in unavailable, running local-only.', anonError);
            setSyncStatus('local');
            return;
          }
          data = { session: anonData.session };
        }

        const { data: rows, error: rowsError } = await supabase
          .from('user_tracking')
          .select(
            'id, media_id, status, current_season, current_episode, total_episodes, user_rating, user_notes, started_at, completed_at, updated_at, media_items(*)'
          );
        if (rowsError) throw rowsError;

        const localItems = (JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') ||
          INITIAL_DEMO_ITEMS) as UserTracking[];
        const serverItems = (rows || [])
          .map((row: { [key: string]: unknown }) => {
            const { media_items, ...rest } = row;
            return rowToItem(rest as TrackingRow, (media_items as MediaRow) || null);
          })
          .filter(Boolean) as UserTracking[];

        if (serverItems.length > 0) {
          // Cloud is the source of truth after first sync.
          setItems(serverItems);
        } else {
          setItems(localItems);
          // First sync — push any real (non-demo) local items to the cloud.
          const realLocal = localItems.filter((i) => !i.id.startsWith('demo-'));
          if (realLocal.length > 0) {
            setSyncStatus('synced');
            for (const item of realLocal) {
              await pushItem(item);
            }
          }
        }
        setSyncStatus('synced');
      } catch (err) {
        console.error('Supabase restore error:', err);
        setSyncStatus('error');
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Mutations ---------- */

  const addMedia = (mediaData: Omit<MediaItem, 'id'>, initialTracking: Partial<UserTracking>) => {
    const mediaId = `media-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const trackingId = `track-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const newMedia: MediaItem = {
      ...mediaData,
      id: mediaId,
      createdAt: new Date().toISOString(),
    };

    const newTracking: UserTracking = {
      id: trackingId,
      mediaId: mediaId,
      status: initialTracking.status || 'watching',
      currentSeason: initialTracking.currentSeason || 1,
      currentEpisode: initialTracking.currentEpisode || 1,
      totalEpisodes: initialTracking.totalEpisodes,
      totalSeasons: initialTracking.totalSeasons,
      userRating: initialTracking.userRating,
      userNotes: initialTracking.userNotes || '',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      media: newMedia,
    };

    setItems((prev) => [newTracking, ...prev]);

    if (syncStatus !== 'error' && supabase) {
      pushItem(newTracking);
    }
  };

  const updateTracking = (id: string, updates: Partial<UserTracking>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated: UserTracking = {
          ...item,
          ...updates,
          updatedAt: new Date().toISOString(),
          media: updates.media ? { ...item.media!, ...updates.media } : item.media,
        };
        if (supabase && (updated.remoteId || updated.remoteMediaId)) {
          // Sync in the background; local state is already applied.
          (async () => {
            if (!updated.remoteId && updated.remoteMediaId) {
              // Row known remotely as unsaved? Try a full push first.
              const ok = await pushItem(updated);
              if (!ok) return;
            } else {
              try {
                const { error } = await supabase!
                  .from('user_tracking')
                  .update(trackingPayload(updated));
                if (error) {
                  // Row might not exist remotely (e.g. added while offline) — full push.
                  await pushItem(updated);
                }
              } catch {
                await pushItem(updated);
              }
            }
          })();
        }
        return updated;
      })
    );
  };

  const incrementEpisode = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextEp = (item.currentEpisode || 0) + 1;
        const isFinished = !!item.totalEpisodes && nextEp >= item.totalEpisodes;
        const updated: UserTracking = {
          ...item,
          currentEpisode: nextEp,
          status: isFinished ? 'completed' : item.status,
          completedAt: isFinished ? new Date().toISOString() : item.completedAt,
          updatedAt: new Date().toISOString(),
        };
        if (supabase && updated.remoteId) {
          (async () => {
            try {
              const { error } = await supabase!
                .from('user_tracking')
                .update(trackingPayload(updated));
              if (error) await pushItem(updated);
            } catch {
              await pushItem(updated);
            }
          })();
        }
        return updated;
      })
    );
  };

  const markCompleted = (id: string) => {
    triggerConfetti();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated: UserTracking = {
          ...item,
          status: 'completed',
          completedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        if (supabase && updated.remoteId) {
          (async () => {
            try {
              const { error } = await supabase!
                .from('user_tracking')
                .update(trackingPayload(updated));
              if (error) await pushItem(updated);
            } catch {
              await pushItem(updated);
            }
          })();
        }
        return updated;
      })
    );
  };

  const removeTracking = (id: string) => {
    const target = itemsRef.current.find((i) => i.id === id);
    if (target) remoteRemove(target);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const stats = useMemo(() => {
    const completedMovies = items.filter(
      (i) => i.status === 'completed' && i.media?.type === 'movie'
    ).length;
    const allSeries = items.filter((i) => i.media?.type === 'series').length;
    const totalEpisodes = items.reduce((acc, curr) => {
      return acc + (curr.media?.type === 'series' ? curr.currentEpisode || 0 : 0);
    }, 0);

    const ratedItems = items.filter((i) => typeof i.userRating === 'number' && i.userRating > 0);
    const avg =
      ratedItems.length > 0
        ? (
            ratedItems.reduce((acc, curr) => acc + (curr.userRating || 0), 0) /
            ratedItems.length
          ).toFixed(1)
        : '0.0';

    return {
      totalMovies: completedMovies,
      totalSeries: allSeries,
      totalEpisodes: totalEpisodes,
      avgRating: avg,
    };
  }, [items]);

  return (
    <TrackingContext.Provider
      value={{
        items,
        language,
        setLanguage,
        t,
        syncStatus,
        view,
        setView,
        activeTab,
        setActiveTab,
        filterType,
        setFilterType,
        searchFilter,
        setSearchFilter,
        addMedia,
        updateTracking,
        incrementEpisode,
        removeTracking,
        markCompleted,
        stats,
      }}
    >
      {children}
    </TrackingContext.Provider>
  );
}

export function useTracking() {
  const context = useContext(TrackingContext);
  if (!context) {
    throw new Error('useTracking must be used within a TrackingProvider');
  }
  return context;
}
