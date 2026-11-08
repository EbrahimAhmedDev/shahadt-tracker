'use client';

import React from 'react';
import { Plus, Globe, Clapperboard } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';

interface NavbarProps {
  onOpenAddModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal }) => {
  const { language, setLanguage, t, searchFilter, setSearchFilter, syncStatus } = useTracking();

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  const syncMeta = {
    synced: { label: t.syncStatusCloud, dot: 'bg-[#7ba05a]' },
    connecting: { label: t.syncStatusSyncing, dot: 'bg-[#f2b441] animate-pulse' },
    local: { label: t.syncStatusLocal, dot: 'bg-[#948b76]' },
    error: { label: t.syncStatusError, dot: 'bg-[#c45050]' },
    off: { label: t.syncStatusLocal, dot: 'bg-[#948b76]' },
  }[syncStatus];

  const toggleSearch = () => {
    if (searchFilter) setSearchFilter('');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b hairline bg-[#12100cee] backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-4">

          {/* Logo — كيلّ المشروع */}
          <div className="flex items-center gap-3 min-w-0">
            <Clapperboard className="w-5 h-5 text-[#f2b441] shrink-0" strokeWidth={1.75} />
            <div className="min-w-0">
              <span className="text-xl font-bold text-[#f3ecdd] leading-none">{t.appTitle}</span>
              <p className="text-[0.68rem] text-[#948b76] hidden sm:block mt-0.5 truncate">{t.tagline}</p>
            </div>
          </div>

          {/* بحث */}
          <div className="hidden md:block flex-1 max-w-sm mx-6">
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="field w-full text-[0.82rem] px-4 py-2"
                aria-label={t.searchPlaceholder}
              />
              {searchFilter && (
                <button
                  onClick={toggleSearch}
                  className="absolute top-1/2 -translate-y-1/2 text-[#948b76] hover:text-[#f3ecdd] text-xs transition-colors"
                  style={{ insetInlineEnd: '0.9rem' }}
                  aria-label={t.cancel}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* أزرار */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* حالة المزامنة */}
            <div
              className="hidden lg:flex items-center gap-2 text-[0.72rem] text-[#948b76] pr-3"
              style={{ borderInlineEnd: '1px solid var(--s-line)' }}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${syncMeta.dot}`} aria-hidden />
              <span>{syncMeta.label}</span>
            </div>

            <button
              onClick={toggleLanguage}
              className="btn-ghost flex items-center gap-1.5 px-3 py-2 text-[0.78rem]"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'EN' : 'ع'}</span>
            </button>

            <button
              onClick={onOpenAddModal}
              className="btn-solid flex items-center gap-1.5 px-4 py-2 text-[0.82rem]"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="hidden sm:inline">{t.addMedia}</span>
            </button>
          </div>
        </div>

        {/* بحث الجوال */}
        <div className="pb-3 md:hidden">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="field w-full text-[0.82rem] px-4 py-2"
          />
        </div>
      </div>
    </header>
  );
};
