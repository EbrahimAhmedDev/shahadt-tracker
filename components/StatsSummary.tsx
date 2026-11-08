'use client';

import React from 'react';
import { Film, Tv, CheckCircle2, Star } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';

export const StatsSummary: React.FC = () => {
  const { stats, t } = useTracking();

  const statCards = [
    {
      title: t.moviesCount,
      value: stats.totalMovies,
      icon: Film,
      color: 'from-rose-500 to-red-600',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      glow: 'shadow-rose-600/10',
    },
    {
      title: t.seriesCount,
      value: stats.totalSeries,
      icon: Tv,
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      glow: 'shadow-blue-600/10',
    },
    {
      title: t.episodesWatched,
      value: stats.totalEpisodes,
      icon: CheckCircle2,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      glow: 'shadow-emerald-600/10',
    },
    {
      title: t.avgRating,
      value: `${stats.avgRating}/10`,
      icon: Star,
      color: 'from-amber-400 to-orange-500',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      glow: 'shadow-amber-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 my-6">
      {statCards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`glass-panel p-4 sm:p-5 rounded-2xl relative overflow-hidden transition-all duration-300 hover:-translate-y-1 ${card.glow} shadow-xl`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 tracking-wide">
                {card.title}
              </span>
              <div className={`p-2 rounded-xl border ${card.badgeColor}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {card.value}
            </div>
            {/* Subtle bottom gradient accent */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color} opacity-80`} />
          </div>
        );
      })}
    </div>
  );
};
