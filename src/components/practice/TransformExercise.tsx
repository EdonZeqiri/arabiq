import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeftRight,
  Check,
  CheckCircle2,
  Eye,
  Lightbulb,
  Mic,
  MicOff,
  RotateCcw,
  XCircle,
} from 'lucide-react';
import type { Exercise } from '@/data/curriculum';

// Strip Arabic diacritics so a student who types without harakat
// still gets credit — the rule being drilled is morphology, not
// vocalization. We compare on bare consonants.
const HARAKAT = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0670]/g;
// iOS Arabic keyboards and the Web Speech API frequently inject
// invisible bidi/joiner characters that sabotage a literal string
// compare. Scrub them before anything else. U+0640 (tatweel) is the
// elongation kashida — a cosmetic stretch that also must go.
const INVISIBLES =
  /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF\u061C\u0640]/g;
// Also fold common variants of alif so "أ", "إ", "آ" all match "ا".
// The learner shouldn't lose a point because they forgot the hamza
// seat in a transformation drill.
const normalize = (s: string): string =>
  s
    .replace(INVISIBLES, '')
    .replace(HARAKAT, '')
    .replace(/[\u0623\u0625\u0622]/g, '\u0627') // أ إ آ → ا
    .replace(/\u0649/g, '\u064A') // ى → ي
    .replace(/\u0629/g, '\u0647') // ة → ه (tie marbuta often typed as ha)
    .replace(/[\s\u00A0.،,!؟?]/g, '')
    .trim();

type Status = 'idle' | 'correct' | 'wrong' | 'revealed';

// ── Web Speech API glue ──────────────────────────────────────────────
// Not all browsers ship this: Chrome/Edge desktop + Chrome on Android
// work well; Firefox does not; Safari varies. We feature-detect and
// hide the mic button entirely if unsupported, so the typing flow is
// never degraded. Type shims below — the API is prefixed on WebKit and
// not yet in lib.dom, so we cast through `any` at the boundary.
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

interface TransformExerciseProps {
  exercise: Exercise;
  index: number;
  total: number;
  onNext: () => void;
  onPrev: () => void;
}

export function TransformExercise({
  exercise,
  index,
  total,
  onNext,
  onPrev,
}: TransformExerciseProps) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [showHint, setShowHint] = useState(false);
  const [listening, setListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recRef = useRef<SR | null>(null);

  const SRCtor = getSR();
  const speechSupported = !!SRCtor;

  // Reset the local state every time the parent hands us a new
  // exercise. Without this the previous answer + status bleed over.
  useEffect(() => {
    setValue('');
    setStatus('idle');
    setShowHint(false);
    setSpeechError(null);
    // Abort any in-flight recognition when exercise changes — otherwise
    // a late result would populate the new exercise with old speech.
    recRef.current?.abort();
    setListening(false);
    // Autofocus on desktop; on mobile this would pop the keyboard
    // unexpectedly, so we gate on pointer-fine.
    if (window.matchMedia('(pointer: fine)').matches) {
      inputRef.current?.focus();
    }
  }, [exercise.id]);

  // Clean up on unmount — important because otherwise a hot-reload
  // leaves a zombie SpeechRecognition holding the mic.
  useEffect(() => {
    return () => {
      recRef.current?.abort();
    };
  }, []);

  const check = (override?: string) => {
    const candidate = override ?? value;
    if (!candidate.trim()) return;
    if (normalize(candidate) === normalize(exercise.answer)) {
      setStatus('correct');
    } else {
      setStatus('wrong');
    }
  };

  const reveal = () => {
    setValue(exercise.answer);
    setStatus('revealed');
  };

  const reset = () => {
    setValue('');
    setStatus('idle');
    setShowHint(false);
    setSpeechError(null);
    inputRef.current?.focus();
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (status === 'idle' || status === 'wrong') check();
      else onNext();
    }
  };

  // ── Voice input ────────────────────────────────────────────────────
  // We write the live transcript straight into `value` as the API
  // streams interim results, so the student sees what is being heard.
  // When the final result arrives we auto-check — this removes the
  // "speak, then tap Kontrollo" friction that would break the flow.
  const startListening = () => {
    if (!SRCtor) return;
    setSpeechError(null);
    setValue('');
    setStatus('idle');
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
      setSpeechError(msg);
    };
    rec.onresult = (evt) => {
      // Gather the latest transcript — interim or final — and reflect
      // it live in the input. On final, run the check immediately.
      let transcript = '';
      let isFinal = false;
      for (let i = 0; i < evt.results.length; i++) {
        transcript += evt.results[i][0].transcript;
        if (evt.results[i].isFinal) isFinal = true;
      }
      setValue(transcript);
      if (isFinal) {
        check(transcript);
      }
    };
    recRef.current = rec;
    try {
      rec.start();
    } catch {
      // Safari sometimes throws if start() is called while a previous
      // instance is still winding down — silent retry after a tick.
      setTimeout(() => {
        try {
          rec.start();
        } catch (err) {
          setListening(false);
          setSpeechError('Nuk u nis mikrofoni. Provo përsëri.');
          console.error(err);
        }
      }, 120);
    }
  };

  const stopListening = () => {
    recRef.current?.stop();
    setListening(false);
  };

  return (
    <div className="space-y-4">
      {/* Meta strip: index + grammar point tag */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">
          Ushtrim {index + 1} / {total}
        </span>
        <span className="pill border border-indigo-200 bg-indigo-50 text-indigo-700">
          <ArrowLeftRight size={11} />
          {exercise.grammarPoint}
        </span>
      </div>

      {/* Prompt */}
      <div>
        <div className="text-[11px] uppercase tracking-wide text-slate-400 mb-1">
          Detyra
        </div>
        <p className="text-sm font-medium text-slate-800">{exercise.prompt}</p>
      </div>

      {/* Source sentence — this is what gets transformed */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
        <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
          Burim
        </div>
        <div
          dir="rtl"
          className="font-amiri text-2xl text-slate-900 leading-relaxed"
        >
          {exercise.source.arabic}
        </div>
        {exercise.source.albanian && (
          <div className="text-xs text-slate-500 mt-0.5">
            {exercise.source.albanian}
          </div>
        )}
      </div>

      {/* Input */}
      <div>
        <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1 flex items-center justify-between">
          <span>Përgjigjja jote (arabisht)</span>
          {speechSupported && (
            <span className="text-[10px] text-slate-400 normal-case tracking-normal">
              Shkruaj ose shtyp{' '}
              <Mic size={10} className="inline -mt-0.5" /> për të folur
            </span>
          )}
        </div>
        <div className="relative">
          <input
            ref={inputRef}
            dir="rtl"
            lang="ar"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (status === 'wrong' || status === 'correct') setStatus('idle');
            }}
            onKeyDown={handleKey}
            placeholder={listening ? '' : 'اكتب هنا…'}
            className={`w-full font-amiri text-2xl text-right rounded-xl border py-3 outline-none transition
              ${speechSupported ? 'pr-4 pl-14' : 'px-4'}
              ${
                listening
                  ? 'border-red-300 bg-red-50/40 ring-2 ring-red-200'
                  : status === 'correct'
                    ? 'border-emerald-400 bg-emerald-50/40 ring-2 ring-emerald-200'
                    : status === 'wrong'
                      ? 'border-red-300 bg-red-50/40 ring-2 ring-red-200'
                      : status === 'revealed'
                        ? 'border-amber-300 bg-amber-50/40'
                        : 'border-slate-200 focus:border-brand-400 focus:ring-2 focus:ring-brand-200'
              }`}
          />

          {/* Mic button — positioned inside the input on the LTR side
              (left in RTL text), so it doesn't collide with the text. */}
          {speechSupported && (
            <button
              type="button"
              onClick={listening ? stopListening : startListening}
              title={listening ? 'Ndal regjistrimin' : 'Fol në arabisht'}
              aria-label={listening ? 'Ndal regjistrimin' : 'Fol në arabisht'}
              className={`absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full flex items-center justify-center transition
                ${
                  listening
                    ? 'bg-red-500 text-white shadow-md hover:bg-red-600'
                    : 'bg-slate-100 text-slate-600 hover:bg-brand-100 hover:text-brand-700'
                }`}
            >
              {listening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          )}

          {/* Equalizer overlay — shown while listening and the input
              is still empty. Sits on the right side of the RTL input
              so it occupies the same spot where text will start to
              appear; as soon as transcript bytes arrive, we hide it
              so the letters take over without visual fight. */}
          {listening && !value && (
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-4 flex items-center gap-[3px] pointer-events-none"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="block w-[3px] rounded-full bg-red-500/80"
                  style={{
                    animation: `mic-equalizer 0.9s ease-in-out ${
                      i * 0.12
                    }s infinite`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Feedback / hint row */}
        <div className="mt-2 min-h-[1.25rem] flex items-center gap-2 text-xs">
          {listening && (
            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              Po dëgjoj… shqipto në arabisht.
            </span>
          )}
          {!listening && speechError && (
            <span className="inline-flex items-center gap-1 text-red-600">
              <XCircle size={14} /> {speechError}
            </span>
          )}
          {!listening && !speechError && status === 'correct' && (
            <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 size={14} /> Saktë! Shtyp Enter për të vazhduar.
            </span>
          )}
          {!listening && !speechError && status === 'wrong' && (
            <span className="inline-flex items-center gap-1 text-red-600 font-medium">
              <XCircle size={14} /> Jo mjaftueshëm — provo përsëri ose shih
              udhëzimin.
            </span>
          )}
          {!listening && !speechError && status === 'revealed' && (
            <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
              <Eye size={14} /> Përgjigjja u shfaq.
            </span>
          )}
        </div>

        {/* Expected-answer reference: shown when the student is wrong
            so they can compare harakat-for-harakat. The normalize()
            comparator is forgiving, but the DISPLAY here is faithful,
            which is what the student needs to actually learn the
            vocalization. */}
        {status === 'wrong' && (
          <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
            <div className="text-[10px] uppercase tracking-wide text-slate-400 mb-1">
              Përgjigjja e pritur
            </div>
            <div
              dir="rtl"
              className="font-amiri text-xl text-slate-800 leading-relaxed"
            >
              {exercise.answer}
            </div>
          </div>
        )}
      </div>

      {/* Hint */}
      {exercise.hint && showHint && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
          <Lightbulb size={14} className="mt-0.5 shrink-0" />
          <span>{exercise.hint}</span>
        </div>
      )}

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-2">
        {status === 'idle' || status === 'wrong' ? (
          <button
            onClick={() => check()}
            disabled={!value.trim() || listening}
            className="btn-primary"
          >
            <Check size={16} /> Kontrollo
          </button>
        ) : (
          <button onClick={onNext} className="btn-primary">
            Tjetri
          </button>
        )}

        {exercise.hint && !showHint && status !== 'revealed' && (
          <button
            onClick={() => setShowHint(true)}
            className="btn-outline"
            title="Shfaq udhëzimin"
          >
            <Lightbulb size={14} /> Udhëzim
          </button>
        )}

        {status !== 'revealed' && status !== 'correct' && (
          <button
            onClick={reveal}
            className="btn-ghost text-slate-500"
            title="Shfaq përgjigjen e plotë"
          >
            <Eye size={14} /> Shih përgjigjen
          </button>
        )}

        {(status === 'correct' ||
          status === 'wrong' ||
          status === 'revealed') && (
          <button onClick={reset} className="btn-ghost text-slate-500">
            <RotateCcw size={14} /> Rifillo
          </button>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onPrev}
            className="btn-ghost !px-2 !py-1 text-xs text-slate-500"
          >
            ← Para
          </button>
          <button
            onClick={onNext}
            className="btn-ghost !px-2 !py-1 text-xs text-slate-500"
          >
            Kalo →
          </button>
        </div>
      </div>
    </div>
  );
}
