'use client';

import React from 'react';
import { LayoutGrid, Film, Tv } from 'lucide-react';
import { useTracking, WatchStatus, MediaType } from '@/lib/store/tracking-context';

export const StatusFilterTabs: React.FC = () => {
  const { activeTab, setActiveTab, filterType, setFilterType, t } = useTracking();

  const statusTabs: { id: WatchStatus | 'all'; label: string }[] = [
    { id: 'all', label: t.allCases },
    { id: 'completed', label: t.completed },
    { id: 'plan_to_watch', label: t.planToWatch },
    { id: 'dropped', label: t.dropped },
  ];

  const typeTabs: { id: 'all' | MediaType; label: string; icon: React.ElementType }[] = [
    { id: 'all', label: t.allTitles, icon: LayoutGrid },
    { id: 'movie', label: t.movie, icon: Film },
    { id: 'series', label: t.series, icon: Tv },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      {/* Type pills (start side) */}
      <div className="flex items-center gap-2">
        {typeTabs.map((tp) => {
          const Icon = tp.icon;
          const isActive = filterType === tp.id;
          return (
            <button
              key={tp.id}
              onClick={() => setFilterType(tp.id)}
              className={isActive ? 'btn btn-primary btn-sm' : 'btn btn-sm'}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tp.label}</span>
            </button>
          );
        })}
      </div>

      {/* Status pills (end side) */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {statusTabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={isActive ? 'btn btn-primary btn-sm' : 'btn btn-sm'}
            >
              {tab.label}
            </button>
          );
        })}
        {/* watching pill (active look when selected) */}
        <button
          onClick={() => setActiveTab(activeTab === 'watching' ? 'all' : 'watching')}
          className={activeTab === 'watching' ? 'btn btn-primary btn-sm' : 'btn btn-sm'}
        >
          {t.watching}
        </button>
      </div>
    </div>
  );
};
