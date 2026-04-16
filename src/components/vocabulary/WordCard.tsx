import { useState } from 'react';
import { ChevronDown, Minus, Plus, Star } from 'lucide-react';
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
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline justify-between gap-2">
            <span dir="rtl" className="font-amiri text-2xl text-slate-800">
              {word.arabic}
            </span>
            <span
              className={`pill border ${TYPE_STYLE[word.type]}`}
              title={TYPE_LABEL[word.type]}
            >
              {TYPE_LABEL[word.type]}
            </span>
          </div>

          <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono tracking-wider" dir="rtl">
              {word.root}
            </span>
            {word.gender && (
              <span className="text-slate-400">· {word.gender}</span>
            )}
            {chapterLabel && (
              <span className="text-slate-400">· {chapterLabel}</span>
            )}
          </div>

          <div className="mt-1 text-sm font-medium text-slate-700">
            {word.albanian}
          </div>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="btn-ghost !p-1"
          aria-label="Zgjeroni"
        >
          <ChevronDown
            size={16}
            className={`transition-transform ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Mastery controls */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={
                i < mastery
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300'
              }
            />
          ))}
          <span className="ml-1.5 text-xs text-slate-500">{mastery}/5</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateVocabMastery(word.id, mastery - 1)}
            disabled={mastery <= 0}
            className="btn-outline !px-2 !py-1"
          >
            <Minus size={12} />
          </button>
          <button
            onClick={() => updateVocabMastery(word.id, mastery + 1)}
            disabled={mastery >= 5}
            className="btn-primary !px-2 !py-1"
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 space-y-1">
          {word.plural && (
            <div>
              <span className="text-slate-400">Shumësi: </span>
              <span dir="rtl" className="font-amiri text-base text-slate-700">
                {word.plural}
              </span>
            </div>
          )}
          <div>
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
