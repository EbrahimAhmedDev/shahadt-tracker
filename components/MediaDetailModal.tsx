'use client';

import React, { useState } from 'react';
import {
  X,
  Star,
  Film,
  Tv,
  Trash2,
  ExternalLink,
  Save,
} from 'lucide-react';
import { UserTracking, WatchStatus } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface MediaDetailModalProps {
  item: UserTracking | null;
  onClose: () => void;
}

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
      completedAt: status === 'completed' && !item.completedAt ? new Date().toISOString() : item.completedAt,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[92vh] panel rounded-2xl border border-[#38301f] shadow-2xl overflow-hidden flex flex-col bg-[#221d14]">
        
        {/* Header / Backdrop banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#12100c]">
          {media.posterUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.posterUrl}
              alt={title}
              className="w-full h-full object-cover blur-md scale-110 opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#221d14] via-[#221d14]/70 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-md border border-[#38301f]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Poster & Title Banner Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
            <div className="w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-[#38301f] flex-shrink-0 bg-[#141109]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-[#f2b441]/20 text-[#f2b441] border border-[#f2b441]/30 flex items-center gap-1">
                  {isSeries ? <Tv className="w-3 h-3 text-[#9ecfff]" /> : <Film className="w-3 h-3 text-[#f2b441]" />}
                  {isSeries ? t.series : t.movie}
                </span>
                {media.releaseYear && (
                  <span className="text-xs text-[#cfc4ab] font-semibold px-2 py-0.5 rounded-md bg-white/10">
                    {media.releaseYear}
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
                    media.source === 'topcinema'
                      ? 'bg-[#2a2317]/80 text-[#f2b441] border-[#f2b441]/40'
                      : media.source === 'ahwak'
                      ? 'bg-teal-950/80 text-teal-300 border-teal-500/40'
                      : 'bg-[#2a2317] text-[#c9b3ff] border-purple-500/40'
                  }`}
                >
                  {media.source === 'topcinema'
                    ? t.sourceTopCinema
                    : media.source === 'ahwak'
                    ? t.sourceAhwak
                    : t.sourceManual}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#f3ecdd] leading-tight">
                {title}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Overview / Story */}
          {media.overview && (
            <div className="panel p-4 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#948b76] mb-1.5">
                {t.story}
              </h4>
              <p className="text-sm text-[#f3ecdd] leading-relaxed">
                {media.overview}
              </p>
            </div>
          )}

          {/* Status Switcher */}
          <div>
            <label className="text-xs font-bold text-[#948b76] block mb-2">
              {t.selectStatus}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['watching', 'completed', 'plan_to_watch', 'dropped'] as WatchStatus[]).map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStatus(st)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    status === st
                      ? 'bg-[#f2b441] text-[#12100c] border-[#f2b441] '
                      : 'bg-[#1b1710] text-[#948b76] border-[#38301f] hover:bg-[#1b1710] hover:text-[#f3ecdd]'
                  }`}
                >
                  {st === 'watching'
                    ? t.watching
                    : st === 'completed'
                    ? t.completed
                    : st === 'plan_to_watch'
                    ? t.planToWatch
                    : t.dropped}
                </button>
              ))}
            </div>
          </div>

          {/* Episode Progress (for Series) */}
          {isSeries && (
            <div className="panel p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-[#948b76] block mb-1.5">
                  {t.currentSeason}
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentSeason}
                  onChange={(e) => setCurrentSeason(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#141109] text-sm text-[#f3ecdd] rounded-xl p-2.5 border border-[#38301f]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#948b76] block mb-1.5">
                  {t.currentEpisode}
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#141109] text-sm text-[#f3ecdd] rounded-xl p-2.5 border border-[#38301f]"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-[#948b76] block mb-1.5">
                  {t.totalEpisodes}
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="30"
                  value={totalEpisodes || ''}
                  onChange={(e) => setTotalEpisodes(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full bg-[#141109] text-sm text-[#f3ecdd] rounded-xl p-2.5 border border-[#38301f]"
                />
              </div>
            </div>
          )}

          {/* Rating Slider & Value */}
          <div className="panel p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-[#948b76]">{t.rating}</label>
              <span className="text-sm font-black text-[#f2b441] flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#f2b441] text-[#f2b441]" />
                {rating > 0 ? `${rating.toFixed(1)} / 10` : 'بدون تقييم'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={rating}
              onChange={(e) => setRating(parseFloat(e.target.value))}
              className="w-full accent-[#f2b441] cursor-pointer"
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label className="text-xs font-bold text-[#948b76] block mb-2">
              {t.notes}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full bg-[#1b1710] text-sm text-[#f3ecdd] rounded-2xl p-3.5 border border-[#38301f] focus:border-[#f2b441] resize-none"
            />
          </div>

          {/* Source Link */}
          {media.sourceUrl && (
            <div className="pt-2">
              <a
                href={media.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-[#f2b441] hover:text-[#f2b441] font-medium"
              >
                <span>مشاهدة العمل على موقع {media.source === 'topcinema' ? 'توب سينما' : 'أهواك تي في'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#38301f] flex items-center justify-between gap-3 bg-[#12100c]/960">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-[#f2b441] hover:bg-#c45050/10 border border-[#c45050]/30 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.delete}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#cfc4ab] hover:bg-[#1b1710] transition-all cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#f2b441] hover:bg-[#ffd27a] text-white  transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.save}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
