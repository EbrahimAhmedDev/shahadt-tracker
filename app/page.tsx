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
import { Film, Play, Plus, Clapperboard } from 'lucide-react';

export default function Home() {
  const { items, activeTab, filterType, searchFilter, t, language, stats } = useTracking();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserTracking | null>(null);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (activeTab !== 'all' && item.status !== activeTab) return false;
      if (filterType !== 'all' && item.media?.type !== filterType) return false;
      if (searchFilter.trim()) {
        const query = searchFilter.toLowerCase();
        const titleAr = (item.media?.titleAr || '').toLowerCase();
        const titleEn = (item.media?.titleEn || '').toLowerCase();
        const notes = (item.userNotes || '').toLowerCase();
        if (!titleAr.includes(query) && !titleEn.includes(query) && !notes.includes(query)) return false;
      }
      return true;
    });
  }, [items, activeTab, filterType, searchFilter]);

  const featuredItem = useMemo(() => {
    return items.find((i) => i.status === 'watching') || null;
  }, [items]);

  const hasRealItems = items.some((i) => !i.id.startsWith('demo-'));

  const featuredProgress =
    featuredItem?.totalEpisodes && featuredItem.totalEpisodes > 0
      ? Math.min(100, Math.round(((featuredItem.currentEpisode || 0) / featuredItem.totalEpisodes) * 100))
      : null;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'var(--bg)', color: 'var(--text-hi)' }}
    >
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pb-16">

        {/* ============ Empty first-time state ============ */}
        {!hasRealItems && filteredItems.length === 0 ? (
          <div className="empty my-16 rounded-[var(--r-lg)]" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--stroke)' }}>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'var(--bg-raised)', border: '1px solid var(--stroke)' }}
            >
              <Film className="w-7 h-7 text-[var(--text-low)]" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold mb-2">{t.emptyList}</h1>
            <p className="text-sm text-[var(--text-mid)] max-w-md leading-relaxed mb-6">{t.emptyListSub}</p>
            <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-lg">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              {t.addMedia}
            </button>
          </div>
        ) : (
          <>
            {/* ============ Featured: currently watching ============ */}
            {featuredItem && featuredItem.media && (
              <section
                className="mt-6 rounded-[var(--r-lg)] overflow-hidden relative"
                style={{ background: 'var(--bg-elevated)', border: '1px solid var(--stroke)' }}
                dir="ltr"
              >
                <div className="flex flex-col sm:flex-row gap-0">
                  {/* Poster */}
                  {featuredItem.media.posterUrl && (
                    <div className="sm:w-56 shrink-0 relative aspect-[2/3] sm:aspect-auto sm:self-stretch bg-[#0d0f13] cursor-pointer" onClick={() => setSelectedItem(featuredItem)}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={featuredItem.media.posterUrl}
                        alt={featuredItem.media.titleAr}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                      <span className="status-chip status-watching">{t.watching}</span>
                      <span className="chip">
                        {featuredItem.media.type === 'series' ? t.series : t.movie}
                        {featuredItem.media.releaseYear ? ` · ${featuredItem.media.releaseYear}` : ''}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold leading-snug mb-3">
                      {language === 'ar'
                        ? featuredItem.media.titleAr
                        : (featuredItem.media.titleEn || featuredItem.media.titleAr)}
                    </h1>

                    {featuredItem.media.overview && (
                      <p className="text-sm text-[var(--text-mid)] leading-relaxed line-clamp-2 max-w-2xl mb-5">
                        {featuredItem.media.overview}
                      </p>
                    )}

                    {/* Series progress */}
                    {featuredItem.status === 'watching' && featuredProgress !== null && (
                      <div className="max-w-sm mb-5">
                        <div className="flex justify-between text-[0.75rem] text-[var(--text-mid)] nums mb-1.5">
                          <span>
                            {t.episode} {featuredItem.currentEpisode || 0} / {featuredItem.totalEpisodes}
                          </span>
                          <span className="text-[var(--text-hi)]">{featuredProgress}%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-fill" style={{ width: `${featuredProgress}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2 mt-auto">
                      <button onClick={() => setSelectedItem(featuredItem)} className="btn btn-primary btn-lg">
                        <Play className="w-4 h-4" />
                        {t.viewDetails}
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* ============ Stats ============ */}
            <StatsSummary />

            {/* ============ Tabs ============ */}
            <StatusFilterTabs />

            {/* ============ Grid ============ */}
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 my-6">
                {filteredItems.map((item) => (
                  <MediaCard
                    key={item.id}
                    item={item}
                    onSelect={(selected) => setSelectedItem(selected)}
                  />
                ))}
              </div>
            ) : (
              <div className="empty my-12">
                <p className="text-sm text-[var(--text-mid)]">{t.noResults}</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--stroke)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.75rem] text-[var(--text-low)]">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-3.5 h-3.5" />
            <span className="font-semibold text-[var(--text-mid)]">{t.appTitle}</span>
            <span>·</span>
            <span className="nums">{stats.totalMovies + stats.totalSeries}</span>
          </div>
          <span>البيانات من: توب سينما & أهواك</span>
        </div>
      </footer>

      <AddMediaModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <MediaDetailModal
        key={selectedItem?.id ?? 'none'}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </div>
  );
}
