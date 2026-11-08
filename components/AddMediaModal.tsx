'use client';

import React, { useState } from 'react';
import {
  X,
  Search,
  Sparkles,
  Film,
  Tv,
  Plus,
  Loader2,
  Check,
  Star,
  ExternalLink,
  Sliders,
} from 'lucide-react';
import { SearchResultItem, MediaType, WatchStatus } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddMediaModal: React.FC<AddMediaModalProps> = ({ isOpen, onClose }) => {
  const { addMedia, t, language } = useTracking();
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');

  // Search tab state
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [detectedSource, setDetectedSource] = useState<'topcinema' | 'ahwak' | 'none'>('none');
  const [selectedResult, setSelectedResult] = useState<SearchResultItem | null>(null);

  // Configuration state for the selected item
  const [watchStatus, setWatchStatus] = useState<WatchStatus>('watching');
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [totalEpisodes, setTotalEpisodes] = useState<number | undefined>(undefined);
  const [rating, setRating] = useState<number>(8.5);
  const [userNotes, setUserNotes] = useState<string>('');

  // Manual entry form state
  const [manualTitle, setManualTitle] = useState('');
  const [manualType, setManualType] = useState<MediaType>('movie');
  const [manualPoster, setManualPoster] = useState('');
  const [manualYear, setManualYear] = useState<number>(new Date().getFullYear());
  const [manualOverview, setManualOverview] = useState('');

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setSelectedResult(null);
    try {
      const res = await fetch(`/api/media/search?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      setResults(data.results || []);
      setDetectedSource(data.primarySource || 'none');
    } catch (err) {
      console.error('Search failed:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddSearchResult = () => {
    if (!selectedResult) return;

    addMedia(
      {
        titleAr: selectedResult.title,
        titleEn: selectedResult.originalTitle,
        type: selectedResult.type,
        posterUrl: selectedResult.posterUrl,
        overview: selectedResult.overview,
        releaseYear: selectedResult.year ? parseInt(selectedResult.year) : undefined,
        source: selectedResult.source,
        sourceUrl: selectedResult.sourceUrl,
      },
      {
        status: watchStatus,
        currentEpisode: selectedResult.type === 'series' ? currentEpisode : 1,
        totalEpisodes: totalEpisodes,
        userRating: rating > 0 ? rating : undefined,
        userNotes: userNotes,
      }
    );

    // Reset and close
    onClose();
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;

    addMedia(
      {
        titleAr: manualTitle.trim(),
        type: manualType,
        posterUrl:
          manualPoster.trim() ||
          'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60',
        overview: manualOverview.trim(),
        releaseYear: manualYear,
        source: 'manual',
      },
      {
        status: watchStatus,
        currentEpisode: manualType === 'series' ? currentEpisode : 1,
        totalEpisodes: totalEpisodes,
        userRating: rating > 0 ? rating : undefined,
        userNotes: userNotes,
      }
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl max-h-[90vh] glass-panel rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col bg-[#0B101D]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <h2 className="text-lg font-bold text-white">
              {t.searchModalTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-white/5">
          <button
            onClick={() => {
              setActiveTab('search');
              setSelectedResult(null);
            }}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'search'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.searchButton} (توب سينما & أهواك)
          </button>
          <button
            onClick={() => {
              setActiveTab('manual');
              setSelectedResult(null);
            }}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              activeTab === 'manual'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t.addManual}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'search' ? (
            <>
              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 right-3.5 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto text-slate-500" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    autoFocus
                    className="w-full bg-slate-900/90 text-sm text-white placeholder-slate-500 rounded-xl py-3 px-10 border border-white/10 focus:outline-none focus:border-red-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-5 py-3 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/25"
                >
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : t.searchButton}
                </button>
              </form>

              {/* Source Indicator */}
              {detectedSource !== 'none' && !isSearching && (
                <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                  <span>{t.source}:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded-full ${
                      detectedSource === 'topcinema'
                        ? 'bg-red-950 text-red-300 border border-red-500/40'
                        : 'bg-teal-950 text-teal-300 border border-teal-500/40'
                    }`}
                  >
                    {detectedSource === 'topcinema' ? t.sourceTopCinema : t.sourceAhwak}
                  </span>
                </div>
              )}

              {/* Loading indicator */}
              {isSearching && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
                  <p className="text-sm text-slate-400 font-medium">{t.searching}</p>
                </div>
              )}

              {/* Results Grid */}
              {!isSearching && !selectedResult && results.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {t.searchResults} ({results.length})
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {results.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedResult(item)}
                        className="group relative glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-900/20 transition-all cursor-pointer flex flex-col"
                      >
                        <div className="aspect-[2/3] w-full bg-slate-900 overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
                            }}
                          />
                          <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-white font-bold flex items-center gap-1">
                              {item.type === 'series' ? <Tv className="w-2.5 h-2.5 text-blue-400" /> : <Film className="w-2.5 h-2.5 text-rose-400" />}
                              {item.type === 'series' ? t.series : t.movie}
                            </span>
                          </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-bold text-white line-clamp-2 leading-tight group-hover:text-red-400 transition-colors">
                            {item.title}
                          </p>
                          {item.year && (
                            <span className="text-[10px] text-slate-400 mt-1 block">
                              {item.year}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* No results message */}
              {!isSearching && results.length === 0 && query && (
                <div className="py-10 text-center glass-panel rounded-2xl p-6">
                  <Film className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-300 font-semibold mb-2">{t.noResults}</p>
                  <button
                    onClick={() => {
                      setManualTitle(query);
                      setActiveTab('manual');
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-white border border-white/10 transition-all cursor-pointer"
                  >
                    + {t.addManual}
                  </button>
                </div>
              )}

              {/* Selected Result Configuration Panel */}
              {selectedResult && (
                <div className="glass-panel p-5 rounded-2xl space-y-4 border border-red-500/30">
                  <div className="flex gap-4">
                    <div className="w-24 aspect-[2/3] rounded-xl overflow-hidden bg-slate-900 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selectedResult.posterUrl}
                        alt={selectedResult.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-red-600/20 text-red-400 border border-red-500/30">
                          {selectedResult.type === 'series' ? t.series : t.movie}
                        </span>
                        {selectedResult.year && (
                          <span className="text-xs text-slate-400">{selectedResult.year}</span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white mb-2">
                        {selectedResult.title}
                      </h4>
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="text-xs text-red-400 hover:underline"
                      >
                        ← اختيار عمل آخر
                      </button>
                    </div>
                  </div>

                  {/* Status Picker */}
                  <div>
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                      {t.selectStatus}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['watching', 'completed', 'plan_to_watch'] as WatchStatus[]).map((st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setWatchStatus(st)}
                          className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            watchStatus === st
                              ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30'
                              : 'bg-slate-900/80 text-slate-300 border-white/5 hover:bg-slate-800'
                          }`}
                        >
                          {st === 'watching' ? t.watching : st === 'completed' ? t.completed : t.planToWatch}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* If series: episodes config */}
                  {selectedResult.type === 'series' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-slate-400 block mb-1.5">
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
                        <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                          {t.totalEpisodes} (اختياري)
                        </label>
                        <input
                          type="number"
                          min="1"
                          placeholder="مثلاً 30"
                          value={totalEpisodes || ''}
                          onChange={(e) => setTotalEpisodes(e.target.value ? parseInt(e.target.value) : undefined)}
                          className="w-full bg-slate-900 text-sm text-white rounded-xl p-2.5 border border-white/10"
                        />
                      </div>
                    </div>
                  )}

                  {/* Rating Slider & Value */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-slate-400">{t.rating}</label>
                      <span className="text-sm font-black text-amber-400 flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        {rating.toFixed(1)} / 10
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
                    <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                      {t.notes}
                    </label>
                    <textarea
                      rows={2}
                      value={userNotes}
                      onChange={(e) => setUserNotes(e.target.value)}
                      placeholder={t.notesPlaceholder}
                      className="w-full bg-slate-900 text-sm text-white rounded-xl p-2.5 border border-white/10 resize-none"
                    />
                  </div>

                  {/* Confirm Add Button */}
                  <button
                    onClick={handleAddSearchResult}
                    className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-xl shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{t.addToTracker}</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Manual Entry Form */
            <form onSubmit={handleAddManual} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  {t.customTitle} *
                </label>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="مثال: فيلم Interstellar"
                  className="w-full bg-slate-900 text-sm text-white rounded-xl p-3 border border-white/10 focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    {t.movie} / {t.series}
                  </label>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as MediaType)}
                    className="w-full bg-slate-900 text-sm text-white rounded-xl p-3 border border-white/10"
                  >
                    <option value="movie">{t.movie}</option>
                    <option value="series">{t.series}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                    {t.year}
                  </label>
                  <input
                    type="number"
                    value={manualYear}
                    onChange={(e) => setManualYear(parseInt(e.target.value) || 2024)}
                    className="w-full bg-slate-900 text-sm text-white rounded-xl p-3 border border-white/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  {t.customPoster}
                </label>
                <input
                  type="url"
                  value={manualPoster}
                  onChange={(e) => setManualPoster(e.target.value)}
                  placeholder="https://.../poster.jpg"
                  className="w-full bg-slate-900 text-sm text-white rounded-xl p-3 border border-white/10"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  {t.story}
                </label>
                <textarea
                  rows={2}
                  value={manualOverview}
                  onChange={(e) => setManualOverview(e.target.value)}
                  placeholder="نبذة مختصرة عن العمل..."
                  className="w-full bg-slate-900 text-sm text-white rounded-xl p-3 border border-white/10 resize-none"
                />
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-semibold text-slate-400 block mb-1.5">
                  {t.selectStatus}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['watching', 'completed', 'plan_to_watch'] as WatchStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setWatchStatus(st)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        watchStatus === st
                          ? 'bg-red-600 text-white border-red-500'
                          : 'bg-slate-900 text-slate-300 border-white/5'
                      }`}
                    >
                      {st === 'watching' ? t.watching : st === 'completed' ? t.completed : t.planToWatch}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-xl shadow-red-600/30 transition-all cursor-pointer"
              >
                + {t.addToTracker}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
