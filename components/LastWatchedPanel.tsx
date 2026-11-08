'use client';

import React from 'react';
import { Zap, Film } from 'lucide-react';
import { UserTracking } from '@/types/media';
import { useTracking } from '@/lib/store/tracking-context';

interface LastWatchedPanelProps {
  onSelect: (item: UserTracking) => void;
}

export const LastWatchedPanel: React.FC<LastWatchedPanelProps> = ({ onSelect }) => {
  const { items, t, setActiveTab, setView } = useTracking();

  const last = items
    .filter((i) => i.media?.type === 'series' && i.status === 'watching')
    .sort((a, b) => (b.updatedAt || '').localeCompare(a.updatedAt || ''))[0];

  const progress =
    last?.totalEpisodes && last.totalEpisodes > 0
      ? Math.min(100, Math.round(((last.currentEpisode || 0) / last.totalEpisodes) * 100))
      : null;

  return (
    <div className="panel p-4 flex flex-col gap-3 h-fit">
      <div className="flex items-center gap-2 text-[0.9rem] font-bold">
        <Zap className="w-4 h-4 text-[var(--yellow)] fill-[var(--yellow)]" />
        <span>{t.lastWatched}</span>
      </div>

      {last && last.media ? (
        <button
          onClick={() => onSelect(last)}
          className="flex items-center gap-3 p-2.5 rounded-[var(--r-md)] text-start hover:bg-[var(--bg-raised)] transition-colors cursor-pointer"
        >
          {last.media.posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={last.media.posterUrl}
              alt={last.media.titleAr}
              className="w-16 h-16 rounded-xl object-cover shrink-0"
            />
          ) : (
            <span className="w-16 h-16 rounded-xl bg-[var(--bg-input)] flex items-center justify-center shrink-0">
              <Film className="w-6 h-6 text-[var(--text-low)]" />
            </span>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-[0.85rem] line-clamp-1">{last.media.titleEn || last.media.titleAr}</div>
            <div className="nums text-[0.7rem] text-[var(--text-low)]">
              S{last.currentSeason ?? 1} • E{last.currentEpisode || 0}
            </div>
            {progress !== null && (
              <div className="progress-track mt-1.5">
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
            )}
          </div>
        </button>
      ) : null}

      {/* Suggestion quote box */}
      <div
        className="rounded-[var(--r-md)] p-4 text-center flex flex-col items-center gap-2"
        style={{ background: 'var(--bg-input)', border: '1px dashed var(--stroke-strong)' }}
      >
        <p className="text-[0.8rem] text-[var(--text-mid)] leading-relaxed">&quot;الأفلام حياة ثانية تعيشها مرة أخرى…&quot;</p>
        <button
          onClick={() => { setView('home'); setActiveTab('plan_to_watch'); }}
          className="btn btn-ghost btn-sm gap-1.5"
        >
          <Film className="w-3.5 h-3.5 text-[var(--violet)]" />
          <span>{t.planToWatch}</span>
        </button>
      </div>
    </div>
  );
};
