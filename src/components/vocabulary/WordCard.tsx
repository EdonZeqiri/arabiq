import { useState } from 'react';
import { ChevronDown, Minus, Plus } from 'lucide-react';
import type { VocabWord } from '@/data/curriculum';
import { useStore } from '@/store/useStore';

const TYPE_STYLE: Record<VocabWord['type'], string> = {
  noun: 'bg-blue-50 text-blue-700 border-blue-200',
  verb: 'bg-green-50 text-green-700 border-green-200',
  particle: 'bg-purple-50 text-purple-700 border-purple-200',
  adjective: 'bg-amber-50 text-amber-700 border-amber-200',
};

const TYPE_LABEL: Record<VocabWord['type'], string> = {
  noun: 'Emër',
  verb: 'Folje',
  particle: 'Parafj.',
  adjective: 'Mbiemër',
};

interface WordCardProps {
  word: VocabWord;
  chapterLabel?: string;
}

export function WordCard({ word, chapterLabel }: WordCardProps) {
  const [open, setOpen] = useState(false);
  const mastery = useStore((s) => s.vocabularyMastery[word.id] ?? 0);
  const updateVocabMastery = useStore((s) => s.updateVocabMastery);

  return (
    <div className="card p-3 hover:shadow-lg transition">
      <div className="flex items-start gap-2 min-w-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span
              dir="rtl"
              className="font-amiri text-2xl text-slate-800 truncate"
            >
              {word.arabic}
            </span>
            <span
              className={`pill border text-[10px] shrink-0 ${TYPE_STYLE[word.type]}`}
              title={TYPE_LABEL[word.type]}
            >
              {TYPE_LABEL[word.type]}
            </span>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
            <span className="font-mono tracking-wider truncate" dir="rtl">
              {word.root}
            </span>
            {word.gender && (
              <span className="text-slate-400">· {word.gender}</span>
            )}
            {chapterLabel && (
              <span className="text-slate-400">· {chapterLabel}</span>
            )}
          </div>

          <div className="mt-1 text-sm font-medium text-slate-700 break-words">
            {word.albanian}
          </div>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="btn-ghost !p-1 shrink-0"
          aria-label="Zgjeroni"
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Mastery controls — segmented bar (0..5), no stars. Keeps the
          same 5-level granularity but reads as a clean progress chip. */}
      <div className="mt-3 flex items-center justify-between gap-2">
        <MasteryBar level={mastery} />
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => updateVocabMastery(word.id, mastery - 1)}
            disabled={mastery <= 0}
            className="btn-outline !px-2 !py-1"
            aria-label="Zvogëlo nivelin"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => updateVocabMastery(word.id, mastery + 1)}
            disabled={mastery >= 5}
            className="btn-primary !px-2 !py-1"
            aria-label="Rrit nivelin"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 space-y-1">
          {word.plural && (
            <div className="break-words">
              <span className="text-slate-400">Shumësi: </span>
              <span dir="rtl" className="font-amiri text-base text-slate-700">
                {word.plural}
              </span>
            </div>
          )}
          <div className="break-words">
            <span className="text-slate-400">Shembull: </span>
            <span dir="rtl" className="font-amiri text-base text-slate-700">
              {renderExample(word)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// 5-segment horizontal bar — fills from left as mastery grows. Each
// segment is narrow enough that the whole bar stays under 120px, which
// is safer on small screens than five separate icons.
function MasteryBar({ level }: { level: number }) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <div className="flex gap-[2px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 w-4 rounded-full ${
              i < level ? 'bg-emerald-500' : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium text-slate-500 tabular-nums">
        {level}/5
      </span>
    </div>
  );
}

function renderExample(word: VocabWord): string {
  switch (word.type) {
    case 'verb':
      return `هُوَ ${word.arabic}`;
    case 'adjective':
      return `الْوَلَدُ ${word.arabic}`;
    case 'particle':
      return word.arabic;
    default:
      return `هَذَا ${word.arabic}`;
  }
}
