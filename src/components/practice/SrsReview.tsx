import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  RotateCcw,
  Sparkles,
  Volume2,
  Zap,
} from 'lucide-react';
import { CHAPTERS, type VocabWord } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { speakArabic } from '@/lib/arabicSpeech';
import { buildSession, type SrsGrade } from '@/lib/srs';
import { track } from '@/lib/analytics';

// Spaced Repetition review surface.
//
// Flow:
//   1. Build today's queue: all *due* cards across the whole curriculum
//      (SRS is cross-chapter by design — that's the whole point) plus up
//      to N new cards drawn from the *current* chapter, capped by the
//      daily new-card budget.
//   2. Show the Arabic side first (this is "production review" — the
//      learner sees Arabic and recalls the Albanian meaning). Tapping
//      the card flips to reveal the answer.
//   3. After flipping, the learner self-grades with one of four buttons:
//      Again / Hard / Good / Easy. We update the card via SM-2 and move on.
//   4. When the queue empties, show a celebration screen.
//
// Why production review (AR → AL) and not recognition (AL → AR): for
// Arabic learners the harder, more useful skill is decoding the Arabic
// shape they see in a book. Recognition mode (AL→AR) is also useful and
// can be added later as a toggle.

interface SrsReviewProps {
  onExit: () => void;
}

// Build a global wordId → VocabWord index once (curriculum is static).
const VOCAB_INDEX: Record<string, VocabWord> = (() => {
  const map: Record<string, VocabWord> = {};
  for (const ch of CHAPTERS) {
    for (const w of ch.vocabulary) map[w.id] = w;
  }
  return map;
})();

export function SrsReview({ onExit }: SrsReviewProps) {
  const srs = useStore((s) => s.srs);
  const dailyNew = useStore((s) => s.srsDailyNew);
  const dailyCap = useStore((s) => s.srsDailyNewCap);
  const introduceSrsCard = useStore((s) => s.introduceSrsCard);
  const gradeSrsCard = useStore((s) => s.gradeSrsCard);
  const recordSession = useStore((s) => s.recordSession);
  const currentChapterId = useStore((s) => s.currentChapterId);

  // Build the queue *once* on mount. Re-building on every grade would
  // shuffle the visible queue length under the user (annoying); instead
  // we lock the session at start and append fresh new-card IDs once.
  // Subsequent grades operate on cards whose updated state is read live
  // from the store at render time.
  const initialQueue = useMemo(() => {
    const used = dailyNew.date && dailyNew.count ? dailyNew.count : 0;
    const capLeft = Math.max(0, dailyCap - used);
    // When the user blows through their daily cap and there's nothing
    // due, offer a bonus batch so the SRS surface is never "empty".
    // The cap is a pace recommendation, not a paywall.
    const remaining = capLeft > 0 ? capLeft : 5;
    const chapter = CHAPTERS.find((c) => c.id === currentChapterId);
    const candidatePool = chapter?.vocabulary.map((w) => w.id) ?? [];
    const { due, fresh } = buildSession(srs, candidatePool, remaining);
    // Interleave fresh cards every ~3rd slot so the learner gets a mix
    // of "new exposure" and "recall practice" rather than a wall of new
    // cards at the end. Standard Anki strategy.
    const queue: string[] = [];
    let f = 0;
    for (let i = 0; i < due.length; i++) {
      queue.push(due[i].wordId);
      if (i % 3 === 2 && f < fresh.length) queue.push(fresh[f++]);
    }
    while (f < fresh.length) queue.push(fresh[f++]);
    return queue;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [gradedCount, setGradedCount] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);

  const currentId = initialQueue[pos];
  const word = currentId ? VOCAB_INDEX[currentId] : null;
  const isNewCard = word ? !srs[word.id] : false;

  useEffect(() => {
    if (!word) return;
    // Lazily introduce a fresh card the first time we land on it. We do
    // this on render rather than at queue-build time so the daily-new
    // counter only ticks for cards the user actually saw.
    if (isNewCard) introduceSrsCard(word.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [word?.id]);

  useEffect(() => {
    track({ name: 'srs_session_opened', props: { queue: initialQueue.length } });
  }, [initialQueue.length]);

  if (initialQueue.length === 0) {
    return <EmptyState onExit={onExit} />;
  }

  if (pos >= initialQueue.length) {
    return <DoneState count={gradedCount} onExit={onExit} />;
  }

  if (!word) {
    return <EmptyState onExit={onExit} />;
  }

  const grade = (g: SrsGrade) => {
    gradeSrsCard(word.id, g);
    track({ name: 'srs_card_graded', props: { grade: g, isNew: isNewCard } });
    if (!sessionStarted) {
      recordSession();
      setSessionStarted(true);
    }
    setGradedCount((c) => c + 1);
    setRevealed(false);
    setPos((p) => p + 1);
  };

  const speak = () => speakArabic(word.arabic);

  return (
    <div className="space-y-5">
      {/* Header — back link + queue progress + daily-new chip */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          <span>Mbaro sesionin</span>
        </button>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">
            {pos + 1} / {initialQueue.length}
          </span>
          {isNewCard && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 font-medium">
              <Sparkles size={11} />
              <span>I ri</span>
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-brand-500 transition-all duration-300"
          style={{ width: `${(pos / initialQueue.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className={`rounded-2xl border bg-white p-6 sm:p-10 min-h-[260px] flex flex-col items-center justify-center text-center select-none transition-all ${
          revealed ? 'border-brand-200 shadow-card' : 'border-slate-200 shadow-soft cursor-pointer hover:shadow-card'
        }`}
        onClick={() => !revealed && setRevealed(true)}
      >
        {/* Arabic — always visible */}
        <div className="flex items-center gap-3">
          <span
            dir="rtl"
            className="arabic-text text-4xl sm:text-5xl text-slate-900"
          >
            {word.arabic}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak();
            }}
            className="inline-flex items-center justify-center w-9 h-9 rounded-full text-brand-600 hover:bg-brand-50 transition-colors"
            aria-label="Dëgjo shqiptimin"
          >
            <Volume2 size={18} />
          </button>
        </div>

        {/* Type / gender chips */}
        <div className="mt-3 flex items-center justify-center gap-2 text-[11px] uppercase tracking-wide text-slate-500">
          <span className="rounded-full bg-slate-100 px-2 py-0.5">
            {TYPE_LABEL[word.type]}
          </span>
          {word.gender && (
            <span
              className={`rounded-full px-2 py-0.5 ${
                word.gender === 'M'
                  ? 'bg-sky-100 text-sky-700'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {word.gender === 'M' ? 'Mashkull' : 'Femër'}
            </span>
          )}
        </div>

        {/* Answer slot.
            We *unmount* the block instead of just toggling opacity:
            an earlier version kept the answer in the DOM and faded
            it via `transition-all`, which meant moving to the next
            card briefly flashed the *next* word's Albanian gloss as
            the opacity animated 1 → 0. Hard unmount + a keyframe
            fade-in on the new mount avoids the flash entirely. The
            `key` on the wrapper guarantees a clean remount even
            when two consecutive cards happen to have identical
            content. */}
        {revealed ? (
          <div
            key={word.id}
            className="mt-6 animate-[fadeSlideDown_180ms_ease-out] motion-reduce:animate-none"
          >
            <div className="text-2xl font-semibold text-slate-800">
              {word.albanian}
            </div>
            {word.root && (
              <div className="mt-2 text-xs text-slate-500">
                Rrënja:{' '}
                <span dir="rtl" className="font-amiri text-base text-slate-700">
                  {word.root}
                </span>
              </div>
            )}
            {word.plural && (
              <div className="mt-1 text-xs text-slate-500">
                Shumësi:{' '}
                <span dir="rtl" className="font-amiri text-base text-slate-700">
                  {word.plural}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-6 text-xs text-slate-400">
            Trokit për të zbuluar përkthimin
          </div>
        )}
      </div>

      {/* Grade buttons — appear only after reveal. The four-grade Anki
          mapping: Again (lapse) / Hard / Good / Easy. Each button shows
          the next-due hint inline so the learner can calibrate. */}
      {revealed ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <GradeButton
            label="Përsëri"
            hint="< 1 ditë"
            color="rose"
            onClick={() => grade(1)}
          />
          <GradeButton
            label="Vështirë"
            hint="Shkurt"
            color="amber"
            onClick={() => grade(3)}
          />
          <GradeButton
            label="Mirë"
            hint="Standard"
            color="brand"
            onClick={() => grade(4)}
          />
          <GradeButton
            label="Lehtë"
            hint="Më gjatë"
            color="emerald"
            onClick={() => grade(5)}
          />
        </div>
      ) : (
        <div className="text-center text-xs text-slate-400">
          Mendo për përkthimin, pastaj zbulo
        </div>
      )}
    </div>
  );
}

const TYPE_LABEL: Record<VocabWord['type'], string> = {
  noun: 'Emër',
  verb: 'Folje',
  particle: 'Pjesëz',
  adjective: 'Mbiemër',
};

function GradeButton({
  label,
  hint,
  color,
  onClick,
}: {
  label: string;
  hint: string;
  color: 'rose' | 'amber' | 'brand' | 'emerald';
  onClick: () => void;
}) {
  const palette = {
    rose: 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100',
    amber: 'border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100',
    brand: 'border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100',
    emerald:
      'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100',
  }[color];
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center gap-0.5 rounded-xl border px-3 py-3 transition-all active:scale-[0.97] ${palette}`}
    >
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-[10px] opacity-70">{hint}</span>
    </button>
  );
}

function EmptyState({ onExit }: { onExit: () => void }) {
  return (
    <div className="text-center py-10">
      <div className="mx-auto w-14 h-14 rounded-full bg-brand-50 border border-brand-100 flex items-center justify-center text-brand-600">
        <Check size={24} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-800">
        S'ka asnjë kartë për sot
      </h3>
      <p className="mt-1 text-sm text-slate-500 max-w-xs mx-auto">
        Hap një kapitull dhe kthehu te përsëritja — fjalët e reja shtohen
        automatikisht në radhë kur i shfrytëzon për herë të parë.
      </p>
      <button onClick={onExit} className="mt-5 btn-outline">
        <ArrowLeft size={14} /> Kthehu
      </button>
    </div>
  );
}

function DoneState({
  count,
  onExit,
}: {
  count: number;
  onExit: () => void;
}) {
  return (
    <div className="text-center py-10">
      <div className="mx-auto w-14 h-14 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
        <Zap size={24} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-800">
        Mbaroi sesioni!
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Vlerësove {count} {count === 1 ? 'kartë' : 'karta'}. Kthehu nesër
        për përsëritjet që do të bëhen të afatshme.
      </p>
      <div className="mt-5 flex items-center justify-center gap-2">
        <button onClick={onExit} className="btn-outline">
          <ArrowLeft size={14} /> Mbaro
        </button>
        <button
          onClick={() => window.location.reload()}
          className="btn-ghost"
        >
          <RotateCcw size={14} /> Rifresko
        </button>
      </div>
    </div>
  );
}
