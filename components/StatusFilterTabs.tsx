'use client';

import React from 'react';
import { useTracking } from '@/lib/store/tracking-context';
import { WatchStatus, MediaType } from '@/types/media';

export const StatusFilterTabs: React.FC = () => {
  const { activeTab, setActiveTab, filterType, setFilterType, items, t } = useTracking();

  const getStatusCount = (status: WatchStatus | 'all') => {
    if (status === 'all') return items.length;
    return items.filter((i) => i.status === status).length;
  };

  const tabs: { id: WatchStatus | 'all'; label: string }[] = [
    { id: 'watching', label: t.watching },
    { id: 'completed', label: t.completed },
    { id: 'plan_to_watch', label: t.planToWatch },
    { id: 'dropped', label: t.dropped },
    { id: 'all', label: t.all },
  ];

  const types: { id: 'all' | MediaType; label: string }[] = [
    { id: 'all', label: t.all },
    { id: 'movie', label: t.movie },
    { id: 'series', label: t.series },
  ];

  return (
    <div className="flex items-stretch justify-between gap-4 py-0 border-b hairline">
      {/* تبويبات النص — سطر تحته عند التفعيل بدل الدواء */}
      <div
        className="flex items-end gap-5 overflow-x-auto no-scrollbar"
        role="tablist"
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = getStatusCount(tab.id);
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab.id)}
              className={`relative pb-3 pt-1 whitespace-nowrap text-[0.86rem] transition-colors cursor-pointer ${
                isActive ? 'text-[#f3ecdd] font-semibold' : 'text-[#948b76] hover:text-[#cfc4ab]'
              }`}
            >
              {tab.label}
              <span className={`text-[0.68rem] ms-1 tabular-nums ${isActive ? 'text-[#f2b441]' : 'text-[#6d6450]'}`}>
                {count}
              </span>
              {isActive && (
                <span
                  aria-hidden
                  className="absolute bottom-0 inset-x-0 h-0.5 bg-[#f2b441] rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* فلتر النوع */}
      <div className="flex items-center pb-3">
        {types.map((tp) => {
          const isActive = filterType === tp.id;
          return (
            <button
              key={tp.id}
              onClick={() => setFilterType(tp.id)}
              className={`px-2.5 py-1 text-[0.75rem] rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'bg-[#2a2317] text-[#f2b441]'
                  : 'text-[#948b76] hover:text-[#cfc4ab]'
              }`}
            >
              {tp.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
