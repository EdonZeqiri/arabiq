import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, RotateCcw, CheckCircle2, XCircle } from 'lucide-react';
import { computeDiff, DiffResult } from '@/lib/pronunciationDiff';

// Reusable "say this phrase in Arabic and I'll tell you where you
// stumbled" widget. Used under dialogue lines and story sentences.
// Shares the same Web Speech API plumbing as TransformExercise but with
// a word-level diff readout instead of a single correct/wrong verdict.
//
// We deliberately keep this as a self-contained leaf component so host
// cards (Flashcard, StoryCard) don't have to know about speech state.

// Web Speech API type shims — see TransformExercise.tsx for the long
// explanation. Replicated here to keep the component freestanding.
interface SR extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
interface SpeechRecognitionEventLike {
  results: {
    length: number;
    [i: number]: {
      isFinal: boolean;
      [i: number]: { transcript: string };
    };
  };
}

const getSR = (): (new () => SR) | null => {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

interface PronunciationCheckProps {
  /** The target phrase in Arabic (vocalized form preferred). */
  expected: string;
  /**
   * Optional compact mode — renders a tighter layout meant for lists
   * (e.g. under each dialogue line). Full mode is for standalone use.
   */
  compact?: boolean;
  /**
   * Fires once the learner hits an accuracy threshold (default 0.8).
   * Host components can use this to mark a dialogue / story as
   * "spoken correctly" in the store.
   */
  onPass?: () => void;
  /** Accuracy above which onPass fires. Default 0.8. */
  passThreshold?: number;
  /**
   * Label shown above the diff result. Defaults to "Shqiptimi yt".
   */
  resultLabel?: string;
}

export function PronunciationCheck({
  expected,
  compact = false,
  onPass,
  passThreshold = 0.8,
  resultLabel = 'Shqiptimi yt',
}: PronunciationCheckProps) {
  const [listening, setListening] = useState(false);
  const [heard, setHeard] = useState('');
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recRef = useRef<SR | null>(null);
  const passedRef = useRef(false);

  const SRCtor = getSR();
  const speechSupported = !!SRCtor;

  // Cleanup on unmount so a hot-reload doesn't strand the mic.
  useEffect(() => {
    return () => {
      recRef.current?.abort();
    };
  }, []);

  // When the target phrase changes, wipe previous state. Otherwise a
  // stale diff from the previous dialogue line would linger.
  useEffect(() => {
    setHeard('');
    setDiff(null);
    setError(null);
    passedRef.current = false;
    recRef.current?.abort();
    setListening(false);
  }, [expected]);

  const evaluate = (transcript: string) => {
    const result = computeDiff(expected, transcript);
    setDiff(result);
    if (!passedRef.current && result.accuracy >= passThreshold) {
      passedRef.current = true;
      onPass?.();
    }
  };

  const start = () => {
    if (!SRCtor) return;
    setError(null);
    setHeard('');
    setDiff(null);
    passedRef.current = false;

    const rec = new SRCtor();
    rec.lang = 'ar-SA';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => setListening(true);
    rec.onend = () => setListening(false);
    rec.onerror = (e) => {
      setListening(false);
      const msg =
        e.error === 'not-allowed' || e.error === 'service-not-allowed'
          ? 'Mikrofoni nuk u lejua. Kontrollo lejet e browser-it.'
          : e.error === 'no-speech'
            ? 'Nuk u dëgjua asnjë zë. Provo përsëri.'
            : e.error === 'language-not-supported'
              ? 'Arabishtja nuk suportohet nga ky browser.'
              : 'Gabim në njohjen e zërit. Provo përsëri.';
      setError(msg);
    };
    rec.onresult = (evt) => {
      let transcript = '';
      let isFinal = false;
      for (let i = 0; i < evt.results.length; i++) {
        transcript += evt.results[i][0].transcript;
        if (evt.results[i].isFinal) isFinal = true;
      }
      setHeard(transcript);
      if (isFinal) {
        evaluate(transcript);
      }
    };
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      // Safari can throw if a previous instance is still closing.
      setTimeout(() => {
        try {
          rec.start();
        } catch (err) {
          setListening(false);
          setError('Nuk u nis mikrofoni. Provo përsëri.');
          console.error(err);
        }
      }, 120);
    }
  };

  const stop = () => {
    recRef.current?.stop();
    setListening(false);
  };

  const reset = () => {
    recRef.current?.abort();
    setListening(false);
    setHeard('');
    setDiff(null);
    setError(null);
    passedRef.current = false;
  };

  // Nothing to render if the browser can't do STT — the host flashcard
  // / story still has its audio-record playback feature, which doesn't
  // rely on this. We silently degrade.
  if (!speechSupported) return null;

  const accuracyPct = diff ? Math.round(diff.accuracy * 100) : 0;
  const passed = diff && diff.accuracy >= passThreshold;

  return (
    <div
      className={`rounded-2xl border ${
        listening
          ? 'border-red-200 bg-gradient-to-br from-red-50/60 to-white'
          : passed
            ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white'
            : diff
              ? 'border-amber-200 bg-gradient-to-br from-amber-50/60 to-white'
              : 'border-slate-200 bg-gradient-to-br from-white to-slate-50'
      } ${compact ? 'p-3' : 'p-3 sm:p-4'} transition-colors`}
    >
      {/* Controls row — sized to match StoryCard's RecordButton so the
          mic affordance is visually identical across dialogue and story
          surfaces. */}
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={listening ? stop : start}
          title={listening ? 'Ndal regjistrimin' : 'Shqipto dhe kontrollo'}
          aria-label={
            listening ? 'Ndal regjistrimin' : 'Shqipto dhe kontrollo'
          }
          className={`relative shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full text-white transition-all active:scale-95 motion-reduce:active:scale-100
            ${
              listening
                ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-500/30'
                : 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 motion-reduce:hover:translate-y-0'
            }`}
        >
          {listening ? (
            <>
              <span className="absolute inset-0 rounded-full bg-red-400/50 animate-ping motion-reduce:hidden" />
              <Mic size={18} className="relative" />
            </>
          ) : (
            <>
              <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400/30 ring-offset-2 ring-offset-white" />
              <Mic size={18} className="relative" />
            </>
          )}
        </button>

        {/* Status text / mini equalizer */}
        {listening ? (
          <span className="inline-flex items-center gap-2 text-xs text-red-600 font-medium">
            <span
              aria-hidden="true"
              className="inline-flex items-end gap-[3px] h-4"
            >
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className="block w-[3px] rounded-full bg-red-500"
                  style={{
                    animation: `mic-equalizer 0.9s ease-in-out ${
                      i * 0.15
                    }s infinite`,
                    height: '6px',
                  }}
                />
              ))}
            </span>
            Po dëgjoj…
          </span>
        ) : diff ? (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${
              passed ? 'text-emerald-700' : 'text-amber-700'
            }`}
          >
            {passed ? (
              <>
                <CheckCircle2 size={14} /> {accuracyPct}% saktë
              </>
            ) : (
              <>
                <XCircle size={14} /> {accuracyPct}% — provo përsëri
              </>
            )}
          </span>
        ) : (
          <span className="text-xs text-slate-500">
            Shtyp <MicOff size={10} className="inline -mt-0.5" /> dhe shqipto
            frazën me zë.
          </span>
        )}

        {(diff || heard) && !listening && (
          <button
            type="button"
            onClick={reset}
            className="ml-auto text-[11px] text-slate-500 hover:text-slate-700 inline-flex items-center gap-1"
            title="Rifillo"
          >
            <RotateCcw size={11} /> Rifillo
          </button>
        )}
      </div>

      {/* Live transcript while listening — gives immediate feedback that
          the mic is actually capturing something. */}
      {listening && heard && (
        <div
          dir="rtl"
          className="mt-2 font-amiri text-lg text-slate-700 leading-relaxed"
        >
          {heard}
        </div>
      )}

      {error && !listening && (
        <div className="mt-2 text-xs text-red-600">{error}</div>
      )}

      {/* Diff readout: expected phrase, word by word, colored by how
          the learner did. Green = matched, red = skipped, amber =
          substituted (with the heard word in a small caret beneath). */}
      {diff && !listening && (
        <div className="mt-2">
          <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
            {resultLabel}
          </div>
          <div
            dir="rtl"
            className="font-amiri text-xl leading-loose flex flex-wrap gap-x-2 gap-y-1 justify-end"
          >
            {diff.tokens.map((tok, i) => {
              const base = 'inline-flex flex-col items-center';
              if (tok.status === 'correct') {
                return (
                  <span
                    key={i}
                    className={`${base} text-emerald-700`}
                    title="Saktë"
                  >
                    <span>{tok.display}</span>
                  </span>
                );
              }
              if (tok.status === 'missing') {
                return (
                  <span
                    key={i}
                    className={`${base} text-red-600 line-through decoration-red-400/70`}
                    title="Kjo fjalë nuk u dëgjua"
                  >
                    <span>{tok.display}</span>
                  </span>
                );
              }
              // substituted
              return (
                <span
                  key={i}
                  className={`${base} text-amber-700`}
                  title={`Dëgjuar: ${tok.heard}`}
                >
                  <span>{tok.display}</span>
                  {tok.heard && (
                    <span className="text-[10px] font-sans text-amber-600 leading-none mt-0.5">
                      ↑ {tok.heard}
                    </span>
                  )}
                </span>
              );
            })}
          </div>

          {/* Extras — words the learner said that had no target slot. */}
          {diff.extras.length > 0 && (
            <div className="mt-2 text-[11px] text-slate-500">
              Fjalë shtesë të dëgjuara:{' '}
              <span dir="rtl" className="font-amiri text-base text-slate-600">
                {diff.extras.join(' ، ')}
              </span>
            </div>
          )}

          {/* Legend — compact, only shown once there's a diff so we
              don't clutter the idle state. */}
          {!compact && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
                saktë
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                ndryshe
              </span>
              <span className="inline-flex items-center gap-1">
                <span className="inline-block h-2 w-2 rounded-full bg-red-500" />
                harruar
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
