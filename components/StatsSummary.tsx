'use client';

import React from 'react';
import { Film, Tv, CheckCircle2, Star } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';

export const StatsSummary: React.FC = () => {
  const { stats, t } = useTracking();

  const statsList = [
    { label: t.moviesCount, value: String(stats.totalMovies), Icon: Film },
    { label: t.seriesCount, value: String(stats.totalSeries), Icon: Tv },
    { label: t.episodesWatched, value: String(stats.totalEpisodes), Icon: CheckCircle2 },
    { label: t.avgRating, value: `${stats.avgRating}/10`, Icon: Star },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 my-8">
      {statsList.map((stat, i) => (
        <div
          key={i}
          className="rounded-[var(--r-md)] px-4 py-3.5 flex items-center gap-3.5"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--stroke)',
          }}
        >
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: 'var(--bg-raised)', border: '1px solid var(--stroke)' }}
          >
            <stat.Icon className="w-4 h-4 text-[var(--text-mid)]" />
          </div>
          <div className="min-w-0">
            <div className="nums text-xl sm:text-2xl font-bold text-[var(--text-hi)] leading-tight">
              {stat.value}
            </div>
            <div className="text-[0.72rem] text-[var(--text-low)] truncate">{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
