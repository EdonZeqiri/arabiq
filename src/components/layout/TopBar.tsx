import { BookOpen, BookText, Flame, Search, Settings } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ChapterDropdown } from './ChapterDropdown';

// Top app bar — the only chrome that sits above the canvas now that
// the left sidebar has been retired. Layout from left to right:
//
//   [📖 Arabiq] · [Kap. dropdown]                   [🔥 streak]
//                                                   [🔍 search]
//                                                   [📚 fjalori] (mobile)
//                                                   [📘 gramatika]
//                                                   [⚙️ cilësimet]
//
// The dropdown replaces the always-visible chapter list — same reach,
// fraction of the screen real estate. Streak chip doubles as the
// entry point to the stats modal (we surface progress through
// settings to avoid yet another top-level surface).
//
// Mobile considerations: the brand label collapses to just the icon
// at <sm, the chapter dropdown trims its label to a numeric badge,
// and the action buttons hide their text labels — only icons remain.

interface TopBarProps {
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onOpenGrammar: () => void;
  onOpenVocab: () => void;
}

export function TopBar({
  onOpenSearch,
  onOpenSettings,
  onOpenGrammar,
  onOpenVocab,
}: TopBarProps) {
  const streakDays = useStore((s) => s.streakDays);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_2px_8px_-4px_rgba(15,23,42,0.06)] px-3 sm:px-4 py-2">
      {/* Brand */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 via-brand-600 to-emerald-600 text-white flex items-center justify-center shadow-md ring-1 ring-brand-700/20">
          <BookOpen size={17} />
          {/* tiny shine to lift the logo off the bar */}
          <span
            aria-hidden
            className="absolute inset-x-1.5 top-1 h-1 rounded-full bg-white/30 blur-[1px]"
          />
        </div>
        <div className="hidden sm:block leading-tight">
          <div className="text-sm font-bold tracking-tight bg-gradient-to-br from-slate-800 to-slate-600 bg-clip-text text-transparent">
            Arabiq
          </div>
          <div className="text-[10px] text-slate-500 -mt-0.5 tracking-wide">
            Bayna Yadayk · L1
          </div>
        </div>
      </div>

      <div className="h-7 w-px bg-gradient-to-b from-transparent via-slate-300 to-transparent hidden sm:block" />

      {/* Chapter dropdown — flexes so a long Albanian title can grow
          without bumping the action buttons off-screen. */}
      <div className="min-w-0 flex-1">
        <ChapterDropdown />
      </div>

      {/* Right-side actions. Each button shows label only on sm+ to
          keep the bar compact on phones. */}
      <div className="flex items-center gap-1 shrink-0">
        {streakDays > 0 && (
          <button
            onClick={onOpenSettings}
            className="inline-flex items-center gap-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2 py-1 text-amber-700 text-xs font-semibold transition-colors"
            title={`${streakDays} ditë rresht — kliko për detaje`}
          >
            <Flame size={13} />
            <span className="tabular-nums">{streakDays}</span>
          </button>
        )}

        <button
          onClick={onOpenSearch}
          className="btn-ghost !px-2 !py-1.5 text-slate-600"
          title="Kërko në fjalor (⌘K)"
          aria-label="Kërko"
        >
          <Search size={16} />
        </button>

        {/* Mobile-only: vocab drawer trigger. On lg: the right vocab
            panel is always visible, so this button's redundant. */}
        <button
          onClick={onOpenVocab}
          className="lg:hidden btn-ghost !px-2 !py-1.5 text-slate-600"
          title="Fjalori i kapitullit"
          aria-label="Fjalori i kapitullit"
        >
          <BookText size={16} />
        </button>

        <button
          onClick={onOpenGrammar}
          className="btn-ghost !px-2 !py-1.5 text-slate-600"
          title="Gramatika"
          aria-label="Gramatika"
        >
          <BookOpen size={16} />
        </button>

        <button
          onClick={onOpenSettings}
          className="btn-ghost !px-2 !py-1.5 text-slate-600"
          title="Cilësimet"
          aria-label="Cilësimet"
        >
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
