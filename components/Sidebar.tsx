'use client';

import React from 'react';
import {
  Home, PlayCircle, CheckCircle2, Bookmark, PauseCircle,
  BarChart3, Settings, Info,
} from 'lucide-react';
import { useTracking, AppView, WatchStatus } from '@/lib/store/tracking-context';

const VIEW_ITEMS: { id: AppView; icon: React.ElementType; labelKey: 'navHome' | 'navMyStats' | 'navSettings' | 'navAbout' }[] = [
  { id: 'home', icon: Home, labelKey: 'navHome' },
  { id: 'stats', icon: BarChart3, labelKey: 'navMyStats' },
  { id: 'settings', icon: Settings, labelKey: 'navSettings' },
  { id: 'about', icon: Info, labelKey: 'navAbout' },
];

const STATUS_ITEMS: { status: WatchStatus; icon: React.ElementType; color: string; soft: string; labelKey: 'watching' | 'completed' | 'planToWatch' | 'dropped' }[] = [
  { status: 'watching', icon: PlayCircle, color: 'var(--violet)', soft: 'var(--violet-soft)', labelKey: 'watching' },
  { status: 'completed', icon: CheckCircle2, color: 'var(--green)', soft: 'var(--green-soft)', labelKey: 'completed' },
  { status: 'plan_to_watch', icon: Bookmark, color: 'var(--orange)', soft: 'var(--orange-soft)', labelKey: 'planToWatch' },
  { status: 'dropped', icon: PauseCircle, color: 'var(--red)', soft: 'var(--red-soft)', labelKey: 'dropped' },
];

/** CSS pixel-art scene: couch + TV + plant (decorative) */
function PixelScene() {
  let px = 0;
  const P = (x: number, y: number, c: string, w = 1, h = 1) => (
    <span key={px++} style={{ position: 'absolute', left: x * 6, top: y * 6, width: w * 6, height: h * 6, background: c }} />
  );
  return (
    <div className="relative opacity-90 pointer-events-none" style={{ width: 168, height: 84 }} aria-hidden>
      {/* TV */}
      {P(13, 2, '#3a3050', 6, 1)}
      {P(14, 3, '#241d33', 4, 4)}
      {P(15, 4, '#7c5cfc', 1, 1)}
      {P(17, 5, '#8d70fd', 1, 1)}
      {/* TV stand */}
      {P(14, 7, '#3a3050', 4, 2)}
      {P(15, 9, '#241d33', 1, 2)}
      {P(18, 9, '#241d33', 1, 2)}
      {/* Couch */}
      {P(1, 7, '#5c4370', 8, 3)}
      {P(1, 5, '#6b4f81', 1, 4)}
      {P(8, 5, '#6b4f81', 1, 4)}
      {P(2, 10, '#4a3559', 1, 2)}
      {P(7, 10, '#4a3559', 1, 2)}
      {/* Plant */}
      {P(23, 6, '#22c55e', 1, 1)}
      {P(24, 5, '#16a34a', 1, 2)}
      {P(23, 4, '#22c55e', 1, 1)}
      {P(23, 7, '#3a3050', 2, 2)}
      {/* progress mini-bar */}
      {P(3, 12, '#2a2437', 4, 1)}
      {P(3, 12, '#22c55e', 3, 1)}
    </div>
  );
}

export const Sidebar: React.FC = () => {
  const { items, t, view, setView, language } = useTracking();

  const countFor = (s: WatchStatus) => items.filter((i) => i.status === s).length;

  const navBtn = (active: boolean) =>
    `w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.9rem] font-semibold transition-colors cursor-pointer ${
      active
        ? 'bg-gradient-to-l from-[#6d3ff2] to-[#7c5cfc] text-white shadow-[0_6px_20px_-6px_rgba(124,92,252,.6)]'
        : 'text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:bg-[var(--bg-raised)]'
    }`;

  return (
    <aside
      className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0"
      style={{ background: 'var(--bg-side)', borderInlineEnd: '1px solid var(--stroke)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-6">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center"
          style={{ background: 'var(--violet-soft)', border: '1px solid var(--violet-border)' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--violet)" strokeWidth="2">
            <rect x="7" y="4" width="13" height="13" rx="2" />
            <path d="M7 8 3 9v9l4 1z" fill="var(--violet)" stroke="none" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-2xl font-black">{t.appTitle}</div>
          <div className="text-[0.68rem] text-[var(--text-low)]" style={{ fontFamily: 'var(--font-pixel)' }}>
            Shahadt
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="px-3 space-y-1" aria-label="main">
        {VIEW_ITEMS.slice(0, 1).map((v) => (
          <button key={v.id} className={navBtn(view === v.id)} onClick={() => setView(v.id)}>
            <v.icon className="w-5 h-5 shrink-0" />
            <span>{t[v.labelKey]}</span>
          </button>
        ))}

        {/* Status shortcuts */}
        {STATUS_ITEMS.map((s) => (
          <button
            key={s.status}
            onClick={() => { setView('home'); }}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-[0.9rem] font-semibold text-[var(--text-mid)] hover:text-[var(--text-hi)] hover:bg-[var(--bg-raised)] transition-colors cursor-pointer"
          >
            <s.icon className="w-5 h-5 shrink-0" style={{ color: s.color }} />
            <span className="flex-1 text-start">{t[s.labelKey]}</span>
            <span className="badge" style={{ background: s.soft, color: s.color }}>
              {countFor(s.status)}
            </span>
          </button>
        ))}

        {/* Secondary views */}
        {VIEW_ITEMS.slice(1).map((v) => (
          <button key={v.id} className={navBtn(view === v.id)} onClick={() => setView(v.id)}>
            <v.icon className="w-5 h-5 shrink-0" />
            <span>{t[v.labelKey]}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto px-5 pb-5">
        <div className="mb-4 opacity-70"><PixelScene /></div>
        <div className="text-[0.65rem] text-[var(--text-low)] leading-relaxed" dir={language === 'ar' ? 'rtl' : 'ltr'}>
          © 2026 Shahadt — v1.0
        </div>
      </div>
    </aside>
  );
};

/** Mobile bottom nav */
export const MobileNav: React.FC = () => {
  const { t, view, setView } = useTracking();
  const items = [
    { id: 'home' as AppView, icon: Home, label: t.navHome },
    { id: 'stats' as AppView, icon: BarChart3, label: t.navMyStats },
    { id: 'settings' as AppView, icon: Settings, label: t.navSettings },
    { id: 'about' as AppView, icon: Info, label: t.navAbout },
  ];
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 flex items-center justify-around py-2 px-2"
      style={{ background: 'rgba(13,11,19,.92)', backdropFilter: 'blur(12px)', borderTop: '1px solid var(--stroke)' }}
      aria-label="mobile"
    >
      {items.map((v) => (
        <button
          key={v.id}
          onClick={() => setView(v.id)}
          className={`flex flex-col items-center gap-1 px-4 py-1.5 rounded-lg text-[0.65rem] cursor-pointer ${
            view === v.id ? 'text-[var(--violet)]' : 'text-[var(--text-low)]'
          }`}
        >
          <v.icon className="w-5 h-5" />
          <span>{v.label}</span>
        </button>
      ))}
    </nav>
  );
};
