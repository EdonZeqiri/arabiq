import { useMemo } from 'react';
import { BookMarked, Flame, Sparkles } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { maturityStats } from '@/lib/srs';

// A slim 3-stat strip shown above the chapter hub. The goal is to
// answer the *first* question the learner has every time they open
// the app: "where am I, am I keeping up?". Three dials chosen to be
// independent — none derives from the others — so each one shifts
// only when it should:
//
//   - Ditë rresht (streak)        → consistency tracker
//   - Karta të zotëruara (mature) → long-term progress (SRS interval ≥21d)
//   - Fjalë në studim (in-flight) → today's "live load"
//
// The component is intentionally low-chrome: a single rounded panel
// with three columns separated by faint dividers. It's a status
// readout, not a hero — anything fancier and it competes with the
// chapter title above it.

export function StatsStrip() {
  const streakDays = useStore((s) => s.streakDays);
  const srs = useStore((s) => s.srs);

  const stats = useMemo(() => maturityStats(srs), [srs]);

  return (
    <div className="rounded-xl border border-slate-200/70 bg-white/70 backdrop-blur-sm shadow-soft px-3 py-2.5 sm:px-4 sm:py-3">
      <div className="grid grid-cols-3 divide-x divide-slate-200/70">
        <Stat
          icon={<Flame size={16} className="text-amber-500" />}
          label="Ditë rresht"
          value={streakDays}
          accent="text-amber-700"
        />
        <Stat
          icon={<BookMarked size={16} className="text-emerald-600" />}
          label="Të zotëruara"
          value={stats.mature}
          accent="text-emerald-700"
          // Helpful caption only when there's something to brag about
          // — empty state would just clutter the strip.
          sub={
            stats.total > 0
              ? `${Math.round((stats.mature / stats.total) * 100)}%`
              : undefined
          }
        />
        <Stat
          icon={<Sparkles size={16} className="text-brand-500" />}
          label="Në studim"
          value={stats.young + stats.learning}
          accent="text-brand-700"
        />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="px-2 sm:px-3 first:pl-0 last:pr-0 flex flex-col items-center gap-0.5 text-center">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-slate-500 font-medium">
        {icon}
        <span>{label}</span>
      </div>
      <div className={`text-xl sm:text-2xl font-semibold tabular-nums ${accent}`}>
        {value}
        {sub && (
          <span className="ml-1 text-xs text-slate-400 font-normal">
            · {sub}
          </span>
        )}
      </div>
    </div>
  );
}
