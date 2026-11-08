'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { StatsSummary } from '@/components/StatsSummary';
import { StatusFilterTabs } from '@/components/StatusFilterTabs';
import { MediaCard } from '@/components/MediaCard';
import { AddMediaModal } from '@/components/AddMediaModal';
import { MediaDetailModal } from '@/components/MediaDetailModal';
import { useTracking } from '@/lib/store/tracking-context';
import { UserTracking } from '@/types/media';
import { Film, Play, Sparkles, Plus, Clapperboard, Heart } from 'lucide-react';

export default function Home() {
  const { items, activeTab, filterType, searchFilter, t, language } = useTracking();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserTracking | null>(null);

  // Filtered items list
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Status filter
      if (activeTab !== 'all' && item.status !== activeTab) {
        return false;
      }

      // 2. Type filter
      if (filterType !== 'all' && item.media?.type !== filterType) {
        return false;
      }

      // 3. Search query filter
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const titleAr = (item.media?.titleAr || '').toLowerCase();
        const titleEn = (item.media?.titleEn || '').toLowerCase();
        const notes = (item.userNotes || '').toLowerCase();
        if (!titleAr.includes(query) && !titleEn.includes(query) && !notes.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeTab, filterType, searchFilter]);

  // Featured currently-watching item for the spotlight hero
  const featuredItem = useMemo(() => {
    return items.find((i) => i.status === 'watching') || items[0] || null;
  }, [items]);

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      {/* Top Navigation */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Cinema Hero Spotlight (if watching exists) */}
        {featuredItem && featuredItem.media && (
          <div className="relative mb-8 rounded-3xl overflow-hidden glass-panel border border-white/10 p-6 sm:p-10 shadow-2xl">
            {/* Ambient Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-slate-950/80 to-[#080C14] z-0" />
            {featuredItem.media.posterUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={featuredItem.media.posterUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-20 z-0"
              />
            )}

            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-black bg-red-600 text-white shadow-lg shadow-red-600/40 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    {featuredItem.status === 'watching' ? t.watching : t.completed}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    {featuredItem.media.type === 'series' ? t.series : t.movie}
                    {featuredItem.media.releaseYear ? ` • ${featuredItem.media.releaseYear}` : ''}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
                  {language === 'ar'
                    ? featuredItem.media.titleAr
                    : (featuredItem.media.titleEn || featuredItem.media.titleAr)}
                </h1>

                {featuredItem.media.overview && (
                  <p className="text-sm text-slate-300 line-clamp-2 leading-relaxed mb-4">
                    {featuredItem.media.overview}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedItem(featuredItem)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white text-slate-950 hover:bg-slate-200 shadow-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>متابعة التفاصيل</span>
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.addMedia}</span>
                  </button>
                </div>
              </div>

              {/* Poster Thumbnail */}
              <div
                onClick={() => setSelectedItem(featuredItem)}
                className="hidden md:block w-36 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20 flex-shrink-0 cursor-pointer hover:scale-105 transition-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredItem.media.posterUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats Summary */}
        <StatsSummary />

        {/* Filter Navigation Tabs */}
        <StatusFilterTabs />

        {/* Media Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 my-6">
            {filteredItems.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onSelect={(selected) => setSelectedItem(selected)}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="my-16 flex flex-col items-center justify-center text-center glass-panel p-10 rounded-3xl border border-white/5 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-3xl bg-slate-900 flex items-center justify-center text-slate-500 mb-4 border border-white/5">
              <Film className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{t.emptyList}</h3>
            <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
              {t.emptyListSub}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.addMedia}</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-[#06090F] py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-4 h-4 text-red-500" />
            <span className="font-bold text-slate-400 font-cairo">شاهدت | Shahadt</span>
            <span>—</span>
            <span>تتبع الأفلام والمسلسلات</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>البيانات من: توب سينما (Top Cinema) & أهواك تي في (Ahwak TV)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <MediaDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
