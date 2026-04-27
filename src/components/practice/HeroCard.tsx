import { ArrowRight } from 'lucide-react';
import type { ReactNode } from 'react';

// Hero card — the single, unmistakable "do this next" surface at the
// top of the chapter hub. Two of these stack vertically (Përditshmëri
// and Kapitulli) and together carry the entire hub.
//
// The card is deliberately *thin on text*. An earlier version stacked
// a lane label, an eyebrow, a title, a long description, and a meta
// chip — five text blocks. Most of them said the same thing twice.
// The new layout is:
//
//   • title          — what this is
//   • subtitle       — one short clarifier
//   • meta chip      — the live numbers
//   • bullets row    — peek at the content inside (chip per item)
//
// The `bullets` row turns the card from "button with description"
// into a mini-dashboard — the learner can see *what they'll find
// inside* before tapping. This was added when the two-hero hub left
// too much empty space below: bigger cards + richer footer fill the
// canvas without inventing a third lane.

export interface HeroBullet {
  /** Single character / Lucide icon / Arabic glyph rendered before the label. */
  icon?: ReactNode;
  /** Short label — "Dialogjet 4", "1 për sot". */
  label: string;
}

interface HeroCardProps {
  accent: 'brand' | 'slate' | 'rose' | 'blue' | 'indigo' | 'violet' | 'teal';
  icon: ReactNode;
  title: ReactNode;
  subtitle: ReactNode;
  meta?: string;
  /** Optional peek-strip rendered as a footer inside the card. Each
   *  bullet shows what content sits behind the CTA — a "here's what's
   *  inside" preview without forcing a full drill-down. */
  bullets?: HeroBullet[];
  /** Primary button label — defaults to "Hap". */
  ctaLabel?: string;
  onClick: () => void;
}

const ACCENTS: Record<
  HeroCardProps['accent'],
  {
    bg: string;
    iconBg: string;
    iconRing: string;
    btnBg: string;
    btnHover: string;
    border: string;
    glow: string;
    bulletDot: string;
    bulletBg: string;
  }
> = {
  brand: {
    bg: 'bg-gradient-to-br from-brand-50 via-white to-emerald-50/60',
    iconBg: 'bg-gradient-to-br from-brand-500 to-emerald-500',
    iconRing: 'ring-brand-400/30',
    btnBg: 'bg-brand-600',
    btnHover: 'hover:bg-brand-700',
    border: 'border-brand-200/70',
    glow: 'shadow-soft',
    bulletDot: 'bg-brand-500',
    bulletBg: 'bg-white/70 border-brand-100',
  },
  slate: {
    bg: 'bg-gradient-to-br from-slate-50 via-white to-slate-100/70',
    iconBg: 'bg-gradient-to-br from-slate-700 to-slate-900',
    iconRing: 'ring-slate-400/30',
    btnBg: 'bg-slate-800',
    btnHover: 'hover:bg-slate-900',
    border: 'border-slate-200',
    glow: 'shadow-soft',
    bulletDot: 'bg-slate-700',
    bulletBg: 'bg-white/70 border-slate-200',
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-50 via-white to-pink-50/50',
    iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
    iconRing: 'ring-rose-400/30',
    btnBg: 'bg-rose-600',
    btnHover: 'hover:bg-rose-700',
    border: 'border-rose-200/70',
    glow: 'shadow-soft',
    bulletDot: 'bg-rose-500',
    bulletBg: 'bg-white/70 border-rose-100',
  },
  blue: {
    bg: 'bg-gradient-to-br from-sky-50 via-white to-blue-50/70',
    iconBg: 'bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500',
    iconRing: 'ring-sky-400/40',
    btnBg: 'bg-blue-600',
    btnHover: 'hover:bg-blue-700',
    border: 'border-sky-200',
    glow: 'shadow-soft',
    bulletDot: 'bg-blue-500',
    bulletBg: 'bg-white/70 border-blue-100',
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-50 via-white to-violet-50/60',
    iconBg: 'bg-gradient-to-br from-indigo-500 to-violet-500',
    iconRing: 'ring-indigo-400/30',
    btnBg: 'bg-indigo-600',
    btnHover: 'hover:bg-indigo-700',
    border: 'border-indigo-200/70',
    glow: 'shadow-soft',
    bulletDot: 'bg-indigo-500',
    bulletBg: 'bg-white/70 border-indigo-100',
  },
  violet: {
    bg: 'bg-gradient-to-br from-violet-50 via-white to-fuchsia-50/50',
    iconBg: 'bg-gradient-to-br from-violet-500 to-fuchsia-500',
    iconRing: 'ring-violet-400/30',
    btnBg: 'bg-violet-600',
    btnHover: 'hover:bg-violet-700',
    border: 'border-violet-200/70',
    glow: 'shadow-soft',
    bulletDot: 'bg-violet-500',
    bulletBg: 'bg-white/70 border-violet-100',
  },
  teal: {
    bg: 'bg-gradient-to-br from-teal-50 via-white to-cyan-50/50',
    iconBg: 'bg-gradient-to-br from-teal-500 to-cyan-500',
    iconRing: 'ring-teal-400/30',
    btnBg: 'bg-teal-600',
    btnHover: 'hover:bg-teal-700',
    border: 'border-teal-200/70',
    glow: 'shadow-soft',
    bulletDot: 'bg-teal-500',
    bulletBg: 'bg-white/70 border-teal-100',
  },
};

export function HeroCard({
  accent,
  icon,
  title,
  subtitle,
  meta,
  bullets,
  ctaLabel = 'Hap',
  onClick,
}: HeroCardProps) {
  const a = ACCENTS[accent];
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border ${a.border} ${a.bg} ${a.glow} overflow-hidden transition-all duration-300 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 active:scale-[0.99]`}
    >
      {/* Two layered halos — one in each top corner — give the card
          real depth without putting anything visually distracting in
          the content area. The earlier single-halo version felt like
          a flat poster. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-20 -right-20 w-72 h-72 rounded-full ${a.iconBg} opacity-[0.13] blur-3xl`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute -bottom-24 -left-16 w-64 h-64 rounded-full ${a.iconBg} opacity-[0.08] blur-3xl`}
      />

      {/* Main row: icon + title/subtitle + meta+CTA. */}
      <div className="relative px-5 sm:px-7 pt-6 sm:pt-7 pb-5 sm:pb-6 flex items-center gap-4 sm:gap-6">
        <div
          className={`shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${a.iconBg} text-white ring-2 ${a.iconRing} flex items-center justify-center shadow-card group-hover:scale-105 transition-transform duration-300`}
        >
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-tight tracking-tight">
            {title}
          </h2>
          <div className="mt-1.5 text-sm sm:text-[15px] text-slate-600 leading-snug line-clamp-2">
            {subtitle}
          </div>
        </div>

        <div className="shrink-0 hidden sm:flex flex-col items-end gap-2">
          {meta && (
            <span className="text-[11px] tabular-nums text-slate-600 font-semibold bg-white/80 backdrop-blur-sm border border-slate-200/70 rounded-full px-2.5 py-0.5 shadow-sm">
              {meta}
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1.5 ${a.btnBg} ${a.btnHover} text-white text-sm font-semibold rounded-lg px-4 py-2.5 shadow-sm transition-colors`}
          >
            {ctaLabel}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </span>
        </div>
      </div>

      {/* Bullet peek strip — a horizontal row of small content chips
          that turn the card from a "button with caption" into a
          mini-dashboard. Each chip surfaces a piece of *what's inside*
          so the learner sees the lay of the land before tapping. */}
      {bullets && bullets.length > 0 && (
        <div className="relative px-5 sm:px-7 pb-5 sm:pb-6">
          <div className="border-t border-slate-200/60 pt-4 flex flex-wrap items-center gap-1.5 sm:gap-2">
            {bullets.map((b, i) => (
              <span
                key={i}
                className={`inline-flex items-center gap-1.5 text-[11.5px] sm:text-xs font-medium text-slate-700 ${a.bulletBg} border rounded-full px-2.5 py-1 backdrop-blur-sm shadow-sm`}
              >
                {b.icon ? (
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 text-slate-500">
                    {b.icon}
                  </span>
                ) : (
                  <span
                    aria-hidden
                    className={`inline-block w-1.5 h-1.5 rounded-full ${a.bulletDot}`}
                  />
                )}
                <span className="whitespace-nowrap">{b.label}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mobile: meta + CTA drop below the bullet strip on phones. */}
      <div className="sm:hidden relative px-5 pb-5 -mt-2 flex items-center justify-between gap-3">
        {meta ? (
          <span className="text-[11px] tabular-nums text-slate-600 font-semibold bg-white/80 backdrop-blur-sm border border-slate-200/70 rounded-full px-2.5 py-0.5 shadow-sm">
            {meta}
          </span>
        ) : (
          <span />
        )}
        <span
          className={`inline-flex items-center gap-1.5 ${a.btnBg} ${a.btnHover} text-white text-sm font-semibold rounded-lg px-4 py-2 shadow-sm transition-colors`}
        >
          {ctaLabel}
          <ArrowRight size={15} />
        </span>
      </div>
    </button>
  );
}
