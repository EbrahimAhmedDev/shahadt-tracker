'use client';

import React from 'react';
import { PlayCircle, CheckCircle2, Bookmark, XCircle, LayoutGrid, Film, Tv } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';
import { WatchStatus, MediaType } from '@/types/media';

export const StatusFilterTabs: React.FC = () => {
  const { activeTab, setActiveTab, filterType, setFilterType, items, t } = useTracking();

  const getStatusCount = (status: WatchStatus | 'all') => {
    if (status === 'all') return items.length;
    return items.filter((i) => i.status === status).length;
  };

  const tabs: { id: WatchStatus | 'all'; label: string; icon: React.ElementType }[] = [
    { id: 'watching', label: t.watching, icon: PlayCircle },
    { id: 'completed', label: t.completed, icon: CheckCircle2 },
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
    <div className="flex flex-wrap items-center justify-between gap-3 my-6">
      {/* Status tabs */}
      <div
        role="tablist"
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar rounded-full p-1"
        style={{ background: 'var(--bg-elevated)', border: '1px solid var(--stroke)' }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              data-active={isActive}
              onClick={() => setActiveTab(tab.id)}
              className="tab"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className="tab-count">{getStatusCount(tab.id)}</span>
            </button>
          );
        })}
      </div>

      {/* Type filter */}
      <div className="seg" role="group" aria-label="type filter">
        {types.map((tp) => {
          const Icon = tp.icon;
          return (
            <button
              key={tp.id}
              data-active={filterType === tp.id}
              onClick={() => setFilterType(tp.id)}
              className="seg-item flex items-center gap-1.5"
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tp.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
