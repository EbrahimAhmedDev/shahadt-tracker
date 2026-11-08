'use client';

import React from 'react';
import { Clapperboard } from 'lucide-react';
import { useTracking } from '@/lib/store/tracking-context';

/** Violet pixel scatter decoration */
function PixelDots() {
  const dots: { x: string; y: string; s: number; o: number }[] = [
    { x: '8%', y: '22%', s: 10, o: 0.9 },
    { x: '12%', y: '68%', s: 7, o: 0.6 },
    { x: '30%', y: '18%', s: 7, o: 0.4 },
    { x: '82%', y: '30%', s: 9, o: 0.8 },
    { x: '88%', y: '60%', s: 12, o: 0.9 },
    { x: '64%', y: '75%', s: 8, o: 0.5 },
    { x: '92%', y: '15%', s: 7, o: 0.6 },
  ];
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none">
      {dots.map((d, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            insetInlineStart: d.x,
            top: d.y,
            width: d.s,
            height: d.s,
            background: 'var(--violet)',
            opacity: d.o,
            imageRendering: 'pixelated',
          }}
        />
      ))}
    </div>
  );
}

export const Hero: React.FC = () => {
  const { t, language, items } = useTracking();

  return (
    <div
      className="relative overflow-hidden rounded-[var(--r-lg)] mb-5"
      style={{
        height: 190,
        background: 'var(--bg-panel)',
        border: '1px solid var(--stroke)',
      }}
    >
      {/* Backdrop from latest poster */}
      {items[0]?.media?.posterUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={items[0].media.posterUrl}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover opacity-25 blur-sm"
        />
      )}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to left, rgba(11,9,16,.2), rgba(11,9,16,.94) 70%)' }}
      />
      <PixelDots />

      {/* Title block (start side in RTL = right) */}
      <div
        className={`relative z-10 h-full flex flex-col justify-center gap-5 px-8 sm:px-10 ${language === 'ar' ? 'items-end text-end' : 'items-start text-start'}`}
      >
        <h1 className="pixel-title text-4xl sm:text-5xl text-white leading-none">{t.appTitle}</h1>
        <div className="pixel-underline w-36" aria-hidden />
        <div className="flex items-center gap-3 text-[0.95rem] font-semibold text-[var(--text-mid)]">
          <Clapperboard className="w-4.5 h-4.5 text-[var(--violet)]" />
          <span>تابع أفلامك ومسلسلاتك بكل سهولة</span>
        </div>
      </div>
    </div>
  );
};
