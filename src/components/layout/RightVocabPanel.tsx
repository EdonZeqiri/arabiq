import { useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Search, X } from 'lucide-react';
import type { VocabWord } from '@/data/curriculum';
import { getChapter } from '@/data/curriculum';
import { useStore } from '@/store/useStore';

// Right-side panel showing the active chapter's vocabulary, always
// in reach while the user works on dialogues / exercises / stories.
//
// Layout:
//   - Sticky header (chapter name, close/collapse buttons)
//   - Search input
//   - Type filter pills (with a sub-row for gender M/F when "Emra")
//   - Scrollable list of card-style rows
//
// Two surfaces share this component:
//   - <RightVocabPanel /> — collapsible sidebar visible from lg: and up
//   - <VocabDrawer />     — bottom-up sheet on mobile triggered by a FAB

const TYPE_LABEL: Record<VocabWord['type'], string> = {
  noun: 'Emër',
  verb: 'Folje',
  adjective: 'Mbiemër',
  particle: 'Pjesëz',
};

const TYPE_DOT: Record<VocabWord['type'], string> = {
  noun: 'bg-blue-400',
  verb: 'bg-emerald-400',
  adjective: 'bg-amber-400',
  particle: 'bg-slate-400',
};

const TYPE_ACCENT: Record<
  VocabWord['type'],
  { ring: string; soft: string }
> = {
  noun: { ring: 'border-l-blue-300', soft: 'bg-blue-50/40' },
  verb: { ring: 'border-l-emerald-300', soft: 'bg-emerald-50/40' },
  adjective: { ring: 'border-l-amber-300', soft: 'bg-amber-50/40' },
  particle: { ring: 'border-l-slate-300', soft: 'bg-slate-50/40' },
};

type Filter = 'all' | VocabWord['type'];
type GenderFilter = 'all' | 'M' | 'F';

function VocabRow({ word }: { word: VocabWord }) {
  const [open, setOpen] = useState(false);
  const accent = TYPE_ACCENT[word.type];
  return (
    <li
      className={`rounded-lg border border-slate-200/70 border-l-[3px] ${accent.ring} bg-white hover:border-slate-300 hover:shadow-sm transition-all overflow-hidden`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 text-left ${open ? accent.soft : 'hover:bg-slate-50/60'}`}
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span
            className={`shrink-0 w-1.5 h-1.5 rounded-full ${TYPE_DOT[word.type]}`}
          />
          <span
            dir="rtl"
            className="font-amiri text-lg text-slate-900 truncate leading-none"
          >
            {word.arabic}
          </span>
          {word.gender && (
            <span
              className={`shrink-0 inline-flex items-center justify-center text-[9px] font-bold w-4 h-4 rounded-full ${
                word.gender === 'M'
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
              title={word.gender === 'M' ? 'Mashkullor' : 'Femëror'}
              aria-label={word.gender === 'M' ? 'Mashkullor' : 'Femëror'}
            >
              {word.gender}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-600 truncate max-w-[40%] text-right">
          {word.albanian}
        </span>
      </button>
      {open && (
        <div className="px-3 pb-3 pt-0.5 text-[11px] text-slate-600 space-y-0.5 animate-[fadeIn_180ms_ease-out] motion-reduce:animate-none border-t border-slate-100">
          <div className="pt-2">
            <span className="text-slate-400">Lloji: </span>
            {TYPE_LABEL[word.type]}
            {word.gender ? ` (${word.gender === 'M' ? 'mashkullor' : 'femëror'})` : ''}
          </div>
          {word.root && (
            <div dir="rtl" className="font-amiri text-sm text-slate-700">
              <span className="text-slate-400 font-sans text-[11px] mr-1">
                Rrënja:{' '}
              </span>
              {word.root}
            </div>
          )}
          {word.plural && (
            <div dir="rtl" className="font-amiri text-sm text-slate-700">
              <span className="text-slate-400 font-sans text-[11px] mr-1">
                Shumësi:{' '}
              </span>
              {word.plural}
            </div>
          )}
          {word.present && (
            <div dir="rtl" className="font-amiri text-sm text-slate-700">
              <span className="text-slate-400 font-sans text-[11px] mr-1">
                E tashmja:{' '}
              </span>
              {word.present}
            </div>
          )}
          {word.imperative && (
            <div dir="rtl" className="font-amiri text-sm text-slate-700">
              <span className="text-slate-400 font-sans text-[11px] mr-1">
                Urdhërore:{' '}
              </span>
              {word.imperative}
            </div>
          )}
        </div>
      )}
    </li>
  );
}

function VocabPanelContent() {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const chapter = getChapter(currentChapterId);
  const words = chapter?.vocabulary ?? [];

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  // Sub-filter for nouns: split by gender. Hidden unless filter='noun'.
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return words.filter((w) => {
      if (filter !== 'all' && w.type !== filter) return false;
      if (filter === 'noun' && genderFilter !== 'all' && w.gender !== genderFilter)
        return false;
      if (!q) return true;
      return (
        w.arabic.toLowerCase().includes(q) ||
        w.albanian.toLowerCase().includes(q) ||
        w.root.toLowerCase().includes(q)
      );
    });
  }, [words, query, filter, genderFilter]);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: words.length,
      noun: 0,
      verb: 0,
      adjective: 0,
      particle: 0,
    };
    words.forEach((w) => (c[w.type] += 1));
    return c;
  }, [words]);

  const genderCounts = useMemo(() => {
    let m = 0;
    let f = 0;
    words.forEach((w) => {
      if (w.type !== 'noun') return;
      if (w.gender === 'M') m += 1;
      else if (w.gender === 'F') f += 1;
    });
    return { all: counts.noun, M: m, F: f };
  }, [words, counts.noun]);

  const FILTERS: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Të gjitha' },
    { key: 'noun', label: 'Emra' },
    { key: 'verb', label: 'Folje' },
    { key: 'adjective', label: 'Mbiemra' },
    { key: 'particle', label: 'Pjesëza' },
  ];

  const GENDERS: { key: GenderFilter; label: string }[] = [
    { key: 'all', label: 'M + F' },
    { key: 'M', label: 'Mashkullor' },
    { key: 'F', label: 'Femëror' },
  ];

  return (
    <>
      <div className="px-3 pt-3 pb-3 border-b border-slate-200/70 bg-white/60">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kërko fjalën..."
            className="w-full text-sm rounded-md border border-slate-200 bg-slate-50 focus:bg-white focus:border-brand-400 focus:ring-2 focus:ring-brand-100 outline-none pl-7 pr-2 py-1.5"
          />
        </div>
        {/* Tight filter row — short labels + count, smaller padding,
            less gap. Fits all 5 chips on two lines max even on the
            narrow lg rail (320px). */}
        <div className="mt-2 flex gap-1 flex-wrap">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <button
                key={f.key}
                onClick={() => {
                  setFilter(f.key);
                  // Reset gender sub-filter whenever the primary
                  // filter changes — avoids "no results" surprises.
                  if (f.key !== 'noun') setGenderFilter('all');
                }}
                className={`shrink-0 text-[10.5px] leading-none rounded-full px-2 py-1 border transition-all ${
                  active
                    ? 'bg-gradient-to-r from-brand-600 to-emerald-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-brand-200 hover:bg-brand-50/40'
                }`}
              >
                {f.label}
                <span
                  className={`ml-1 tabular-nums ${active ? 'text-white/80' : 'text-slate-400'}`}
                >
                  {counts[f.key]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Gender sub-filter — appears only when "Emra" is active.
            Visually distinct from the main category pills: rendered
            as a small segmented control (square-ish, joined edges,
            with an inline label). The shape difference signals
            "this is a refinement of the filter above", not another
            top-level category. */}
        {filter === 'noun' && (
          <div className="mt-2 flex items-center gap-2 animate-[fadeIn_180ms_ease-out] motion-reduce:animate-none">
            <span className="text-[9.5px] uppercase tracking-[0.14em] text-slate-400 font-semibold shrink-0">
              Gjinia
            </span>
            <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 shadow-inner">
              {GENDERS.map((g) => {
                const active = genderFilter === g.key;
                const activeTone =
                  g.key === 'M'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : g.key === 'F'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-700 text-white shadow-sm';
                return (
                  <button
                    key={g.key}
                    onClick={() => setGenderFilter(g.key)}
                    className={`text-[10px] leading-none rounded px-2 py-1 font-semibold transition-all ${
                      active
                        ? activeTone
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                    }`}
                  >
                    {g.label}
                    <span
                      className={`ml-1 tabular-nums font-normal ${active ? 'opacity-80' : 'opacity-50'}`}
                    >
                      {genderCounts[g.key]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Top padding gives the first row breathing space below the
          sticky filter bar; horizontal padding holds the card-style
          rows off the panel edges. `space-y-1.5` is the gap between
          rows that solves the "kapur" feeling — words now read as
          discrete cards, not a wall of text. */}
      <ul className="flex-1 overflow-y-auto scroll-thin px-2 pt-2 pb-3 space-y-1.5">
        {filtered.length === 0 ? (
          <li className="p-4 text-center text-xs text-slate-500">
            S'u gjet asnjë fjalë.
          </li>
        ) : (
          filtered.map((w) => <VocabRow key={w.id} word={w} />)
        )}
      </ul>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Header used by both the desktop rail and the mobile drawer.
// Title is dynamic per chapter so the user always knows whose words
// they're looking at.
// ─────────────────────────────────────────────────────────────────────

function VocabHeader({
  chapterId,
  chapterTitleAl,
  rightSlot,
}: {
  chapterId: number;
  chapterTitleAl: string;
  rightSlot?: React.ReactNode;
}) {
  // Single-row header: brand-colored "Fjalori · K{n}" pill on the
  // left, chapter title (truncated) flowing to the right, action
  // button at the far right. Three lines collapsed into one — the
  // eyebrow label and "Kapitulli" word are baked into the pill so we
  // don't waste a whole row on chrome.
  return (
    <div className="relative px-3 py-2 border-b border-slate-200/70 bg-white/60 flex items-center gap-2">
      <span className="shrink-0 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.12em] font-bold bg-brand-50 text-brand-700 border border-brand-100 rounded-full px-2 py-0.5">
        <span className="inline-block w-1 h-1 rounded-full bg-brand-500" />
        Fjalori · K{chapterId}
      </span>
      <span
        className="text-[12px] text-slate-600 font-medium truncate min-w-0 flex-1"
        title={chapterTitleAl}
      >
        {chapterTitleAl}
      </span>
      {rightSlot}
      <span
        aria-hidden
        className="absolute left-3 right-3 -bottom-px h-px gold-rule"
      />
    </div>
  );
}

/** Desktop right-rail variant. Collapsible: when closed, shrinks to a
 *  thin 44px rail with a vertical "Fjalori" label and an expand
 *  chevron. The main canvas re-centers naturally because flex grants
 *  the freed-up width back to the canvas. */
export function RightVocabPanel({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const chapter = getChapter(currentChapterId);

  // Collapsed rail — narrow, click anywhere to expand. The vertical
  // "Fjalori" label uses writing-mode so it reads bottom-to-top, which
  // is the convention readers expect on left-of-page tabs.
  if (!open) {
    return (
      <aside className="hidden lg:flex flex-col w-11 shrink-0 border-l border-slate-200/70 bg-gradient-to-b from-paper-100/80 to-paper-50/60">
        <button
          onClick={onToggle}
          aria-label="Hap fjalorin"
          title="Hap fjalorin"
          className="group flex-1 w-full flex flex-col items-center justify-start gap-3 pt-3 hover:bg-white/50 transition-colors"
        >
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-600 group-hover:border-brand-300 group-hover:text-brand-700 shadow-sm transition-colors">
            <ChevronLeft size={14} />
          </span>
          <span
            className="text-[11px] uppercase tracking-[0.22em] text-brand-700 font-semibold"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            Fjalori · Kap. {currentChapterId}
          </span>
        </button>
      </aside>
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-[320px] shrink-0 border-l border-slate-200/70 bg-gradient-to-b from-paper-100/80 to-paper-50/60 backdrop-blur-sm">
      <VocabHeader
        chapterId={currentChapterId}
        chapterTitleAl={chapter?.titleAl ?? 'kapitullit aktiv'}
        rightSlot={
          <button
            onClick={onToggle}
            aria-label="Mbylle fjalorin"
            title="Mbylle"
            className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-brand-700 hover:border-brand-300 shadow-sm transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        }
      />
      <VocabPanelContent />
    </aside>
  );
}

/** Mobile drawer variant. Slides up from the right edge. */
export function VocabDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const chapter = getChapter(currentChapterId);

  return (
    <div
      className={`lg:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <button
        aria-label="Mbylle fjalorin"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />
      <aside
        role="dialog"
        aria-label="Fjalori i kapitullit"
        className={`absolute right-0 top-0 h-full w-[88%] max-w-[360px] bg-paper-50 border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <VocabHeader
          chapterId={currentChapterId}
          chapterTitleAl={chapter?.titleAl ?? 'kapitullit aktiv'}
          rightSlot={
            <button
              onClick={onClose}
              className="shrink-0 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-700 shadow-sm"
              aria-label="Mbyll"
            >
              <X size={14} />
            </button>
          }
        />
        <VocabPanelContent />
      </aside>
    </div>
  );
}
