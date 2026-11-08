'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { MediaItem, UserTracking, WatchStatus, MediaType } from '@/types/media';
import { translations, Language, TranslationRecord } from '@/lib/i18n';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import confetti from 'canvas-confetti';

interface TrackingContextType {
  items: UserTracking[];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationRecord;
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

const STORAGE_KEY = 'shahadt_tracker_items_v1';
const LANG_STORAGE_KEY = 'shahadt_tracker_lang_v1';

const INITIAL_DEMO_ITEMS: UserTracking[] = [
  {
    id: 'demo-1',
    mediaId: 'media-1',
    status: 'watching',
    currentSeason: 1,
    currentEpisode: 8,
    totalEpisodes: 30,
    userRating: 9.5,
    userNotes: 'أداء تمثيلي استثنائي وإخراج سينمائي مبهر.',
    updatedAt: new Date().toISOString(),
    media: {
      id: 'media-1',
      titleAr: 'مسلسل الحشاشين',
      titleEn: 'The Assassins',
      type: 'series',
      posterUrl: 'https://topcinemaa.vip/wp-content/uploads/2026/08/9pKPTugulAt0EtH0g4gvJGffPSg-367x550.jpg',
      releaseYear: 2024,
      overview: 'تدور الأحداث في إطار تاريخي، في القرن الحادي عشر، حول زعيم الحشاشين حسن الصباح، وقيادته للفرقة التي اشتهرت بتنفيذ عمليات اغتيال دموية.',
      source: 'topcinema',
      sourceUrl: 'https://topcinemaa.vip',
    },
  },
  {
    id: 'demo-2',
    mediaId: 'media-2',
    status: 'completed',
    currentSeason: 1,
    currentEpisode: 1,
    totalEpisodes: 1,
    userRating: 9.0,
    userNotes: 'أجواء مظلمة ممتازة وموسيقى تصويرية عبقرية.',
    completedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    media: {
      id: 'media-2',
      titleAr: 'فيلم The Batman',
      titleEn: 'The Batman',
      type: 'movie',
      posterUrl: 'https://topcinemaa.vip/wp-content/uploads/2026/08/9pKPTugulAt0EtH0g4gvJGffPSg.jpg',
      releaseYear: 2022,
      overview: 'في عامه الثاني من مكافحة الجريمة، يسعى باتمان لكشف الفساد في مدينة غوثام بينما يتعقب قاتلاً متسلسلاً يُعرف باسم ريدلر.',
      source: 'topcinema',
      sourceUrl: 'https://topcinemaa.vip',
    },
  },
];

const TrackingContext = createContext<TrackingContextType | undefined>(undefined);

export function TrackingProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ar');
  const [items, setItems] = useState<UserTracking[]>([]);
  const [activeTab, setActiveTab] = useState<WatchStatus | 'all'>('watching');
  const [filterType, setFilterType] = useState<'all' | MediaType>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize language and items from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as Language;
      if (savedLang === 'ar' || savedLang === 'en') {
        setLanguageState(savedLang);
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = savedLang;
      } else {
        document.documentElement.dir = 'rtl';
        document.documentElement.lang = 'ar';
      }

      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        setItems(JSON.parse(savedData));
      } else {
        setItems(INITIAL_DEMO_ITEMS);
      }
    } catch (e) {
      console.error('Error loading stored items:', e);
      setItems(INITIAL_DEMO_ITEMS);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save items to localStorage whenever updated
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving items to localStorage:', e);
    }
  }, [items, isLoaded]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    } catch (e) {
      console.error('Error saving lang:', e);
    }
  };

  const t = translations[language];

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
      currentEpisode: initialTracking.currentEpisode || (newMedia.type === 'movie' ? 1 : 1),
      totalEpisodes: initialTracking.totalEpisodes,
      totalSeasons: initialTracking.totalSeasons,
      userRating: initialTracking.userRating,
      userNotes: initialTracking.userNotes || '',
      startedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      media: newMedia,
    };

    setItems((prev) => [newTracking, ...prev]);

    // If Supabase is configured, sync to database
    if (isSupabaseConfigured && supabase) {
      const client = supabase;
      (async () => {
        try {
          const { data } = await client
            .from('media_items')
            .insert({
              title_ar: newMedia.titleAr,
              title_en: newMedia.titleEn,
              type: newMedia.type,
              poster_url: newMedia.posterUrl,
              overview: newMedia.overview,
              release_year: newMedia.releaseYear,
              source: newMedia.source,
              source_url: newMedia.sourceUrl,
            })
            .select();

          if (data && data[0]) {
            await client.from('user_tracking').insert({
              media_id: data[0].id,
              status: newTracking.status,
              current_season: newTracking.currentSeason,
              current_episode: newTracking.currentEpisode,
              total_episodes: newTracking.totalEpisodes,
              user_rating: newTracking.userRating,
              user_notes: newTracking.userNotes,
            });
          }
        } catch (err) {
          console.error('Supabase sync error:', err);
        }
      })();
    }
  };

  const updateTracking = (id: string, updates: Partial<UserTracking>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = {
            ...item,
            ...updates,
            updatedAt: new Date().toISOString(),
            media: updates.media ? { ...item.media!, ...updates.media } : item.media,
          };
          return updated;
        }
        return item;
      })
    );
  };

  const incrementEpisode = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextEp = (item.currentEpisode || 0) + 1;
          const isFinished = item.totalEpisodes && nextEp >= item.totalEpisodes;
          if (isFinished) {
            triggerConfetti();
          }
          return {
            ...item,
            currentEpisode: nextEp,
            status: isFinished ? 'completed' : item.status,
            completedAt: isFinished ? new Date().toISOString() : item.completedAt,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

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

  const markCompleted = (id: string) => {
    triggerConfetti();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: 'completed',
            completedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
  };

  const removeTracking = (id: string) => {
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
