import { Eye, Check, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { Dialogue } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { PronunciationCheck } from './PronunciationCheck';
import { stripHarakat } from '@/lib/arabicText';

interface FlashcardProps {
  dialogue: Dialogue;
  revealed: boolean;
  onReveal: () => void;
  /** Called on voice-pass to advance + record session. */
  onKnown: () => void;
  /** Kept in props for API parity with PracticeArena, but no longer
      surfaced as a button now that voice is the mastery signal. */
  onRetry: () => void;
  index: number;
  total: number;
}

export function Flashcard({
  dialogue,
  revealed,
  onReveal,
  onKnown,
  index,
  total,
}: FlashcardProps) {
  const showHarakat = useStore((s) => s.showHarakat);
  const showTransliteration = useStore((s) => s.showTransliteration);
  const mastered = useStore((s) =>
    s.completedDialogues.includes(dialogue.id),
  );
  const markDialogueMastered = useStore((s) => s.markDialogueMastered);

  // Local latch: flips true once PronunciationCheck reports a pass on
  // THIS dialogue. Used to (a) auto-show the clean Arabic card even if
  // the student never tapped "Zbulo përgjigjen", and (b) collapse the
  // decision row into a single "Tjetri →", since voice-pass already
  // marks the dialogue learned.
  const [voicePassed, setVoicePassed] = useState(false);
  useEffect(() => {
    setVoicePassed(false);
  }, [dialogue.id]);

  const arabic = showHarakat ? dialogue.arabic : stripHarakat(dialogue.arabic);

  // The Arabic reference card appears either when the student taps
  // reveal, or when they pronounce the phrase well enough to pass —
  // at that point hiding it is pointless and confusing.
  const showArabicCard = revealed || voicePassed;

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

      {/* Step 2 — Speak + check.
          This replaces the old MediaRecorder playback widget. The
          student sees an immediate pass/fail verdict after speaking,
          matching the transform-exercise flow — "pas inqizimit ta di
          a e kam thene mire". The colored diff that appears on fail
          doubles as the reveal, so we don't need a second reveal step
          for voice-first learners. `expected` is always the vocalized
          form; harakat are stripped during comparison anyway, but the
          target text renders cleaner with them. */}
      <PronunciationCheck
        expected={dialogue.arabic}
        onPass={() => {
          markDialogueMastered(dialogue.id);
          setVoicePassed(true);
        }}
        resultLabel="Shqiptimi yt"
      />

      {/* Step 3 — Arabic reference, compact.
          Shown only after either the student taps the small reveal
          link, OR passes the voice check. Held smaller than the
          PronunciationCheck readout so it stays a reference, not the
          visual centerpiece — the voice drill is the main event now. */}
      {showArabicCard ? (
        <div className="rounded-lg border border-brand-100 bg-brand-50/70 px-4 py-4 text-center">
          <div className="text-[10px] uppercase tracking-wide text-brand-700/70 font-semibold mb-3">
            Përgjigjja
          </div>
          <p
            dir="rtl"
            className="font-amiri text-xl md:text-2xl leading-relaxed text-slate-900"
          >
            {arabic}
          </p>
          {showTransliteration && (
            <p className="text-xs italic text-brand-700">
              {dialogue.transliteration}
            </p>
          )}
        </div>
      ) : (
        // Text-link sized — voice-first, so the reveal is a fallback,
        // not a primary action.
        <button
          onClick={onReveal}
          className="mx-auto inline-flex items-center gap-1 text-xs text-slate-500 hover:text-brand-700 underline-offset-2 hover:underline"
        >
          <Eye size={12} /> Zbulo përgjigjen
        </button>
      )}

      {/* Step 4 — Advance, only after voice pass.
          Manual "E dita / Përsëri" buttons were removed: the mastery
          signal now comes entirely from the pronunciation check, and
          the bottom-strip chapter dots already provide navigation for
          users who just want to browse. */}
      {voicePassed && (
        <div className="flex justify-center">
          <button
            onClick={onKnown}
            className="btn bg-emerald-600 text-white hover:bg-emerald-700 px-5 py-2.5 focus:ring-emerald-500"
          >
            <Check size={16} /> Tjetri <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
