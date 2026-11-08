'use client';

import React from 'react';
import {
  Star,
  Plus,
  CheckCircle,
  MoreVertical,
  Film,
  Tv,
  ExternalLink,
  Trash2,
  Edit,
  Clock,
} from 'lucide-react';
import { UserTracking } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface MediaCardProps {
  item: UserTracking;
  onSelect: (item: UserTracking) => void;
}

export const MediaCard: React.FC<MediaCardProps> = ({ item, onSelect }) => {
  const { incrementEpisode, markCompleted, removeTracking, t, language } = useTracking();
  const media = item.media;
  if (!media) return null;

  const isSeries = media.type === 'series';
  const progressPercent =
    item.totalEpisodes && item.totalEpisodes > 0
      ? Math.min(100, Math.round(((item.currentEpisode || 0) / item.totalEpisodes) * 100))
      : null;

  const title = language === 'ar' ? media.titleAr : (media.titleEn || media.titleAr);

  return (
    <div className="group glass-panel rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.02] hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-950/30">
      {/* Poster Image Container */}
      <div
        className="relative aspect-[2/3] w-full overflow-hidden bg-slate-950 cursor-pointer"
        onClick={() => onSelect(item)}
      >
        {media.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.posterUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              // Fallback placeholder if image link is dead
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-500">
            <Film className="w-12 h-12 mb-2 stroke-1" />
            <span className="text-xs">{t.appTitle}</span>
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          {/* Media Type */}
          <span className="px-2 py-1 rounded-lg text-[11px] font-bold backdrop-blur-md bg-slate-900/80 text-white border border-white/10 flex items-center gap-1 shadow-md">
            {isSeries ? <Tv className="w-3 h-3 text-blue-400" /> : <Film className="w-3 h-3 text-rose-400" />}
            {isSeries ? t.series : t.movie}
          </span>

          {/* Source Tag */}
          <span
            className={`px-2 py-0.5 rounded-lg text-[10px] font-bold backdrop-blur-md border shadow-md ${
              media.source === 'topcinema'
                ? 'bg-red-950/80 text-red-300 border-red-500/40'
                : media.source === 'ahwak'
                ? 'bg-teal-950/80 text-teal-300 border-teal-500/40'
                : 'bg-purple-950/80 text-purple-300 border-purple-500/40'
            }`}
          >
            {media.source === 'topcinema'
              ? t.sourceTopCinema
              : media.source === 'ahwak'
              ? t.sourceAhwak
              : t.sourceManual}
          </span>
        </div>

        {/* Rating Badge (Bottom of image) */}
        {typeof item.userRating === 'number' && item.userRating > 0 && (
          <div className="absolute bottom-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black backdrop-blur-md bg-amber-950/80 text-amber-300 border border-amber-500/40 shadow-lg">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{item.userRating.toFixed(1)}</span>
          </div>
        )}

        {/* Year Badge */}
        {media.releaseYear && (
          <div className="absolute bottom-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-xs font-semibold px-2 py-0.5 rounded-md backdrop-blur-md bg-black/60 text-slate-300 border border-white/10">
            {media.releaseYear}
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Title */}
          <h3
            className="font-bold text-white text-base leading-snug line-clamp-1 hover:text-red-400 transition-colors cursor-pointer"
            onClick={() => onSelect(item)}
            title={title}
          >
            {title}
          </h3>

          {/* Series Episode Progress or Movie Status */}
          {isSeries ? (
            <div className="mt-2.5">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
                <span>
                  {t.episode} {item.currentEpisode || 1}
                  {item.totalEpisodes ? ` / ${item.totalEpisodes}` : ''}
                </span>
                {item.currentSeason && item.currentSeason > 1 && (
                  <span className="text-slate-500">
                    {t.season} {item.currentSeason}
                  </span>
                )}
              </div>

              {/* Progress bar */}
              {progressPercent !== null && (
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-rose-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="mt-2 text-xs text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>
                {item.status === 'completed'
                  ? t.completed
                  : item.status === 'watching'
                  ? t.watching
                  : t.planToWatch}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          {/* Quick Increment or Mark Done */}
          {item.status === 'watching' ? (
            isSeries ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  incrementEpisode(item.id);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-all cursor-pointer"
                title={t.incrementEpisode}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t.incrementEpisode}</span>
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  markCompleted(item.id);
                }}
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/30 transition-all cursor-pointer"
                title={t.markCompleted}
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>{t.markCompleted}</span>
              </button>
            )
          ) : (
            <button
              onClick={() => onSelect(item)}
              className="flex-1 text-center py-1.5 px-3 rounded-xl text-xs font-semibold bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
            >
              {t.edit}
            </button>
          )}

          {/* Quick Delete */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(t.confirmDelete)) {
                removeTracking(item.id);
              }
            }}
            className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
