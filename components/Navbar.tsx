'use client';

import React from 'react';
import { Plus, Globe, Search, X } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const { language, setLanguage, t, searchFilter, setSearchFilter, syncStatus } = useTracking();

  const syncMeta = {
    synced: { label: t.syncStatusCloud, color: 'var(--ok)' },
    connecting: { label: t.syncStatusSyncing, color: 'var(--warn)' },
    local: { label: t.syncStatusLocal, color: 'var(--text-low)' },
    error: { label: t.syncStatusError, color: 'var(--accent)' },
    off: { label: t.syncStatusLocal, color: 'var(--text-low)' },
  }[syncStatus];

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        background: 'rgba(15,17,21,.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--stroke)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 h-16">

          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--accent)' }}
            >
              <span className="text-white font-bold text-lg leading-none" style={{ marginTop: 2 }}>ش</span>
            </div>
            <div className="leading-none">
              <div className="text-lg font-bold text-[var(--text-hi)]">{t.appTitle}</div>
              <div className="text-[0.65rem] text-[var(--text-low)] mt-0.5 hidden sm:block">{t.tagline}</div>
            </div>
          </div>

          {/* Search — desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-auto relative">
            <Search className="absolute w-4 h-4 text-[var(--text-low)]" style={{ insetInlineStart: 12, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="input input-search"
              aria-label={t.searchPlaceholder}
            />
            {searchFilter && (
              <span
                onClick={() => setSearchFilter('')}
                className="absolute cursor-pointer text-[var(--text-low)] hover:text-[var(--text-mid)]"
                style={{ insetInlineEnd: 12, top: '50%', transform: 'translateY(-50%)' }}
                aria-label={t.cancel}
                role="button"
                tabIndex={0}
              >
                <X className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:flex items-center gap-2 chip" aria-live="polite">
              <span className="w-2 h-2 rounded-full" style={{ background: syncMeta.color }} aria-hidden />
              <span className="text-[0.7rem]">{syncMeta.label}</span>
            </div>

            <button onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')} className="btn btn-ghost btn-icon btn-sm">
              <Globe className="w-4 h-4" />
              <span className="text-[0.75rem] hidden sm:inline">{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            <button onClick={onOpenAddModal} className="btn btn-primary">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">{t.addMedia}</span>
            </button>
          </div>
        </div>

        {/* Search — mobile */}
        <div className="pb-3 md:hidden relative">
          <Search className="absolute w-4 h-4 text-[var(--text-low)]" style={{ insetInlineStart: 12, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="input input-search"
          />
        </div>
      </div>
    </header>
  );
};
