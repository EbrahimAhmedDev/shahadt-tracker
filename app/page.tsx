'use client';

import React, { useState, useMemo } from 'react';
import { Sidebar, MobileNav } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';
import { Hero } from '@/components/Hero';
import { StatsSummary } from '@/components/StatsSummary';
import { StatusFilterTabs } from '@/components/StatusFilterTabs';
import { MediaCard } from '@/components/MediaCard';
import { LastWatchedPanel } from '@/components/LastWatchedPanel';
import { AddMediaModal } from '@/components/AddMediaModal';
import { MediaDetailModal } from '@/components/MediaDetailModal';
import { useTracking } from '@/lib/store/tracking-context';
import { UserTracking } from '@/types/media';
import { Plus, BarChart3, Trash2, Globe, Cloud, Star, CheckCircle2, PlayCircle, Bookmark, PauseCircle } from 'lucide-react';

export default function Home() {
  const { items, activeTab, filterType, searchFilter, t, language, view, syncStatus, setLanguage } = useTracking();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<UserTracking | null>(null);

  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
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
      })
      .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''));
  }, [items, activeTab, filterType, searchFilter]);

  const hasRealItems = items.some((i) => !i.id.startsWith('demo-'));

  const clearLocalData = () => {
    if (confirm('متأكد؟ هيتمسح النسخة المحلية (السحابية هترجع أول ما تعمل تحديث للصفحة).')) {
      try {
        localStorage.removeItem('shahadt_tracker_items_v1');
      } catch {}
      location.reload();
    }
  };

  /* ================= Sidebar content views ================= */

  const statsView = (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">{t.navMyStats}</h2>
      <StatsSummary />

      {(
        [
          { status: 'watching', icon: PlayCircle, color: 'var(--violet)', soft: 'var(--violet-soft)' },
          { status: 'completed', icon: CheckCircle2, color: 'var(--green)', soft: 'var(--green-soft)' },
          { status: 'plan_to_watch', icon: Bookmark, color: 'var(--orange)', soft: 'var(--orange-soft)' },
          { status: 'dropped', icon: PauseCircle, color: 'var(--red)', soft: 'var(--red-soft)' },
        ] as const
      ).map((sec) => {
        const list = items.filter((i) => i.status === sec.status);
        return (
          <div key={sec.status} className="panel p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: sec.soft }}>
                <sec.icon className="w-4.5 h-4.5" style={{ color: sec.color }} />
              </span>
              <span className="font-bold">{sec.status === 'watching' ? t.watching : sec.status === 'completed' ? t.completed : sec.status === 'plan_to_watch' ? t.planToWatch : t.dropped}</span>
              <span className="nums text-[var(--text-low)] text-sm">{list.length}</span>
            </div>
            {list.length === 0 ? (
              <p className="text-sm text-[var(--text-low)]">—</p>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'var(--stroke)' }}>
                {list.slice(0, 8).map((i) => {
                  const title = language === 'ar' ? i.media?.titleAr : (i.media?.titleEn || i.media?.titleAr);
                  return (
                    <li
                      key={i.id}
                      onClick={() => setSelectedItem(i)}
                      className="flex items-center justify-between py-2.5 cursor-pointer hover:bg-[var(--bg-raised)] rounded-lg px-2 -mx-2"
                    >
                      <span className="text-sm line-clamp-1">{title}</span>
                      <span className="flex items-center gap-3 text-[0.72rem] text-[var(--text-low)] nums shrink-0">
                        {i.media?.releaseYear}
                        {typeof i.userRating === 'number' && i.userRating > 0 ? (
                          <span className="flex items-center gap-1 text-[var(--yellow)]">
                            <Star className="w-3 h-3 fill-[var(--yellow)]" />
                            {i.userRating.toFixed(1)}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );

  const settingsView = (
    <div className="space-y-4 max-w-lg">
      <h2 className="text-xl font-bold">{t.navSettings}</h2>

      <div className="panel p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="w-5 h-5 text-[var(--violet)]" />
          <div>
            <div className="font-semibold text-sm">{t.settingsLang}</div>
            <div className="text-[0.72rem] text-[var(--text-low)]">العربية / English</div>
          </div>
        </div>
        <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="btn btn-sm">
          {language === 'ar' ? 'English' : 'العربية'}
        </button>
      </div>

      <div className="panel p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cloud className="w-5 h-5" style={{ color: syncStatus === 'synced' ? 'var(--green)' : 'var(--text-low)' }} />
          <div>
            <div className="font-semibold text-sm">{t.settingsSync}</div>
            <div className="text-[0.72rem] text-[var(--text-low)]">
              {syncStatus === 'synced' ? t.connected : syncStatus === 'connecting' ? t.syncStatusSyncing : syncStatus === 'error' ? t.syncStatusError : t.syncStatusLocal}
            </div>
          </div>
        </div>
      </div>

      <div className="panel p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Trash2 className="w-5 h-5 text-[var(--red)]" />
          <div>
            <div className="font-semibold text-sm">{t.settingsData}</div>
            <div className="text-[0.72rem] text-[var(--text-low)]">النسخة المحفوظة في المتصفح</div>
          </div>
        </div>
        <button onClick={clearLocalData} className="btn btn-sm text-[#ff8a8d]">{t.clearLocalData}</button>
      </div>
    </div>
  );

  const aboutView = (
    <div className="space-y-4 max-w-xl">
      <h2 className="text-xl font-bold">{t.navAbout}</h2>
      <div className="panel p-6 space-y-3">
        <div className="flex items-center gap-3 mb-2">
          <span className="nums font-bold text-[var(--violet)]" style={{ fontFamily: 'var(--font-pixel)' }}>Shahadt</span>
          <span className="text-[var(--text-low)] text-sm">v1.0</span>
        </div>
        <p className="text-sm text-[var(--text-mid)] leading-loose">{t.aboutBody}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {['Next.js 16', 'React 19', 'Tailwind v4', 'Supabase', 'Vercel'].map((tech) => (
            <span key={tech} className="chip nums">{tech}</span>
          ))}
        </div>
        <p className="text-[0.7rem] text-[var(--text-low)] pt-2">البيانات من: توب سينما & أهواك — © 2026 Shahadt</p>
      </div>
    </div>
  );

  /* ================= Home view ================= */

  const homeView = (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">{t.navHome}</h2>
        <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-sm">
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span className="hidden sm:inline">{t.addMedia}</span>
        </button>
      </div>

      {!hasRealItems && filteredItems.length === 0 ? (
        <div className="panel flex flex-col items-center text-center py-16 px-6">
          <BarChart3 className="w-8 h-8 text-[var(--text-low)] mb-4" />
          <h3 className="font-bold text-lg mb-2">{t.emptyList}</h3>
          <p className="text-sm text-[var(--text-mid)] max-w-sm mb-6">{t.emptyListSub}</p>
          <button onClick={() => setIsAddModalOpen(true)} className="btn btn-primary btn-lg">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            {t.addMedia}
          </button>
        </div>
      ) : (
        <>
          {/* Hero */}
          <Hero />

          {/* Stats tiles */}
          <StatsSummary />

          {/* Filter row */}
          <StatusFilterTabs />

          {/* Grid + last-watched panel */}
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4 mt-2 items-start">
              {filteredItems.slice(0, 8).map((item) => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onSelect={(selected) => setSelectedItem(selected)}
                />
              ))}

              {filteredItems.length > 0 && (
                <LastWatchedPanel onSelect={(selected) => setSelectedItem(selected)} />
              )}
            </div>
          ) : (
            <div className="panel py-14 text-center">
              <p className="text-sm text-[var(--text-mid)]">{t.noResults}</p>
            </div>
          )}

          {filteredItems.length > 8 && (
            <p className="text-center text-[0.75rem] text-[var(--text-low)] nums mt-4">
              +{filteredItems.length - 8}
            </p>
          )}
        </>
      )}
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg)', color: 'var(--text-hi)' }}>
      {/* Sidebar */}
      <Sidebar />

      {/* Main column */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto" style={{ scrollBehavior: 'smooth' }}>
        <Topbar />

        <main className="flex-1 px-4 sm:px-6 pb-24 lg:pb-8">
          {view === 'home' && homeView}
          {view === 'stats' && statsView}
          {view === 'settings' && settingsView}
          {view === 'about' && aboutView}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <MobileNav />

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
