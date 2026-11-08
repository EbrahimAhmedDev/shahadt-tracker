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
    <div className="min-h-screen bg-[#12100c] text-[#f3ecdd] flex flex-col">
      {/* Top Navigation */}
      <Navbar onOpenAddModal={() => setIsAddModalOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-5 sm:px-8 py-8">

        {/* بطاقة الإبراز — عنوان فيلم، بلا زجاج ولا توهج */}
        {featuredItem && featuredItem.media && (
          <div className="relative mb-10 overflow-hidden rounded-2xl border hairline bg-[#1b1710]">
            {/* البوستر كإضاءة مجاورة من الجهة */}
            {featuredItem.media.posterUrl && (
              <div className="absolute inset-0 flex" aria-hidden>
                <div className="absolute inset-0 bg-[#1b1710]" />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredItem.media.posterUrl}
                  alt=""
                  className="absolute h-full w-1/3 object-cover opacity-[0.22] blur-2xl"
                  style={{ insetInlineEnd: 0 }}
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to left, transparent, #1b1710 55%)' }}
                />
              </div>
            )}

            <div className="relative z-10 flex gap-8 p-7 sm:p-10 items-start">
              <div className="flex-1 min-w-0">
                {/* سطر حدّة */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="eyebrow">
                    {featuredItem.media.type === 'series' ? t.series : t.movie}
                    {featuredItem.media.releaseYear ? ` · ${featuredItem.media.releaseYear}` : ''}
                  </span>
                  <span className="h-px flex-1 max-w-[80px] bg-[#f2b441]/50" aria-hidden />
                  <span className="text-[0.72rem] text-[#f2b441]">
                    {featuredItem.status === 'watching' ? t.watching : t.completed}
                  </span>
                </div>

                <h1 className="text-[1.7rem] sm:text-[2.4rem] font-bold text-[#f3ecdd] leading-[1.25] mb-4">
                  {language === 'ar'
                    ? featuredItem.media.titleAr
                    : (featuredItem.media.titleEn || featuredItem.media.titleAr)}
                </h1>

                {featuredItem.media.overview && (
                  <p className="text-[0.85rem] text-[#cfc4ab] leading-[1.9] line-clamp-2 max-w-xl mb-6">
                    {featuredItem.media.overview}
                  </p>
                )}

                {featuredItem.status === 'watching' && featuredItem.totalEpisodes ? (
                  <div className="max-w-xs mb-6">
                    <div className="flex justify-between text-[0.7rem] text-[#948b76] mb-1.5 tabular-nums">
                      <span>{t.episode} {featuredItem.currentEpisode || 0} / {featuredItem.totalEpisodes}</span>
                      <span className="text-[#f2b441]">{Math.round(((featuredItem.currentEpisode || 0) / featuredItem.totalEpisodes) * 100)}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: '#2e281c' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${((featuredItem.currentEpisode || 0) / featuredItem.totalEpisodes) * 100}%`, background: 'var(--s-amber)' }}
                      />
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => setSelectedItem(featuredItem)}
                    className="btn-solid px-5 py-2.5 text-[0.82rem]"
                  >
                    <span className="flex items-center gap-2">
                      <Play className="w-3.5 h-3.5" />
                      {t.viewDetails}
                    </span>
                  </button>
                </div>
              </div>

              {/* البوستر المسطح — البطل الحقيقي */}
              {featuredItem.media.posterUrl && (
                <div
                  onClick={() => setSelectedItem(featuredItem)}
                  className="hidden md:block w-44 lg:w-52 aspect-[2/3] overflow-hidden rounded-lg shrink-0 cursor-pointer"
                  style={{ boxShadow: '0 1px 0 rgba(243,236,221,0.12), 0 20px 40px -20px rgba(0,0,0,0.7)' }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={featuredItem.media.posterUrl}
                    alt={featuredItem.media.titleAr}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* الأرقام كسطر واحد */}
        <StatsSummary />

        {/* Filter Navigation Tabs */}
        <StatusFilterTabs />

        {/* Media Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5 my-8">
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
          <div className="my-16 flex flex-col items-center justify-center text-center max-w-sm mx-auto py-12 px-6 rounded-2xl border hairline bg-[#1b1710]">
            <Film className="w-8 h-8 text-[#38301f] mb-5" strokeWidth={1.5} />
            <h3 className="text-base font-semibold text-[#f3ecdd] mb-2">{t.emptyList}</h3>
            <p className="text-[0.8rem] text-[#948b76] leading-relaxed mb-6">{t.emptyListSub}</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn-solid px-5 py-2.5 text-[0.82rem]"
            >
              {t.addMedia}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t hairline py-6">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.72rem] text-[#6d6450]">
          <div className="flex items-center gap-2">
            <Clapperboard className="w-3.5 h-3.5 text-[#38301f]" />
            <span className="text-[#948b76] font-semibold">{t.appTitle}</span>
          </div>
          <span>البيانات من: توب سينما & أهواك</span>
        </div>
      </footer>

      {/* Modals */}
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
