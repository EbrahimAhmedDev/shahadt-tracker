'use client';

import React, { useState } from 'react';
import { X, Search, Film, Tv, Loader2, Check, Star, ExternalLink } from 'lucide-react';
import { SearchResultItem, MediaType, WatchStatus } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface AddMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_POSTER =
  'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';

export const AddMediaModal: React.FC<AddMediaModalProps> = ({ isOpen, onClose }) => {
  const { addMedia, t } = useTracking();
  const [activeTab, setActiveTab] = useState<'search' | 'manual'>('search');

  // Search tab state
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [detectedSource, setDetectedSource] = useState<'topcinema' | 'ahwak' | 'none'>('none');
  const [selectedResult, setSelectedResult] = useState<SearchResultItem | null>(null);

  // Configuration state
  const [watchStatus, setWatchStatus] = useState<WatchStatus>('watching');
  const [currentEpisode, setCurrentEpisode] = useState<number>(1);
  const [totalEpisodes, setTotalEpisodes] = useState<number | undefined>(undefined);
  const [rating, setRating] = useState<number>(8.5);
  const [userNotes, setUserNotes] = useState<string>('');

  // Manual entry state
  const [manualTitle, setManualTitle] = useState('');
  const [manualType, setManualType] = useState<MediaType>('movie');
  const [manualPoster, setManualPoster] = useState('');
  const [manualYear, setManualYear] = useState<number>(new Date().getFullYear());
  const [manualOverview, setManualOverview] = useState('');

  if (!isOpen) return null;

  const statusOptions: WatchStatus[] = ['watching', 'completed', 'plan_to_watch'];

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
        totalEpisodes,
        userRating: rating > 0 ? rating : undefined,
        userNotes,
      }
    );
    onClose();
  };

  const handleAddManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualTitle.trim()) return;
    addMedia(
      {
        titleAr: manualTitle.trim(),
        type: manualType,
        posterUrl: manualPoster.trim() || FALLBACK_POSTER,
        overview: manualOverview.trim(),
        releaseYear: manualYear,
        source: 'manual',
      },
      {
        status: watchStatus,
        currentEpisode: manualType === 'series' ? currentEpisode : 1,
        totalEpisodes,
        userRating: rating > 0 ? rating : undefined,
        userNotes,
      }
    );
    onClose();
  };

  const statusButtons = (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label={t.selectStatus}>
      {statusOptions.map((st) => (
        <button
          key={st}
          type="button"
          onClick={() => setWatchStatus(st)}
          className={watchStatus === st ? 'btn btn-primary btn-sm justify-center' : 'btn btn-sm justify-center'}
        >
          {st === 'watching' ? t.watching : st === 'completed' ? t.completed : t.planToWatch}
        </button>
      ))}
    </div>
  );

  return (
    <div
      className="overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal max-w-2xl">

        {/* Header */}
        <div className="modal-head">
          <h2 className="text-base font-bold">{t.searchModalTitle}</h2>
          <button onClick={onClose} className="btn btn-ghost btn-icon btn-sm" aria-label={t.cancel}>
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Tabs */}
        <div
          className="flex shrink-0"
          style={{ borderBottom: '1px solid var(--stroke)', background: 'var(--bg-elevated)' }}
          role="tablist"
        >
          {([
            { id: 'search', label: `${t.searchButton} (توب سينما & أهواك)` },
            { id: 'manual', label: t.addManual },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => { setActiveTab(tab.id); setSelectedResult(null); }}
              className="px-5 py-3.5 text-[0.8rem] font-semibold relative cursor-pointer transition-colors"
              style={{
                color: activeTab === tab.id ? 'var(--text-hi)' : 'var(--text-low)',
              }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  aria-hidden
                  className="absolute top-0 inset-x-0 h-0.5"
                  style={{ background: 'var(--accent)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="modal-body space-y-5">
          {activeTab === 'search' ? (
            <>
              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute w-4 h-4 text-[var(--text-low)] pointer-events-none"
                    style={{ insetInlineStart: 12, top: '50%', transform: 'translateY(-50%)' }}
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    autoFocus
                    className="input input-search"
                  />
                </div>
                <button type="submit" disabled={isSearching} className="btn btn-primary">
                  {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : t.searchButton}
                </button>
              </form>

              {/* Source hint */}
              {detectedSource !== 'none' && !isSearching && (
                <div className="text-[0.72rem] text-[var(--text-low)]">
                  {t.source}: <span className="font-semibold text-[var(--text-mid)]">{detectedSource === 'topcinema' ? t.sourceTopCinema : t.sourceAhwak}</span>
                </div>
              )}

              {/* Loading */}
              {isSearching && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <Loader2 className="w-7 h-7 text-[var(--accent)] animate-spin mb-3" />
                  <p className="text-sm text-[var(--text-mid)]">{t.searching}</p>
                </div>
              )}

              {/* Results */}
              {!isSearching && !selectedResult && results.length > 0 && (
                <div className="space-y-3">
                  <div className="text-[0.72rem] text-[var(--text-low)] nums">
                    {t.searchResults} · {results.length}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {results.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setSelectedResult(item)}
                        className="media-card cursor-pointer text-start flex flex-col"
                      >
                        <div className="aspect-[2/3] w-full bg-[var(--bg-input)] overflow-hidden relative">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.posterUrl}
                            alt={item.title}
                            loading="lazy"
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_POSTER; }}
                          />
                        </div>
                        <div className="p-2.5">
                          <p className="text-[0.78rem] font-semibold line-clamp-2 leading-snug" style={{ color: 'var(--text-hi)' }}>
                            {item.title}
                          </p>
                          {item.year && (
                            <span className="nums text-[0.68rem] text-[var(--text-low)] mt-1 block">{item.year}</span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* No results */}
              {!isSearching && results.length === 0 && query && !selectedResult && (
                <div className="section text-center">
                  <Film className="w-9 h-9 text-[#33373f] mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-hi)' }}>{t.noResults}</p>
                  <p className="text-xs text-[var(--text-low)] mb-4">جرّب اسم تاني، أو أضف العمل يدوياً.</p>
                  <button
                    onClick={() => { setManualTitle(query); setActiveTab('manual'); }}
                    className="btn btn-sm"
                  >
                    {t.addManual}
                  </button>
                </div>
              )}

              {/* Selected result config */}
              {selectedResult && (
                <div className="section space-y-4">
                  <div className="flex gap-4">
                    <div className="w-20 aspect-[2/3] rounded-lg overflow-hidden shrink-0 bg-[var(--bg-input)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={selectedResult.posterUrl} alt={selectedResult.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className="chip">
                          {selectedResult.type === 'series' ? <Tv className="w-3 h-3" /> : <Film className="w-3 h-3" />}
                          {selectedResult.type === 'series' ? t.series : t.movie}
                        </span>
                        {selectedResult.year && <span className="chip nums">{selectedResult.year}</span>}
                        <a
                          href={selectedResult.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[0.7rem] text-[var(--text-low)] hover:text-[var(--text-mid)] inline-flex items-center gap-1"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                      <h4 className="text-sm font-bold leading-snug" style={{ color: 'var(--text-hi)' }}>{selectedResult.title}</h4>
                      <button
                        onClick={() => setSelectedResult(null)}
                        className="text-[0.72rem] text-[var(--text-mid)] hover:text-[var(--text-hi)] mt-2 cursor-pointer"
                      >
                        ← اختيار عمل آخر
                      </button>
                    </div>
                  </div>

                  <div>
                    <div className="section-label">{t.selectStatus}</div>
                    {statusButtons}
                  </div>

                  {selectedResult.type === 'series' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="section-label">{t.currentEpisode}</div>
                        <input type="number" min={1} value={currentEpisode} onChange={(e) => setCurrentEpisode(parseInt(e.target.value) || 1)} className="input nums" />
                      </div>
                      <div>
                        <div className="section-label">{t.totalEpisodes} (اختياري)</div>
                        <input type="number" min={1} placeholder="مثلاً 30" value={totalEpisodes || ''} onChange={(e) => setTotalEpisodes(e.target.value ? parseInt(e.target.value) : undefined)} className="input nums" />
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="section-label mb-0">{t.rating}</div>
                      <span className="nums text-sm font-bold text-[#f7c96b] flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-[var(--warn)] text-[var(--warn)]" />
                        {rating > 0 ? `${rating.toFixed(1)} / 10` : '—'}
                      </span>
                    </div>
                    <input type="range" min={0} max={10} step={0.5} value={rating} onChange={(e) => setRating(parseFloat(e.target.value))} className="w-full cursor-pointer accent-[var(--accent)]" />
                  </div>

                  <div>
                    <div className="section-label">{t.notes}</div>
                    <textarea rows={2} value={userNotes} onChange={(e) => setUserNotes(e.target.value)} placeholder={t.notesPlaceholder} className="input resize-none" />
                  </div>

                  <button onClick={handleAddSearchResult} className="btn btn-primary w-full">
                    <Check className="w-4 h-4" strokeWidth={3} />
                    {t.addToTracker}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* ---- Manual entry ---- */
            <form onSubmit={handleAddManual} className="space-y-4">
              <div>
                <div className="section-label">{t.customTitle} *</div>
                <input
                  type="text"
                  required
                  value={manualTitle}
                  onChange={(e) => setManualTitle(e.target.value)}
                  placeholder="مثال: فيلم Interstellar"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="section-label">{t.movie} / {t.series}</div>
                  <select
                    value={manualType}
                    onChange={(e) => setManualType(e.target.value as MediaType)}
                    className="input"
                  >
                    <option value="movie">{t.movie}</option>
                    <option value="series">{t.series}</option>
                  </select>
                </div>
                <div>
                  <div className="section-label">{t.year}</div>
                  <input type="number" value={manualYear} onChange={(e) => setManualYear(parseInt(e.target.value) || new Date().getFullYear())} className="input nums" />
                </div>
              </div>

              <div>
                <div className="section-label">{t.customPoster}</div>
                <input
                  type="url"
                  value={manualPoster}
                  onChange={(e) => setManualPoster(e.target.value)}
                  placeholder="https://.../poster.jpg"
                  className="input"
                />
              </div>

              <div>
                <div className="section-label">{t.story}</div>
                <textarea
                  rows={2}
                  value={manualOverview}
                  onChange={(e) => setManualOverview(e.target.value)}
                  placeholder="نبذة مختصرة عن العمل…"
                  className="input resize-none"
                />
              </div>

              <div>
                <div className="section-label">{t.selectStatus}</div>
                {statusButtons}
              </div>

              <button type="submit" className="btn btn-primary w-full btn-lg">
                {t.addToTracker}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
