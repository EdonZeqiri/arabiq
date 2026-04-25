import { ArrowRight, Check, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';

// One of the four "hub" cards on the chapter landing page. Each card
// represents an activity (Dialogues / Exercises / Stories / Ayat) and
// behaves like an app icon: tap to enter the activity in full canvas.
//
// The visual budget is tight on purpose — the goal is for a learner
// to glance at the four cards and know exactly which one to tap next:
//   - left rail: large accent-colored icon
//   - title + 1-line description
//   - progress strip (e.g. "3 / 5 të mbaruara")
//   - "Fillo këtu" badge on the recommended next step

interface ActivityCardProps {
  icon: ReactNode;
  title: string;
  /** Short Albanian description shown under the title */
  description: string;
  /** "3 / 5", "12 fjalë", etc. — short progress / count */
  progress?: string;
  /** 0..1 — fills the bottom progress bar; omit to hide */
  progressRatio?: number;
  /** Show a "Fillo këtu" hint on the recommended next card */
  recommended?: boolean;
  /** True when the activity is fully completed for this chapter */
  done?: boolean;
  /** Disabled state — used when a chapter doesn't have this activity */
  disabled?: boolean;
  /** Color accent — must match a key in the ACCENTS map below */
  accent: 'brand' | 'blue' | 'emerald' | 'amber' | 'indigo';
  onClick: () => void;
}

const ACCENTS: Record<
  ActivityCardProps['accent'],
  {
    iconBg: string;
    iconText: string;
    iconRing: string;
    bar: string;
    ring: string;
    glow: string;
    corner: string;
  }
> = {
  brand: {
    iconBg: 'bg-gradient-to-br from-brand-100 to-brand-50',
    iconText: 'text-brand-700',
    iconRing: 'ring-brand-200/60',
    bar: 'bg-gradient-to-r from-brand-500 to-emerald-500',
    ring: 'group-hover:border-brand-300',
    glow: 'group-hover:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.35)]',
    corner: 'from-brand-100/40',
  },
  blue: {
    iconBg: 'bg-gradient-to-br from-blue-100 to-sky-50',
    iconText: 'text-blue-700',
    iconRing: 'ring-blue-200/60',
    bar: 'bg-gradient-to-r from-blue-500 to-sky-500',
    ring: 'group-hover:border-blue-300',
    glow: 'group-hover:shadow-[0_8px_32px_-8px_rgba(59,130,246,0.35)]',
    corner: 'from-blue-100/40',
  },
  emerald: {
    iconBg: 'bg-gradient-to-br from-emerald-100 to-teal-50',
    iconText: 'text-emerald-700',
    iconRing: 'ring-emerald-200/60',
    bar: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    ring: 'group-hover:border-emerald-300',
    glow: 'group-hover:shadow-[0_8px_32px_-8px_rgba(16,185,129,0.35)]',
    corner: 'from-emerald-100/40',
  },
  amber: {
    iconBg: 'bg-gradient-to-br from-amber-100 to-orange-50',
    iconText: 'text-amber-700',
    iconRing: 'ring-amber-200/60',
    bar: 'bg-gradient-to-r from-amber-500 to-orange-500',
    ring: 'group-hover:border-amber-300',
    glow: 'group-hover:shadow-[0_8px_32px_-8px_rgba(245,158,11,0.35)]',
    corner: 'from-amber-100/40',
  },
  indigo: {
    iconBg: 'bg-gradient-to-br from-indigo-100 to-violet-50',
    iconText: 'text-indigo-700',
    iconRing: 'ring-indigo-200/60',
    bar: 'bg-gradient-to-r from-indigo-500 to-violet-500',
    ring: 'group-hover:border-indigo-300',
    glow: 'group-hover:shadow-[0_8px_32px_-8px_rgba(99,102,241,0.35)]',
    corner: 'from-indigo-100/40',
  },
};

export function ActivityCard({
  icon,
  title,
  description,
  progress,
  progressRatio,
  recommended,
  done,
  disabled,
  accent,
  onClick,
}: ActivityCardProps) {
  const a = ACCENTS[accent];
  const pct =
    typeof progressRatio === 'number'
      ? Math.max(0, Math.min(1, progressRatio)) * 100
      : null;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative card text-left p-5 md:p-6 border overflow-hidden ${a.ring} ${a.glow} disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-1 motion-reduce:hover:translate-y-0 active:scale-[0.99]`}
    >
      {/* Soft accent wash in the top-right corner — adds tint without
          fighting the content. Hidden on disabled state via opacity. */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-12 -right-12 w-40 h-40 rounded-full bg-gradient-to-br ${a.corner} to-transparent blur-2xl opacity-70 group-hover:opacity-100 transition-opacity`}
      />

      {/* Recommended / Done badge — top-right corner */}
      {done ? (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-2 py-0.5 shadow-sm border border-emerald-200/50">
          <Check size={10} /> Mbaroi
        </span>
      ) : recommended ? (
        <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-semibold px-2 py-0.5 shadow-sm">
          <Sparkles size={10} /> Fillo këtu
        </span>
      ) : null}

      <div className="relative flex items-start gap-4">
        <div
          className={`shrink-0 w-14 h-14 rounded-2xl ${a.iconBg} ${a.iconText} ring-1 ${a.iconRing} flex items-center justify-center shadow-innerSoft group-hover:scale-105 transition-transform duration-300`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1 pt-0.5">
          <div className="text-[15px] font-semibold text-slate-800 leading-tight">
            {title}
          </div>
          <div className="text-xs text-slate-500 mt-1 leading-snug">
            {description}
          </div>
        </div>
      </div>

      {(progress || pct !== null) && (
        <div className="relative mt-5 flex items-center gap-3">
          {pct !== null && (
            <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
              <div
                className={`h-full ${a.bar} rounded-full transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          )}
          {progress && (
            <span className="text-[11px] tabular-nums text-slate-500 font-medium shrink-0">
              {progress}
            </span>
          )}
          <ArrowRight
            size={14}
            className="text-slate-400 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0"
          />
        </div>
      )}
    </button>
  );
}
