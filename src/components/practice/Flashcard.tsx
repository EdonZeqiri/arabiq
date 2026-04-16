import { Eye, Check, RotateCcw } from 'lucide-react';
import type { Dialogue } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { VoiceRecorder } from './VoiceRecorder';

interface FlashcardProps {
  dialogue: Dialogue;
  revealed: boolean;
  onReveal: () => void;
  onKnown: () => void;
  onRetry: () => void;
  index: number;
  total: number;
}

// Simple regex that strips Arabic vowel marks (harakat) for the "off" mode.
const stripHarakat = (s: string): string =>
  s.replace(/[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0670]/g, '');

export function Flashcard({
  dialogue,
  revealed,
  onReveal,
  onKnown,
  onRetry,
  index,
  total,
}: FlashcardProps) {
  const showHarakat = useStore((s) => s.showHarakat);
  const showTransliteration = useStore((s) => s.showTransliteration);
  const mastered = useStore((s) =>
    s.completedDialogues.includes(dialogue.id),
  );

  const arabic = showHarakat ? dialogue.arabic : stripHarakat(dialogue.arabic);

  return (
    <div className="card p-6 md:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>
          Dialog {index + 1} / {total}
        </span>
        {mastered && (
          <span className="pill bg-emerald-100 text-emerald-700">
            <Check size={10} /> I mësuar
          </span>
        )}
      </div>

      {/* Step 1 — Albanian prompt */}
      <div className="text-center">
        <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-2">
          Përkthe në arabisht
        </div>
        <p className="text-xl md:text-2xl font-semibold text-slate-800 leading-relaxed">
          {dialogue.albanian}
        </p>
      </div>

      {/* Step 2 — Voice recorder */}
      <VoiceRecorder />

      {/* Step 3/4 — Reveal */}
      {!revealed ? (
        <button onClick={onReveal} className="btn-outline mx-auto">
          <Eye size={16} /> Zbulo përgjigjen
        </button>
      ) : (
        <div className="rounded-xl border border-brand-100 bg-brand-50/70 p-5 text-center space-y-2">
          <p
            dir="rtl"
            className="font-amiri text-3xl md:text-4xl leading-loose text-slate-900"
          >
            {arabic}
          </p>
          {showTransliteration && (
            <p className="text-sm italic text-brand-700">
              {dialogue.transliteration}
            </p>
          )}
        </div>
      )}

      {/* Step 5/6 — Decision buttons */}
      {revealed && (
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={onKnown}
            className="btn bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2.5 focus:ring-emerald-500"
          >
            <Check size={16} /> E dita!
          </button>
          <button
            onClick={onRetry}
            className="btn bg-amber-500 text-white hover:bg-amber-600 px-5 py-2.5 focus:ring-amber-400"
          >
            <RotateCcw size={16} /> Përsëri
          </button>
        </div>
      )}
    </div>
  );
}
