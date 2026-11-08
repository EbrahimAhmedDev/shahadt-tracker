'use client';

import React from 'react';
import { Star, Plus, Film, Tv, Clock, Trash2 } from 'lucide-react';
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

  const statusLabel =
    item.status === 'completed'
      ? t.completed
      : item.status === 'watching'
      ? t.watching
      : item.status === 'dropped'
      ? t.dropped
      : t.planToWatch;

  return (
    <article className="group panel panel-hover overflow-hidden flex flex-col cursor-pointer">
      {/* الملصق */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0d0b08]" onClick={() => onSelect(item)}>
        {media.posterUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={media.posterUrl}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#38301f]">
            <Film className="w-12 h-12" strokeWidth={1} />
          </div>
        )}

        {/* سكريم سينمائي أعمق من الأسفل */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, #12100c 4%, rgba(18,16,12,0.35) 32%, transparent 60%)' }}
        />

        {/* عناصر موضعية دقيقة */}
        {typeof item.userRating === 'number' && item.userRating > 0 && (
          <div className="absolute top-2.5 ps-3 flex items-center gap-1 text-[0.72rem] font-semibold text-[#f2b441]"
            style={{ insetInlineStart: '0.6rem' }}
          >
            <Star className="w-3 h-3 fill-[#f2b441] text-[#f2b441]" />
            <span>{item.userRating.toFixed(1)}</span>
          </div>
        )}

        {media.releaseYear && (
          <div className="absolute bottom-2.5 text-[0.68rem] text-[#cfc4ab] tabular-nums"
            style={{ insetInlineStart: '0.75rem' }}
          >
            {media.releaseYear}
          </div>
        )}

        <div className="absolute top-2.5 flex items-center gap-1 text-[#f3ecdd]/80"
          style={{ insetInlineEnd: '0.6rem' }}
        >
          {isSeries ? <Tv className="w-3.5 h-3.5" /> : <Film className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* جسم الكارد */}
      <div className="p-3.5 flex flex-col flex-1 gap-2">
        <h3
          className="text-[0.9rem] font-semibold text-[#f3ecdd] leading-snug line-clamp-1"
          title={title}
          onClick={() => onSelect(item)}
        >
          {title}
        </h3>

        {isSeries ? (
          <div>
            <div className="flex items-center justify-between text-[0.68rem] text-[#948b76] mb-1.5">
              <span className="tabular-nums">
                {t.episode} {item.currentEpisode || 0}
                {item.totalEpisodes ? ` / ${item.totalEpisodes}` : ''}
              </span>
              {item.currentSeason && item.currentSeason > 1 && (
                <span className="text-[#6d6450]">
                  {t.season} {item.currentSeason}
                </span>
              )}
            </div>

            {progressPercent !== null && (
              <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: '#2e281c' }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${progressPercent}%`, background: 'var(--s-amber)' }}
                />
              </div>
            )}
          </div>
        ) : (
          <div className="text-[0.68rem] text-[#948b76] flex items-center gap-1.5 mt-auto">
            <Clock className="w-3 h-3" />
            <span>{statusLabel}</span>
          </div>
        )}

        {/* أزرار الخدمة */}
        <div className="flex items-center gap-1.5 pt-2 mt-auto" style={{ borderTop: '1px solid var(--s-line)' }}>
          {item.status === 'watching' ? (
            isSeries ? (
              <button
                onClick={(e) => { e.stopPropagation(); incrementEpisode(item.id); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[0.72rem] font-semibold rounded-md text-[#f2b441] transition-colors hover:bg-[#2a2317] cursor-pointer"
              >
                <Plus className="w-3 h-3" strokeWidth={2.5} />
                {t.incrementEpisode}
              </button>
            ) : (
              <button
                onClick={(e) => { e.stopPropagation(); markCompleted(item.id); }}
                className="flex-1 flex items-center justify-center gap-1 py-1.5 text-[0.72rem] font-semibold rounded-md text-[#7ba05a] transition-colors hover:bg-[#22271a] cursor-pointer"
              >
                {t.markCompleted}
              </button>
            )
          ) : (
            <button
              onClick={(e) => { e.stopPropagation(); onSelect(item); }}
              className="flex-1 flex items-center justify-center py-1.5 text-[0.72rem] font-semibold rounded-md text-[#cfc4ab] transition-colors hover:bg-[#2a2317] hover:text-[#f3ecdd] cursor-pointer"
            >
              {t.edit}
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm(t.confirmDelete)) removeTracking(item.id);
            }}
            className="p-1.5 rounded-md text-[#6d6450] hover:text-[#c45050] transition-colors cursor-pointer"
            title={t.delete}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
