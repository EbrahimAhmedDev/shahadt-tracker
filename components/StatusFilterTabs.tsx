'use client';

import React from 'react';
import { Play, Check, Bookmark, XCircle, LayoutGrid, Film, Tv } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';
import { WatchStatus, MediaType } from '@/types/media';

export const StatusFilterTabs: React.FC = () => {
  const { activeTab, setActiveTab, filterType, setFilterType, items, t } = useTracking();

  const getStatusCount = (status: WatchStatus | 'all') => {
    if (status === 'all') return items.length;
    return items.filter((i) => i.status === status).length;
  };

  const tabs: { id: WatchStatus | 'all'; label: string; icon: React.ElementType }[] = [
    { id: 'watching', label: t.watching, icon: Play },
    { id: 'completed', label: t.completed, icon: Check },
    { id: 'plan_to_watch', label: t.planToWatch, icon: Bookmark },
    { id: 'dropped', label: t.dropped, icon: XCircle },
    { id: 'all', label: t.all, icon: LayoutGrid },
  ];

  const types: { id: 'all' | MediaType; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: t.all, icon: LayoutGrid },
    { id: 'movie', label: t.movie, icon: Film },
    { id: 'series', label: t.series, icon: Tv },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 py-4 border-b border-white/5">
      {/* Primary Status Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          const count = getStatusCount(tab.id);

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 ring-1 ring-red-400/40'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-white/5'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Media Type Filter Pills */}
      <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-white/5 self-start sm:self-auto">
        {types.map((tp) => {
          const Icon = tp.icon;
          const isActive = filterType === tp.id;

          return (
            <button
              key={tp.id}
              onClick={() => setFilterType(tp.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-700/90 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tp.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
