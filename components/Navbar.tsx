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
    synced: { label: t.syncStatusCloud, dot: 'bg-emerald-400', text: 'text-emerald-400' },
    connecting: { label: t.syncStatusSyncing, dot: 'bg-amber-400 animate-pulse', text: 'text-amber-400' },
    local: { label: t.syncStatusLocal, dot: 'bg-slate-400', text: 'text-slate-300' },
    error: { label: t.syncStatusError, dot: 'bg-rose-400', text: 'text-rose-400' },
    off: { label: t.syncStatusLocal, dot: 'bg-slate-400', text: 'text-slate-300' },
  }[syncStatus];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-red-600/30 ring-1 ring-white/20">
              <Clapperboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white font-cairo">
                  {t.appTitle}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 font-semibold tracking-wider uppercase">
                  Cinema
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </div>

          {/* Search Filter Input */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full bg-slate-900/80 text-sm text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2.5 border border-white/10 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
              />
              {searchFilter && (
                <button
                  onClick={() => setSearchFilter('')}
                  className="absolute left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Live sync status pill */}
            <div
              title={syncStatus === 'synced' ? t.syncStatusCloud : t.guestNotice}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900/70 border border-white/5 text-slate-300"
              aria-live="polite"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${syncMeta.dot}`} aria-hidden />
              <span>{syncMeta.label}</span>
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-white/10 transition-all active:scale-95 cursor-pointer"
              title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe className="w-4 h-4 text-slate-400" />
              <span>{language === 'ar' ? 'English' : 'العربية'}</span>
            </button>

            {/* Add Media Button */}
            <button
              onClick={onOpenAddModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/25 border border-red-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">{t.addMedia}</span>
            </button>

          </div>

        </div>

        {/* Mobile Search input */}
        <div className="pb-3 md:hidden">
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full bg-slate-900/90 text-sm text-slate-200 placeholder-slate-500 rounded-xl px-4 py-2 border border-white/10 focus:outline-none focus:border-red-500 transition-all"
          />
        </div>

      </div>
    </header>
  );
};
