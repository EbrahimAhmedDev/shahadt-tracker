'use client';

import React from 'react';
import { Star, Plus, Film, Tv, Trash2, PencilLine, CheckCircle2 } from 'lucide-react';
import { UserTracking, WatchStatus } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface MediaCardProps {
  item: UserTracking;
  onSelect: (item: UserTracking) => void;
}

const statusClass: Record<WatchStatus, string> = {
  watching: 'status-watching',
  completed: 'status-completed',
  plan_to_watch: 'status-plan',
  dropped: 'status-dropped',
};

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
  const statusLabel =
    item.status === 'completed' ? t.completed
    : item.status === 'watching' ? t.watching
    : item.status === 'dropped' ? t.dropped
    : t.planToWatch;

  return (
    <article className="media-card group flex flex-col">
      {/* Poster */}
      <div
        className="relative aspect-[2/3] w-full overflow-hidden bg-[#0d0f13] cursor-pointer"
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
            <span className="text-[0.68rem]">{t.appTitle}</span>
          </div>
        )}

        {/* Scrim */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: 'linear-gradient(to top, rgba(9,10,13,.85), transparent)' }}
        />

        {/* Status chip */}
        <div className="absolute top-2 ps-2" style={{ insetInlineStart: 8 }}>
          <span className={`status-chip ${statusClass[item.status]}`}>{statusLabel}</span>
        </div>

        {/* Rating */}
        {typeof item.userRating === 'number' && item.userRating > 0 && (
          <div
            className="absolute flex items-center gap-1 px-2 py-0.5 rounded-full text-[0.72rem] font-bold"
            style={{
              insetInlineEnd: 8,
              bottom: 10,
              background: 'rgba(9,10,13,.65)',
              backdropFilter: 'blur(6px)',
            }}
          >
            <Star className="w-3 h-3 fill-[var(--warn)] text-[var(--warn)]" />
            <span className="nums text-[#f7c96b]">{item.userRating.toFixed(1)}</span>
          </div>
        )}

        {/* Year */}
        {media.releaseYear && (
          <div
            className="absolute text-[0.7rem] font-medium text-[var(--text-mid)]"
            style={{ insetInlineStart: 10, bottom: 10 }}
          >
            {media.releaseYear}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col gap-2.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => onSelect(item)}
            className="text-start font-semibold text-[0.875rem] leading-snug line-clamp-1 hover:text-white cursor-pointer transition-colors"
            title={title}
            style={{ color: 'var(--text-hi)' }}
          >
            {title}
          </button>
          <span className="text-[var(--text-low)] shrink-0 mt-0.5">
            {isSeries ? <Tv className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
          </span>
        </div>

        {/* Progress for series */}
        {isSeries ? (
          <div>
            <div className="flex items-center justify-between text-[0.7rem] text-[var(--text-mid)] mb-1.5 nums">
              <span>
                {t.episode} {item.currentEpisode || 0}
                {item.totalEpisodes ? ` / ${item.totalEpisodes}` : ''}
              </span>
            </div>

            {progressPercent !== null ? (
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
              </div>
            ) : (
              <div className="text-[0.68rem] text-[var(--text-low)]">{statusLabel}</div>
            )}
          </div>
        ) : null}

        {/* Actions */}
        <div
          className="flex items-center gap-1 pt-2 mt-auto"
          style={{ borderTop: '1px solid var(--stroke)' }}
        >
          {item.status === 'watching' ? (
            isSeries ? (
              <button
                onClick={(e) => { e.stopPropagation(); incrementEpisode(item.id); }}
                className="btn btn-ghost btn-sm flex-1 gap-1.5"
                title={t.incrementEpisode}
              >
                <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
                {t.incrementEpisode}
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); markCompleted(item.id); }}
                className="btn btn-ghost btn-sm flex-1 gap-1.5"
                style={{ color: 'var(--ok)' }}
                title={t.markCompleted}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                {t.markCompleted}
              </button>
            )
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(item); }}
              className="btn btn-ghost btn-sm flex-1 gap-1.5"
              title={t.edit}
            >
              <PencilLine className="w-3.5 h-3.5" />
              {t.edit}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(t.confirmDelete)) removeTracking(item.id);
            }}
            className="btn btn-ghost btn-icon btn-sm text-[var(--text-low)] hover:text-[#ff8a8d]"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
