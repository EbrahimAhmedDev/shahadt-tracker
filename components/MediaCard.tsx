'use client';

import React from 'react';
import { Star, MoreVertical, Film, Tv, Play, Plus, Bookmark } from 'lucide-react';
import { UserTracking } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface MediaCardProps {
  item: UserTracking;
  onSelect: (item: UserTracking) => void;
}

const chipClass: Record<string, string> = {
  watching: 'status-watching',
  completed: 'status-completed',
  plan_to_watch: 'status-plan',
  dropped: 'status-dropped',
};

export const MediaCard: React.FC<MediaCardProps> = ({ item, onSelect }) => {
  const { incrementEpisode, updateTracking, markCompleted, t, language } = useTracking();
  const media = item.media;
  if (!media) return null;

  const isSeries = media.type === 'series';
  const progressPercent =
    item.totalEpisodes && item.totalEpisodes > 0
      ? Math.min(100, Math.round(((item.currentEpisode || 0) / item.totalEpisodes) * 100))
      : null;
  const remaining =
    item.totalEpisodes && item.totalEpisodes > 0
      ? Math.max(0, item.totalEpisodes - (item.currentEpisode || 0))
      : null;

  const title = language === 'ar' ? media.titleAr : (media.titleEn || media.titleAr);

  const statusLabel =
    item.status === 'completed' ? t.completed
    : item.status === 'watching' ? t.watching
    : item.status === 'dropped' ? t.dropped
    : t.planToWatch;

  return (
    <article className="media-card flex flex-col aspect-[2/3.4] group">
      {/* Poster */}
      <div
        className="absolute inset-0 bg-[#0d0b13] cursor-pointer"
        onClick={() => onSelect(item)}
      >
        {media.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.posterUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[var(--text-low)]">
            <Film className="w-10 h-10" strokeWidth={1.25} />
            <span className="text-[0.65rem]">{t.appTitle}</span>
          </div>
        )}
        {/* Bottom scrim */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/5"
          style={{ background: 'linear-gradient(to top, rgba(9,7,13,.92) 20%, transparent)' }}
        />
        {/* Top scrim for chips readability */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-16"
          style={{ background: 'linear-gradient(to bottom, rgba(9,7,13,.65), transparent)' }}
        />
      </div>

      {/* Top chips */}
      <div
        className="absolute top-2.5 z-10 flex items-center gap-1.5"
        style={{ insetInlineStart: 10, insetInlineEnd: 10, justifyContent: 'space-between' }}
      >
        <span className={`status-chip ${chipClass[item.status]}`}>
          {statusLabel}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onSelect(item); }}
          className="p-1.5 rounded-lg bg-[rgba(8,6,12,.6)] text-[var(--text-mid)] hover:text-white cursor-pointer"
          title={t.edit}
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom overlay content */}
      <div
        className="relative z-10 mt-auto p-3 flex flex-col gap-2"
      >
        <h3
          className="text-[0.95rem] font-bold text-white leading-snug line-clamp-1 cursor-pointer"
          onClick={() => onSelect(item)}
          title={title}
        >
          {title}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 text-[0.7rem] text-[var(--text-mid)]">
            {isSeries ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
            <span>{isSeries ? t.series : t.movie}</span>
            {media.releaseYear ? <span>• {media.releaseYear}</span> : null}
          </span>

          {typeof item.userRating === 'number' && item.userRating > 0 && (
            <span className="flex items-center gap-1 text-[0.78rem] font-bold text-[var(--yellow)] nums">
              <Star className="w-3.5 h-3.5 fill-[var(--yellow)] text-[var(--yellow)]" />
              {item.userRating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Series: progress + remaining pill */}
        {isSeries && item.status === 'watching' && progressPercent !== null ? (
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex-1">
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
              <div className="nums text-[0.68rem] text-[var(--text-mid)] mt-1.5">
                S{item.currentSeason ?? 1} • E{item.currentEpisode || 0}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); incrementEpisode(item.id); }}
              className="btn btn-outline-violet btn-sm nums gap-1"
              title={t.incrementEpisode}
            >
              <Plus className="w-3 h-3" strokeWidth={3} />
              {remaining} {t.remainingEpisodes}
            </button>
          </div>
        ) : null}

        {/* Action button per status */}
        <div className="mt-auto">
          {item.status === 'watching' && !isSeries ? (
            <button
              onClick={(e) => { e.stopPropagation(); markCompleted(item.id); }}
              className="btn btn-outline-violet btn-sm w-full"
            >
              <span>{t.markCompleted}</span>
            </button>
          ) : item.status === 'watching' && isSeries ? (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(item); }}
              className="btn btn-outline-violet btn-sm w-full"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.viewDetails}</span>
            </button>
          ) : item.status === 'plan_to_watch' ? (
            <button
              onClick={(e) => { e.stopPropagation(); updateTracking(item.id, { status: 'watching' }); }}
              className="btn btn-primary btn-sm w-full"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t.watchNow}</span>
            </button>
          ) : item.status === 'dropped' ? (
            <button
              onClick={(e) => { e.stopPropagation(); updateTracking(item.id, { status: 'plan_to_watch' }); }}
              className="btn btn-outline-violet btn-sm w-full"
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t.continueLater}</span>
            </button>
          ) : (
            /* completed */
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(item); }}
              className="btn btn-outline-violet btn-sm w-full"
            >
              <span>{t.viewDetails}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
};
