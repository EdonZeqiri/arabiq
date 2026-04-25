import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { CHAPTERS } from '@/data/curriculum';
import { useStore } from '@/store/useStore';

// Compact dropdown for picking the active chapter. Replaces the
// always-visible left sidebar list — with 16 chapters that list was
// dominating the layout, especially on mobile. A dropdown gives the
// same reach with a fraction of the chrome, and the menu can show
// progress per chapter on the same row.
//
// Computes per-chapter progress on the fly (intersection of the
// chapter's dialogue/exercise IDs with the global completed-* lists)
// so users can see at a glance which chapters they've finished.

export function ChapterDropdown() {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const setChapter = useStore((s) => s.setChapter);
  const completedDialogues = useStore((s) => s.completedDialogues);
  const completedExercises = useStore((s) => s.completedExercises);

  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click + Escape so the menu doesn't get "stuck"
  // open when a user starts another action.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = CHAPTERS.find((c) => c.id === currentChapterId);

  return (
    <div ref={wrapRef} className="relative min-w-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-2.5 py-1.5 text-sm transition-colors min-w-0 max-w-full"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-[11px] uppercase tracking-wide text-brand-600 font-semibold shrink-0">
          Kap. {current?.id ?? '—'}
        </span>
        <span className="font-medium text-slate-800 truncate">
          {current?.titleAl ?? 'Zgjidh kapitullin'}
        </span>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute left-0 top-full mt-1 w-[min(92vw,360px)] max-h-[70vh] overflow-y-auto scroll-thin rounded-xl border border-slate-200 bg-white shadow-xl z-50 animate-[fadeSlideDown_180ms_ease-out] motion-reduce:animate-none"
        >
          {CHAPTERS.map((c) => {
            const total = c.dialogues.length + (c.exercises?.length ?? 0);
            const done =
              c.dialogues.filter((d) => completedDialogues.includes(d.id))
                .length +
              (c.exercises?.filter((e) => completedExercises.includes(e.id))
                .length ?? 0);
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            const active = c.id === currentChapterId;
            return (
              <button
                key={c.id}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setChapter(c.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-slate-50 ${active ? 'bg-brand-50' : ''}`}
              >
                <span
                  className={`shrink-0 w-7 h-7 rounded-full text-xs font-semibold inline-flex items-center justify-center ${
                    pct === 100
                      ? 'bg-emerald-500 text-white'
                      : active
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {pct === 100 ? <Check size={14} /> : c.id}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-slate-800 truncate">
                    {c.titleAl}
                  </div>
                  <div
                    dir="rtl"
                    className="font-amiri text-xs text-slate-500 truncate"
                  >
                    {c.titleAr}
                  </div>
                </div>
                <span className="shrink-0 text-[11px] tabular-nums text-slate-500">
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
