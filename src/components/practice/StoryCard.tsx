import {
  AlertCircle,
  Eye,
  EyeOff,
  Mic,
  RotateCcw,
  Shuffle,
  Square,
  Trash2,
} from 'lucide-react';
import type { Story } from '@/data/curriculum';
import { useVoiceRecorder, type Take } from '@/hooks/useVoiceRecorder';
import { useEffect, useMemo, useRef, useState } from 'react';
import { stripHarakat } from '@/lib/arabicText';
import { track } from '@/lib/analytics';

interface StoryCardProps {
  story: Story;
  showHarakat: boolean;
}

/**
 * A single chapter story rendered for self-practice.
 *
 * Flow:
 *   1. User reads the Albanian translation.
 *   2. Records themselves saying it in Arabic (MediaRecorder).
 *   3. Reveals the Arabic text and plays back their recording to
 *      compare pronunciation + word order.
 *
 * The Arabic paragraph is hidden by default so the user is forced to
 * attempt the translation before peeking at the model text.
 */
export function StoryCard({ story, showHarakat }: StoryCardProps) {
  const [revealed, setRevealed] = useState(false);
  const {
    isRecording,
    takes,
    error,
    startRecording,
    stopRecording,
    removeTake,
    clearRecording,
  } = useVoiceRecorder();
  const hasTakes = takes.length > 0;

  // Two display models live here, both behind the same `active` value:
  //
  //   1. New (preferred) — `story.feminine` is set: we show a [♂ M ↔ F ♀]
  //      segmented toggle. Each tap is a *gender flip* of the same scene
  //      so the learner sees the ـة / pronoun pattern they just drilled.
  //
  //   2. Legacy — `story.variants` is set (no `feminine`): we keep the
  //      old "Variant N/M" cycle button so chapters not yet migrated
  //      still behave as before. Will be removed once every chapter
  //      is split into distinct M/F stories.
  const hasFeminine = !!story.feminine;
  const legacyPhrasings = useMemo(
    () =>
      hasFeminine
        ? null
        : [
            {
              albanian: story.albanian,
              arabic: story.arabic,
              transliteration: story.transliteration,
            },
            ...(story.variants ?? []),
          ],
    [story, hasFeminine],
  );

  const [gender, setGender] = useState<'M' | 'F'>('M');
  const [variantIndex, setVariantIndex] = useState(0);
  useEffect(() => {
    setGender('M');
    setVariantIndex(0);
  }, [story.id]);

  const active = hasFeminine
    ? gender === 'F' && story.feminine
      ? story.feminine
      : {
          albanian: story.albanian,
          arabic: story.arabic,
          transliteration: story.transliteration,
        }
    : (legacyPhrasings?.[variantIndex] ?? legacyPhrasings![0]);

  const reset = () => {
    setRevealed(false);
    clearRecording();
  };

  const flipGender = (g: 'M' | 'F') => {
    if (g === gender) return;
    setGender(g);
    track({
      name: 'story_variant_cycled',
      props: { story: story.id, variant: g === 'F' ? 1 : 0 },
    });
    setRevealed(false);
    clearRecording();
  };

  const cycleVariant = () => {
    if (!legacyPhrasings) return;
    setVariantIndex((i) => {
      const next = (i + 1) % legacyPhrasings.length;
      track({
        name: 'story_variant_cycled',
        props: { story: story.id, variant: next },
      });
      return next;
    });
    setRevealed(false);
    clearRecording();
  };

  return (
    <article className="p-5 space-y-4">
      <header className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase tracking-wide text-amber-600 font-semibold">
            Tregim
          </span>
          <h3 className="text-sm font-semibold text-slate-800">
            {story.titleAl}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          {hasFeminine ? (
            // Pronoun toggle — uses هُوَ / هِيَ themselves as the labels
            // instead of "M / F" symbols. The toggle becomes a tiny
            // grammar lesson in its own right: tap هِيَ and watch the
            // ـة endings sprout. Sky = هُوَ, rose = هِيَ, mirroring the
            // gender colors in the right vocab panel.
            <div
              className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-0.5 shadow-inner"
              role="group"
              aria-label="Ndërro përemrin e tregimit"
            >
              <button
                onClick={() => flipGender('M')}
                className={`leading-none rounded px-2.5 py-1 transition-all ${
                  gender === 'M'
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
                title="Mashkullor — هُوَ"
              >
                <span dir="rtl" className="font-amiri text-base">
                  هُوَ
                </span>
              </button>
              <button
                onClick={() => flipGender('F')}
                className={`leading-none rounded px-2.5 py-1 transition-all ${
                  gender === 'F'
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                }`}
                title="Femëror — هِيَ"
              >
                <span dir="rtl" className="font-amiri text-base">
                  هِيَ
                </span>
              </button>
            </div>
          ) : (
            legacyPhrasings &&
            legacyPhrasings.length > 1 && (
              <button
                onClick={cycleVariant}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] text-slate-600 hover:border-amber-300 hover:text-amber-700"
                title="Provo një formulim tjetër me të njëjtat fjalë"
              >
                <Shuffle size={11} /> Variant {variantIndex + 1}/
                {legacyPhrasings.length}
              </button>
            )
          )}
          {(revealed || hasTakes) && (
            <button
              onClick={reset}
              className="btn-ghost !px-2 !py-1 text-xs"
              title="Rifillo"
            >
              <RotateCcw size={14} /> Rifillo
            </button>
          )}
        </div>
      </header>

      {/* Albanian paragraph — always visible, this is the prompt */}
      <p className="text-[15px] text-slate-700 leading-relaxed bg-slate-50 border border-slate-100 rounded-lg p-4">
        {active.albanian}
      </p>

      {/* Voice recorder — fancier pill layout. The big mic is the clear
          action, hint text sits beside it, and each recording gets its
          own row below so a second take never eats the first one. */}
      <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-3 sm:p-4 space-y-3">
        <div className="flex items-center gap-3">
          <RecordButton
            isRecording={isRecording}
            onStart={() => {
              track({ name: 'voice_record_started', props: { context: 'story' } });
              startRecording();
            }}
            onStop={stopRecording}
          />
          <div className="text-xs text-slate-500 min-w-0 flex-1">
            {isRecording && (
              <span className="inline-flex items-center gap-2 text-red-600 font-medium">
                <LiveBars /> Duke regjistruar… shtyp për të ndaluar.
              </span>
            )}
            {!isRecording && !hasTakes &&
              'Përkthe tregimin me zë në arabisht, pastaj krahaso.'}
            {!isRecording && hasTakes && !revealed &&
              'Dëgjo provat tua, pastaj shtyp "Trego arabishten" për të kontrolluar.'}
            {!isRecording && hasTakes && revealed &&
              'Krahaso provat tua me tekstin arabisht më poshtë.'}
          </div>
          {hasTakes && !isRecording && takes.length > 1 && (
            <button
              onClick={clearRecording}
              className="btn-ghost !px-2 !py-1 text-[11px] shrink-0"
              title="Fshi të gjitha"
            >
              <Trash2 size={12} /> Fshi
            </button>
          )}
        </div>

        {/* Stacked takes list — newest on top, each numbered so the user
            can talk about "Prova 3" without having to rewind mentally. */}
        {hasTakes && (
          <ul className="space-y-2 animate-[fadeSlideDown_200ms_ease-out]">
            {takes.map((t, i) => (
              <TakeRow
                key={t.id}
                take={t}
                label={`Prova ${takes.length - i}`}
                onRemove={() => removeTake(t.id)}
              />
            ))}
          </ul>
        )}
      </div>

      {/* Reveal / Arabic text */}
      {!revealed ? (
        <button
          onClick={() => setRevealed(true)}
          className="btn-outline w-full justify-center"
        >
          <Eye size={16} /> Trego arabishten
        </button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wide text-slate-400 font-semibold">
              Arabishtja
            </span>
            <button
              onClick={() => setRevealed(false)}
              className="btn-ghost !px-2 !py-1 text-xs"
              title="Fshih përsëri"
            >
              <EyeOff size={14} /> Fshih
            </button>
          </div>
          <p
            dir="rtl"
            className="font-amiri text-2xl md:text-[28px] text-slate-900"
            style={{ lineHeight: 2.4 }}
          >
            {showHarakat ? active.arabic : stripHarakat(active.arabic)}
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-2 py-1">
          <AlertCircle size={12} />
          {error}
        </div>
      )}
    </article>
  );
}

// ─────────────────────────────────────────────────────────────────────
// RecordButton — the big tactile mic. Idle state is an emerald circle
// with a soft halo ring (drawing the eye); recording state is red with
// a pulsing outer ring so there's no way to miss that the mic is hot.
// Kept as its own component so future surfaces (Flashcard, VocabWord
// speaker) can drop it in without copy-pasting the styling.
// ─────────────────────────────────────────────────────────────────────
function RecordButton({
  isRecording,
  onStart,
  onStop,
}: {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
}) {
  if (isRecording) {
    return (
      <button
        onClick={onStop}
        aria-label="Ndal regjistrimin"
        className="relative shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg shadow-red-500/30 transition-transform active:scale-95"
      >
        <span className="absolute inset-0 rounded-full bg-red-400/50 animate-ping motion-reduce:hidden" />
        <Square size={18} className="relative" />
      </button>
    );
  }
  return (
    <button
      onClick={onStart}
      aria-label="Fillo regjistrimin"
      title="Regjistro përkthimin tënd në arabisht"
      className="relative shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md shadow-emerald-500/25 transition-all hover:shadow-lg hover:shadow-emerald-500/40 hover:-translate-y-0.5 active:scale-95 motion-reduce:hover:translate-y-0"
    >
      <span className="absolute inset-0 rounded-full ring-2 ring-emerald-400/30 ring-offset-2 ring-offset-white" />
      <Mic size={18} className="relative" />
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────
// LiveBars — small equalizer-style indicator shown next to the status
// text while the mic is hot. Reuses the `mic-equalizer` keyframes from
// index.css that the transform-exercise input already uses.
// ─────────────────────────────────────────────────────────────────────
function LiveBars() {
  return (
    <span className="inline-flex items-end gap-[3px] h-4" aria-hidden>
      {[0, 0.15, 0.3, 0.45].map((d, i) => (
        <span
          key={i}
          className="w-[3px] rounded-full bg-red-500 motion-reduce:h-3"
          style={{
            animation: 'mic-equalizer 900ms ease-in-out infinite',
            animationDelay: `${d}s`,
            height: '6px',
          }}
        />
      ))}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// TakeRow — one recording in the stacked list. Wraps the native audio
// element in a themed pill so it reads as "part of the card" instead
// of a raw browser widget. Also shows a small "Prova N · 0:07" label
// so multiple takes are distinguishable at a glance.
// ─────────────────────────────────────────────────────────────────────
function TakeRow({
  take,
  label,
  onRemove,
}: {
  take: Take;
  label: string;
  onRemove: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  return (
    <li className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-2.5 py-2 shadow-sm animate-[fadeSlideDown_180ms_ease-out]">
      <div className="flex flex-col min-w-0 shrink-0">
        <span className="text-[10px] uppercase tracking-wide font-semibold text-emerald-700">
          {label}
        </span>
        <span className="text-[10px] text-slate-400 tabular-nums">
          {formatDuration(take.durationMs)}
        </span>
      </div>
      <audio
        ref={audioRef}
        controls
        src={take.url}
        className="h-9 flex-1 min-w-0 max-w-full"
      >
        <track kind="captions" />
      </audio>
      <button
        onClick={onRemove}
        className="btn-ghost !px-1.5 !py-1.5 shrink-0 text-slate-400 hover:text-red-600"
        aria-label="Fshi këtë provë"
        title="Fshi këtë provë"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}

function formatDuration(ms: number): string {
  const s = Math.max(0, Math.round(ms / 1000));
  const m = Math.floor(s / 60);
  const rem = s % 60;
  return `${m}:${rem.toString().padStart(2, '0')}`;
}
