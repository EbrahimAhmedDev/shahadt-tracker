'use client';

import React, { useState } from 'react';
import { X, Star, Film, Tv, Trash2, ExternalLink, Save } from 'lucide-react';
import { UserTracking, WatchStatus } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface MediaDetailModalProps {
  item: UserTracking | null;
  onClose: () => void;
}

const statusOptions: WatchStatus[] = ['watching', 'completed', 'plan_to_watch', 'dropped'];

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ item, onClose }) => {
  const { updateTracking, removeTracking, t, language } = useTracking();

  const [status, setStatus] = useState<WatchStatus>(item?.status ?? 'watching');
  const [currentSeason, setCurrentSeason] = useState<number>(item?.currentSeason ?? 1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(item?.currentEpisode ?? 1);
  const [totalEpisodes, setTotalEpisodes] = useState<number | undefined>(item?.totalEpisodes);
  const [rating, setRating] = useState<number>(item?.userRating ?? 0);
  const [notes, setNotes] = useState<string>(item?.userNotes ?? '');

  if (!item || !item.media) return null;

  const media = item.media;
  const isSeries = media.type === 'series';
  const title = language === 'ar' ? media.titleAr : (media.titleEn || media.titleAr);

  const handleSave = () => {
    updateTracking(item.id, {
      status,
      currentSeason,
      currentEpisode,
      totalEpisodes,
      userRating: rating > 0 ? rating : undefined,
      userNotes: notes,
      completedAt:
        status === 'completed' && !item.completedAt ? new Date().toISOString() : item.completedAt,
    });
    onClose();
  };

  const handleDelete = () => {
    if (confirm(t.confirmDelete)) {
      removeTracking(item.id);
      onClose();
    }
  };

  return (

    <div className="overlay" onClick={(e) => e.target === e.currentTarget && onClose()} role="dialog" aria-modal="true">
      <div className="modal max-w-2xl">

        {/* Banner */}
        <div className="relative h-40 sm:h-48 shrink-0" style={{ background: 'var(--bg-input)' }}>
          {media.posterUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media.posterUrl} alt="" className="absolute inset-0 w-full h-full object-cover blur-md scale-110 opacity-25" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, var(--bg-raised), rgba(29,32,39,.4))' }} />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Film className="w-16 h-16" strokeWidth={1} />
            </div>
          )}

          {/* Close button */}
          <button
            onClick={onClose}
            className="btn btn-icon cursor-pointer absolute top-4 rounded-full"
            style={{ insetInlineEnd: 16, background: 'rgba(0,0,0,.5)' }}
            aria-label={t.cancel}
          >
            <X className="w-5 h-5" />
          </button>

          {/* Poster + title */}
          <div
            className="absolute bottom-4 flex items-end gap-4"
            style={{ insetInlineStart: 24, insetInlineEnd: 24 }}
          >
            <div
              className="w-24 sm:w-28 aspect-[2/3] rounded-lg overflow-hidden shrink-0 bg-[var(--bg-input)]"
              style={{ boxShadow: '0 8px 24px rgba(0,0,0,.6)' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={media.posterUrl} alt={title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 pb-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="chip">
                  {isSeries ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                  {isSeries ? t.series : t.movie}
                </span>
                {media.releaseYear && <span className="chip nums">{media.releaseYear}</span>}
                <span className="text-[0.7rem] text-[var(--text-low)]">
                  {media.source === 'topcinema' ? t.sourceTopCinema : media.source === 'ahwak' ? t.sourceAhwak : t.sourceManual}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight">{title}</h2>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body space-y-5">

          {media.overview && (
            <div>
              <div className="section-label">{t.story}</div>
              <p className="text-sm text-[var(--text-mid)] leading-relaxed">{media.overview}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <div className="section-label">{t.selectStatus}</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {statusOptions.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  data-active={status === st}
                  className={`tab w-full justify-center`}
                >
                  {st === 'watching' ? t.watching
                    : st === 'completed' ? t.completed
                    : st === 'plan_to_watch' ? t.planToWatch
                    : t.dropped}
                </button>
              ))}
            </div>
          </div>

          {/* Series progress */}
          {isSeries && (
            <div className="section grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <div className="section-label">{t.currentSeason}</div>
                <input type="number" min={1} value={currentSeason} onChange={(e) => setCurrentSeason(parseInt(e.target.value) || 1)} className="input nums" />
              </div>
              <div>
                <div className="section-label">{t.currentEpisode}</div>
                <input type="number" min={0} value={currentEpisode} onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 0)} className="input nums" />
              </div>
              <div>
                <div className="section-label">{t.totalEpisodes}</div>
                <input type="number" min={1} placeholder="30" value={totalEpisodes || ''} onChange={(e) => setTotalEpisodes(e.target.value ? parseInt(e.target.value) : undefined)} className="input nums" />
              </div>
            </div>
          )}

          {/* Rating */}
          <div className="section">
            <div className="flex items-center justify-between mb-2">
              <div className="section-label mb-0">{t.rating}</div>
              <span className="nums text-sm font-bold text-[#f7c96b] flex items-center gap-1">
                <Star className="w-4 h-4 fill-[var(--warn)] text-[var(--warn)]" />
                {rating > 0 ? `${rating.toFixed(1)} / 10` : '—'}
              </span>
            </div>
            <input type="range" min={0} max={10} step={0.5} value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="w-full cursor-pointer accent-[var(--accent)]" />
          </div>

          {/* Notes */}
          <div>
            <div className="section-label">{t.notes}</div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="input resize-none"
            />
          </div>

          {/* Source link */}
          {media.sourceUrl && (
            <a
              href={media.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--text-mid)] hover:text-[var(--text-hi)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              مشاهدة العمل على {media.source === 'topcinema' ? 'توب سينما' : media.source === 'ahwak' ? 'أهواك تي في' : 'المصدر'}
            </a>
          )}
        </div>

        {/* Footer */}
        <div className="modal-foot justify-between">
          <button onClick={handleDelete} className="btn btn-sm text-[#ff8a8d] hover:bg-[#2d1e1e]">
            <Trash2 className="w-4 h-4" />
            {t.delete}
          </button>

          <div className="flex items-center gap-2">
            <button onClick={onClose} className="btn btn-ghost">{t.cancel}</button>
            <button onClick={handleSave} className="btn btn-primary">
              <Save className="w-4 h-4" />
              {t.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
