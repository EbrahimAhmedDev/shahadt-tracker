'use client';

import React from 'react';
import { Film, Tv, PlayCircle, Star } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';

export const StatsSummary: React.FC = () => {
  const { stats, t } = useTracking();

  const tiles = [
    { value: String(stats.totalMovies), label: t.moviesCount, Icon: Film, color: 'var(--violet)', soft: 'var(--violet-soft)' },
    { value: String(stats.totalSeries), label: t.seriesCount, Icon: Tv, color: 'var(--green)', soft: 'var(--green-soft)' },
    { value: String(stats.totalEpisodes), label: t.episodesWatched, Icon: PlayCircle, color: 'var(--orange)', soft: 'var(--orange-soft)' },
    { value: stats.avgRating, label: t.avgRating, Icon: Star, color: 'var(--yellow)', soft: 'rgba(250,204,21,.14)', fill: true },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {tiles.map((tile, i) => (
        <div
          key={i}
          className="panel flex items-center gap-4 px-5 py-4"
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: tile.soft }}
          >
            <tile.Icon
              className="w-6 h-6"
              style={{ color: tile.color }}
              fill={tile.fill ? tile.color : 'none'}
            />
          </div>
          <div className="min-w-0">
            <div className="nums text-[1.55rem] font-bold leading-tight" style={{ color: 'var(--text-hi)' }}>
              {tile.value}
            </div>
            <div className="text-[0.78rem] text-[var(--text-low)] truncate">{tile.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
