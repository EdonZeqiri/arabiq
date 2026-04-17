import { useMemo, useState } from 'react';
import type { VocabWord } from '@/data/curriculum';

/**
 * Chapter-level vocabulary viewer rendered inside the Practice arena.
 *
 * Words are grouped into 4 buckets (Emra / Folje / Mbiemra / Parafjalë)
 * and rendered as compact cards:
 *   - Nouns: Arabic + plural (if present) + gender pill + root
 *   - Verbs: Madi form + a simple "هُوَ X" usage example + root
 *   - Adjectives / Particles: Arabic + Albanian + root
 *
 * A segmented filter bar lets the reader quickly jump to a bucket.
 * Kept intentionally simple — no mastery tracking here, that lives in
 * the global VocabVault page. The goal of this view is "everything I
 * need to know for this chapter, before I start the flashcards."
 */

type Bucket = 'all' | VocabWord['type'];

const BUCKETS: { key: Bucket; label: string; icon: string }[] = [
  { key: 'all', label: 'Të gjitha', icon: '⋯' },
  { key: 'noun', label: 'Emra', icon: 'اسم' },
  { key: 'verb', label: 'Folje', icon: 'فعل' },
  { key: 'adjective', label: 'Mbiemra', icon: 'صفة' },
  { key: 'particle', label: 'Parafjalë & shprehje', icon: 'حرف' },
];

const TYPE_BADGE: Record<VocabWord['type'], string> = {
  noun: 'bg-blue-50 text-blue-700 border-blue-200',
  verb: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  adjective: 'bg-amber-50 text-amber-700 border-amber-200',
  particle: 'bg-purple-50 text-purple-700 border-purple-200',
};

const TYPE_LABEL: Record<VocabWord['type'], string> = {
  noun: 'Emër',
  verb: 'Folje',
  adjective: 'Mbiemër',
  particle: 'Parafjalë',
};

interface ChapterVocabularyProps {
  words: VocabWord[];
}

export function ChapterVocabulary({ words }: ChapterVocabularyProps) {
  const [bucket, setBucket] = useState<Bucket>('all');

  const counts = useMemo(() => {
    const base: Record<Bucket, number> = {
      all: words.length,
      noun: 0,
      verb: 0,
      adjective: 0,
      particle: 0,
    };
    for (const w of words) base[w.type]++;
    return base;
  }, [words]);

  const filtered = useMemo(
    () => (bucket === 'all' ? words : words.filter((w) => w.type === bucket)),
    [words, bucket],
  );

  // Order within a bucket: keep curriculum order (it already tells a story:
  // core nouns first, then verbs, etc.). But when showing "all", we group
  // by bucket so the reader sees the structure at a glance.
  const grouped = useMemo(() => {
    if (bucket !== 'all') return [{ type: bucket as VocabWord['type'], items: filtered }];
    const order: VocabWord['type'][] = ['noun', 'verb', 'adjective', 'particle'];
    return order
      .map((t) => ({ type: t, items: words.filter((w) => w.type === t) }))
      .filter((g) => g.items.length > 0);
  }, [words, filtered, bucket]);

  return (
    <div className="p-5 space-y-4">
      {/* Filter bar */}
      <div className="flex flex-wrap items-center gap-1.5">
        {BUCKETS.map((b) => {
          const active = bucket === b.key;
          const count = counts[b.key];
          if (count === 0) return null;
          return (
            <button
              key={b.key}
              onClick={() => setBucket(b.key)}
              className={`pill border transition-colors flex items-center gap-1.5 ${
                active
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="font-medium">{b.label}</span>
              <span
                className={`inline-flex min-w-[1.25rem] justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                  active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grouped word grids */}
      <div className="space-y-5">
        {grouped.map((group) => (
          <section key={group.type}>
            {bucket === 'all' && (
              <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wide text-slate-400 font-semibold">
                <span>{TYPE_LABEL[group.type]}</span>
                <span className="h-px flex-1 bg-slate-200" />
                <span className="text-slate-400 normal-case tracking-normal">
                  {group.items.length}
                </span>
              </div>
            )}
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {group.items.map((w) => (
                <VocabTile key={w.id} word={w} />
              ))}
            </ul>
          </section>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-sm text-slate-500 text-center py-6">
          Nuk ka fjalë në këtë kategori.
        </div>
      )}
    </div>
  );
}

// ─── Single word tile ─────────────────────────────────────────────────

function VocabTile({ word }: { word: VocabWord }) {
  return (
    <li className="rounded-xl border border-slate-200 bg-white p-3 hover:border-brand-300 hover:shadow-sm transition">
      {/* Top: Arabic + type pill */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div
            dir="rtl"
            className="font-amiri text-[22px] leading-snug text-slate-900"
          >
            {word.arabic}
          </div>
          <div className="mt-0.5 text-[13px] text-slate-700">
            {word.albanian}
          </div>
        </div>
        <span
          className={`pill border text-[10px] shrink-0 ${TYPE_BADGE[word.type]}`}
        >
          {TYPE_LABEL[word.type]}
          {word.gender && <span className="opacity-70 ml-1">{word.gender}</span>}
        </span>
      </div>

      {/* Details row */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
        {word.root && word.root !== '-' && (
          <span className="flex items-center gap-1">
            <span className="uppercase tracking-wide text-slate-400">Rrënja</span>
            <span dir="rtl" className="font-mono text-slate-600">
              {word.root}
            </span>
          </span>
        )}
        {word.plural && (
          <span className="flex items-center gap-1">
            <span className="uppercase tracking-wide text-slate-400">Sh.</span>
            <span dir="rtl" className="font-amiri text-[14px] text-slate-700">
              {word.plural}
            </span>
          </span>
        )}
        {word.type === 'verb' && (
          <span className="flex items-center gap-1">
            <span className="uppercase tracking-wide text-slate-400">Sh.p.</span>
            <span dir="rtl" className="font-amiri text-[14px] text-slate-700">
              هُوَ {word.arabic}
            </span>
          </span>
        )}
      </div>
    </li>
  );
}
