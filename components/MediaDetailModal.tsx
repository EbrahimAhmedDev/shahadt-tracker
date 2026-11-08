'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Film,
  Tv,
  CheckCircle,
  Trash2,
  ExternalLink,
  Save,
  Clock,
  Sparkles,
} from 'lucide-react';
import { UserTracking, WatchStatus } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface MediaDetailModalProps {
  item: UserTracking | null;
  onClose: () => void;
}

export const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ item, onClose }) => {
  const { updateTracking, removeTracking, t, language } = useTracking();

  const [status, setStatus] = useState<WatchStatus>('watching');
  const [currentSeason, setCurrentSeason] = useState<number>(1);
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [totalEpisodes, setTotalEpisodes] = useState<number | undefined>(undefined);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (item) {
      setStatus(item.status);
      setCurrentSeason(item.currentSeason || 1);
      setCurrentEpisode(item.currentEpisode || 1);
      setTotalEpisodes(item.totalEpisodes);
      setRating(item.userRating || 0);
      setNotes(item.userNotes || '');
    }
  }, [item]);

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
      <div className="relative w-full max-w-2xl max-h-[92vh] glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col bg-[#0B101D]">
        
        {/* Header / Backdrop banner */}
        <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-slate-950">
          {media.posterUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={media.posterUrl}
              alt={title}
              className="w-full h-full object-cover blur-md scale-110 opacity-30"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-[#0B101D]/70 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 rtl:left-4 rtl:right-auto ltr:right-4 ltr:left-auto p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-all cursor-pointer backdrop-blur-md border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Poster & Title Banner Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end gap-4">
            <div className="w-24 sm:w-28 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 flex-shrink-0 bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={media.posterUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-red-600/20 text-red-400 border border-red-500/30 flex items-center gap-1">
                  {isSeries ? <Tv className="w-3 h-3 text-blue-400" /> : <Film className="w-3 h-3 text-rose-400" />}
                  {isSeries ? t.series : t.movie}
                </span>
                {media.releaseYear && (
                  <span className="text-xs text-slate-300 font-semibold px-2 py-0.5 rounded-md bg-white/10">
                    {media.releaseYear}
                  </span>
                )}
                <span
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${
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
              <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {title}
              </h2>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Overview / Story */}
          {media.overview && (
            <div className="glass-panel p-4 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                {t.story}
              </h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {media.overview}
              </p>
            </div>
          )}

          {/* Status Switcher */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">
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
                      ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                      : 'bg-slate-900/80 text-slate-400 border-white/5 hover:bg-slate-800 hover:text-white'
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
            <div className="glass-panel p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  {t.currentSeason}
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentSeason}
                  onChange={(e) => setCurrentSeason(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 text-sm text-white rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  {t.currentEpisode}
                </label>
                <input
                  type="number"
                  min="1"
                  value={currentEpisode}
                  onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 text-sm text-white rounded-xl p-2.5 border border-white/10"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 block mb-1.5">
                  {t.totalEpisodes}
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="30"
                  value={totalEpisodes || ''}
                  onChange={(e) => setTotalEpisodes(e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full bg-slate-900 text-sm text-white rounded-xl p-2.5 border border-white/10"
                />
              </div>
            </div>
          )}

          {/* Rating Slider & Value */}
          <div className="glass-panel p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-400">{t.rating}</label>
              <span className="text-sm font-black text-amber-400 flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
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
              className="w-full accent-red-600 cursor-pointer"
            />
          </div>

          {/* Personal Notes */}
          <div>
            <label className="text-xs font-bold text-slate-400 block mb-2">
              {t.notes}
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t.notesPlaceholder}
              className="w-full bg-slate-900/90 text-sm text-white rounded-2xl p-3.5 border border-white/10 focus:border-red-500 resize-none"
            />
          </div>

          {/* Source Link */}
          {media.sourceUrl && (
            <div className="pt-2">
              <a
                href={media.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-medium"
              >
                <span>مشاهدة العمل على موقع {media.source === 'topcinema' ? 'توب سينما' : 'أهواك تي في'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex items-center justify-between gap-3 bg-slate-950/60">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t.delete}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-600/30 transition-all cursor-pointer"
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
