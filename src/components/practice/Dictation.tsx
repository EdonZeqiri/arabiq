import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  Ear,
  RotateCcw,
  Volume2,
  X,
} from 'lucide-react';
import { CHAPTERS, getChapter, type VocabWord } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { speakArabic } from '@/lib/arabicSpeech';
import { track } from '@/lib/analytics';

// Dictation drill — listening comprehension at the word level.
//
// Why this exists: TTS-driven flashcards train the eye-to-meaning path.
// Pronunciation check trains the mouth. Neither trains the *ear*. A
// learner who has never been forced to map an audio stream to meaning
// without seeing the script ends up with a "reading-only" Arabic — they
// can decode a page but freeze when a teacher says a word out loud.
//
// Format (v1):
//   - Play TTS for an Arabic word (no script shown).
//   - Show 4 Albanian translations as buttons; learner picks the match.
//   - Distractors are sampled from the same chapter when possible (so
//     the choice is meaningful — same semantic field), filling from
//     adjacent chapters if the chapter is too small.
//   - 3 wrong picks reveals the answer; correct pick advances and
//     promotes the card via SRS (grade Good).
//
// Round size = 10 words drawn from the current chapter. Short enough
// for a phone-friendly burst; the user can replay for another round.

interface DictationProps {
  onExit: () => void;
}

const ROUND_SIZE = 10;

interface DictationItem {
  target: VocabWord;
  choices: VocabWord[]; // includes target, shuffled
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Build a round: pick up to ROUND_SIZE target words from the chapter,
 *  then for each one pick 3 distractors. Distractors come first from
 *  the same chapter, falling back to other chapters if needed. We try
 *  to match `type` (noun/verb/...) so the choice tests meaning, not
 *  word-class — picking "kitāb" out of {book, walked, with, a} is too
 *  easy; picking it out of {book, pen, door, table} is the real drill. */
function buildRound(currentChapterId: number): DictationItem[] {
  const chapter = getChapter(currentChapterId);
  if (!chapter || chapter.vocabulary.length === 0) return [];

  // Global pool for distractor fallback, excluding particles (function
  // words rarely make good distractors for content words and vice versa).
  const globalPool: VocabWord[] = [];
  for (const ch of CHAPTERS) {
    for (const w of ch.vocabulary) globalPool.push(w);
  }

  const targets = shuffle(chapter.vocabulary).slice(0, ROUND_SIZE);

  return targets.map((target) => {
    // Same-chapter, same-type, not the target itself.
    const sameType = chapter.vocabulary.filter(
      (w) => w.id !== target.id && w.type === target.type,
    );
    let distractors = shuffle(sameType).slice(0, 3);
    if (distractors.length < 3) {
      const extra = shuffle(
        globalPool.filter(
          (w) =>
            w.id !== target.id &&
            w.type === target.type &&
            !distractors.some((d) => d.id === w.id) &&
            w.albanian !== target.albanian,
        ),
      ).slice(0, 3 - distractors.length);
      distractors = [...distractors, ...extra];
    }
    // Final safety: if we still don't have 3, fall back to any word.
    if (distractors.length < 3) {
      const extra = shuffle(
        globalPool.filter(
          (w) =>
            w.id !== target.id &&
            !distractors.some((d) => d.id === w.id) &&
            w.albanian !== target.albanian,
        ),
      ).slice(0, 3 - distractors.length);
      distractors = [...distractors, ...extra];
    }
    return { target, choices: shuffle([target, ...distractors]) };
  });
}

export function Dictation({ onExit }: DictationProps) {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const recordSession = useStore((s) => s.recordSession);
  const introduceSrsCard = useStore((s) => s.introduceSrsCard);
  const gradeSrsCard = useStore((s) => s.gradeSrsCard);
  const srs = useStore((s) => s.srs);

  const [round, setRound] = useState<DictationItem[]>(() =>
    buildRound(currentChapterId),
  );
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState<string | null>(null); // wordId of the choice
  const [wrongPicks, setWrongPicks] = useState<string[]>([]); // wordIds tried this question
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [sessionStarted, setSessionStarted] = useState(false);

  const item = round[pos];

  // Auto-play the audio whenever a new item is shown. Without this the
  // surface looks dead on first render — the learner has to remember to
  // hit play before answering, which is friction.
  useEffect(() => {
    if (!item) return;
    track({ name: 'dictation_question_shown', props: { wordId: item.target.id } });
    const cleanup = speakArabic(item.target.arabic);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item?.target.id]);

  if (round.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-slate-500">
          Ky kapitull s'ka fjalor të mjaftueshëm për diktim.
        </p>
        <button onClick={onExit} className="mt-4 btn-outline">
          <ArrowLeft size={14} /> Kthehu
        </button>
      </div>
    );
  }

  if (pos >= round.length) {
    return (
      <DoneState
        score={score}
        onExit={onExit}
        onAgain={() => {
          setRound(buildRound(currentChapterId));
          setPos(0);
          setPicked(null);
          setWrongPicks([]);
          setScore({ correct: 0, total: 0 });
        }}
      />
    );
  }

  const replay = () => speakArabic(item.target.arabic);

  const advance = () => {
    setPicked(null);
    setWrongPicks([]);
    setPos((p) => p + 1);
  };

  const onPick = (choice: VocabWord) => {
    if (picked) return; // already locked in
    const isCorrect = choice.id === item.target.id;

    if (isCorrect) {
      setPicked(choice.id);
      setScore((s) => ({
        correct: s.correct + (wrongPicks.length === 0 ? 1 : 0),
        total: s.total + 1,
      }));
      track({
        name: 'dictation_answered',
        props: {
          wordId: item.target.id,
          firstTry: wrongPicks.length === 0,
        },
      });
      if (!sessionStarted) {
        recordSession();
        setSessionStarted(true);
      }
      // Promote via SRS only on first-try correct. Otherwise treat the
      // word as a near-miss and let the standard SRS schedule kick in
      // when the learner sees it in normal review.
      if (wrongPicks.length === 0) {
        if (!srs[item.target.id]) introduceSrsCard(item.target.id);
        // grade as Good (4) — they recognized it from audio alone
        gradeSrsCard(item.target.id, 4);
      }
      // Auto-advance after a short pause so the green flash is visible.
      window.setTimeout(advance, 700);
    } else {
      setWrongPicks((prev) => [...prev, choice.id]);
      // Three strikes → reveal correct answer and lock the question.
      if (wrongPicks.length + 1 >= 3) {
        setPicked(item.target.id); // forces reveal of the right one
        setScore((s) => ({ correct: s.correct, total: s.total + 1 }));
        // Don't promote SRS on a fail; if not yet introduced, do so but
        // grade as Again so it shows up tomorrow.
        if (!srs[item.target.id]) introduceSrsCard(item.target.id);
        gradeSrsCard(item.target.id, 1);
        window.setTimeout(advance, 1400);
      }
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={onExit}
          className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} />
          <span>Mbaro sesionin</span>
        </button>
        <div className="text-xs text-slate-500">
          {pos + 1} / {round.length}{' '}
          <span className="text-slate-400">·</span>{' '}
          <span className="text-emerald-700 font-medium">{score.correct}</span>
          /{score.total}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
        <div
          className="h-full bg-sky-500 transition-all duration-300"
          style={{ width: `${(pos / round.length) * 100}%` }}
        />
      </div>

      {/* Audio prompt — large speaker. The card has NO Arabic text by
          design: this is a listening drill. Showing the word would
          collapse the task to multiple-choice translation. */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 flex flex-col items-center gap-4 shadow-soft">
        <button
          onClick={replay}
          className="group inline-flex items-center justify-center w-20 h-20 rounded-full bg-sky-50 border border-sky-200 text-sky-600 hover:bg-sky-100 hover:scale-105 active:scale-100 transition-transform shadow-soft"
          aria-label="Përsërit audion"
        >
          <Ear size={32} />
        </button>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Volume2 size={12} />
          <span>Dëgjo dhe zgjidh kuptimin</span>
        </div>
        {wrongPicks.length > 0 && !picked && (
          <div className="text-[11px] text-rose-600">
            Mundësi të mbetura: {3 - wrongPicks.length}
          </div>
        )}
      </div>

      {/* Choices grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {item.choices.map((choice) => {
          const isCorrectChoice = choice.id === item.target.id;
          const wasWrong = wrongPicks.includes(choice.id);
          const isPickedCorrect = picked === choice.id && isCorrectChoice;
          const showCorrect = picked && isCorrectChoice;

          let cls =
            'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50';
          if (isPickedCorrect || showCorrect) {
            cls = 'border-emerald-300 bg-emerald-50 text-emerald-800';
          } else if (wasWrong) {
            cls =
              'border-rose-200 bg-rose-50 text-rose-700 opacity-60 cursor-not-allowed';
          }

          return (
            <button
              key={choice.id}
              disabled={!!picked || wasWrong}
              onClick={() => onPick(choice)}
              className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all active:scale-[0.99] ${cls}`}
            >
              <span className="text-sm font-medium">{choice.albanian}</span>
              {(isPickedCorrect || showCorrect) && (
                <Check size={16} className="text-emerald-600" />
              )}
              {wasWrong && <X size={16} className="text-rose-500" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DoneState({
  score,
  onExit,
  onAgain,
}: {
  score: { correct: number; total: number };
  onExit: () => void;
  onAgain: () => void;
}) {
  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;
  const verdict =
    pct >= 90
      ? 'Shkëlqyeshëm! 🎉'
      : pct >= 70
        ? 'Mirë — vazhdo!'
        : 'Përsërite — veshi mësohet me dëgjim.';
  return (
    <div className="text-center py-10">
      <div className="mx-auto w-14 h-14 rounded-full bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
        <Ear size={24} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-800">
        Mbaroi raundi
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        {score.correct} / {score.total} në provën e parë · {pct}%
      </p>
      <p className="mt-3 text-sm text-slate-700 italic">{verdict}</p>
      <div className="mt-5 flex items-center justify-center gap-2">
        <button onClick={onExit} className="btn-outline">
          <ArrowLeft size={14} /> Mbaro
        </button>
        <button onClick={onAgain} className="btn-primary">
          <RotateCcw size={14} /> Edhe një raund
        </button>
      </div>
    </div>
  );
}
