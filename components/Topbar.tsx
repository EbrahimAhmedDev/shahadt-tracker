'use client';

import React from 'react';
import { Search, X, Globe, Cloud, ChevronDown, CircleUserRound } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';

export const Topbar: React.FC = () => {
  const { language, setLanguage, t, searchFilter, setSearchFilter, syncStatus } = useTracking();

  const connected = syncStatus === 'synced';

  return (
    <header
      className="sticky top-0 z-30"
      style={{ background: 'rgba(11,9,16,.8)', backdropFilter: 'blur(10px)' }}
    >
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3.5">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--violet-soft)', border: '1px solid var(--violet-border)' }}>
            <span className="text-[var(--violet)] font-black text-sm">ش</span>
          </div>
          <span className="font-black text-lg">{t.appTitle}</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl mx-auto relative">
          <Search
            className="w-4.5 h-4.5 text-[var(--text-low)] pointer-events-none absolute"
            style={{ insetInlineEnd: 16, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="ابحث عن فيلم أو مسلسل..."
            className="input input-search"
            aria-label={t.searchPlaceholder}
          />
          {searchFilter && (
            <span
              role="button"
              onClick={() => setSearchFilter('')}
              className="absolute cursor-pointer text-[var(--text-low)] hover:text-[var(--text-mid)]"
              style={{ insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)' }}
            >
              <X className="w-4 h-4" />
            </span>
          )}
        </div>

        {/* Status + lang + avatar */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-2 chip" aria-live="polite">
            <Cloud className="w-3.5 h-3.5" style={{ color: connected ? 'var(--green)' : 'var(--text-low)' }} />
            <span className="w-2 h-2 rounded-full" style={{ background: connected ? 'var(--green)' : 'var(--text-low)' }} />
            <span>{connected ? t.connected : t.syncStatusLocal}</span>
          </div>

          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="btn btn-ghost btn-sm gap-1.5"
          >
            <Globe className="w-4 h-4" />
            <span className="text-[0.72rem] hidden sm:inline">{language === 'ar' ? 'عربي' : 'EN'}</span>
          </button>

          <button className="flex items-center gap-1.5 p-1 rounded-full hover:bg-[var(--bg-raised)] transition-colors cursor-pointer" title={t.appTitle}>
            <span
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'var(--violet-soft)', border: '1px solid var(--violet-border)' }}
            >
              <CircleUserRound className="w-5 h-5 text-[var(--violet)]" />
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-low)]" />
          </button>
        </div>
      </div>
    </header>
  );
};
