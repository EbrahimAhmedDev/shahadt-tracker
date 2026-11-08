'use client';

import React from 'react';
import { useTracking } from '@/lib/store/tracking-context';

export const StatsSummary: React.FC = () => {
  const { stats, t, language } = useTracking();

  const statsList = [
    { label: t.moviesCount, value: String(stats.totalMovies) },
    { label: t.seriesCount, value: String(stats.totalSeries) },
    { label: t.episodesWatched, value: String(stats.totalEpisodes) },
    { label: t.avgRating, value: `${stats.avgRating} / 10` },
  ];

  return (
    <div className="my-8">
      <div
        className="flex flex-wrap items-end gap-x-8 gap-y-4"
        style={{ fontFamily: language === 'en' ? 'var(--font-grotesk)' : undefined }}
      >
        {statsList.map((stat, i) => (
          <div key={i} className="flex items-baseline gap-2">
            <span
              className="text-2xl sm:text-3xl font-light text-[#f3ecdd] tabular-nums"
              aria-label={stat.label}
            >
              {stat.value}
            </span>
            <span className="text-[0.72rem] text-[#948b76]">{stat.label}</span>
          </div>
        ))}
      </div>
      {/* خط شعرة يفصل عن التبويبات */}
    </div>
  );
};
