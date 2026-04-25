import { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Info,
  MessageCircle,
  PencilLine,
  Sparkles,
} from 'lucide-react';
import { getChapter } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { track } from '@/lib/analytics';
import { Flashcard } from './Flashcard';
import { StoryCard } from './StoryCard';
import { TransformExercise } from './TransformExercise';
import { AyatSection } from './AyatSection';
import { ActivityCard } from './ActivityCard';

// The chapter view is now a two-state surface:
//
//   1. Hub view — a goals strip + 2x2 grid of "activity cards"
//      (Dialogues / Exercises / Stories / Ayat). Vocabulary lives in
//      the right-rail panel and is NOT a card here, by design: the
//      learner sees vocab as a permanent surface, not an activity to
//      "complete".
//
//   2. Activity view — once a card is tapped, the chosen activity
//      takes over the canvas with a back link to return to the hub.
//      The four activity components were already battle-tested under
//      the previous accordion layout, so we keep them as-is and just
//      change the framing.
//
// This replaces the earlier 6-accordion / 6-tab layouts. The deep
// problem with both was that the chapter view was a *catalog* — a
// list of "things you could do". The hub layout makes it a *menu*
// with one clear next step (the recommended card carries a "Fillo
// këtu" badge), and the focused activity view eliminates the visual
// clutter of competing surfaces.

type Activity = 'dialogues' | 'exercises' | 'stories' | 'ayat';

export function PracticeArena() {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const markDialogueMastered = useStore((s) => s.markDialogueMastered);
  const markExerciseCompleted = useStore((s) => s.markExerciseCompleted);
  const completedDialogues = useStore((s) => s.completedDialogues);
  const completedExercises = useStore((s) => s.completedExercises);
  const recordSession = useStore((s) => s.recordSession);
  const showHarakat = useStore((s) => s.showHarakat);

  const chapter = getChapter(currentChapterId);
  const dialogues = useMemo(() => chapter?.dialogues ?? [], [chapter]);
  const stories = useMemo(() => chapter?.stories ?? [], [chapter]);
  const exercises = useMemo(() => chapter?.exercises ?? [], [chapter]);
  const ayat = useMemo(() => chapter?.ayat ?? [], [chapter]);

  const [active, setActive] = useState<Activity | null>(null);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [storyIndex, setStoryIndex] = useState(0);

  // Reset when the chapter changes — drop back to the hub and clear
  // any per-activity state. We track the chapter view (not the
  // activity entries) so the dashboard reflects "chapters visited".
  useEffect(() => {
    track({ name: 'chapter_opened', props: { chapter: currentChapterId } });
    setActive(null);
    setIndex(0);
    setRevealed(false);
    setSessionStarted(false);
    setExerciseIndex(0);
    setStoryIndex(0);
  }, [currentChapterId]);

  const dialoguesDone = useMemo(
    () => dialogues.filter((d) => completedDialogues.includes(d.id)).length,
    [dialogues, completedDialogues],
  );
  const exercisesDone = useMemo(
    () => exercises.filter((e) => completedExercises.includes(e.id)).length,
    [exercises, completedExercises],
  );

  // Recommended next activity — the first one that still has work.
  // Stories and ayat have no completion model yet, so they get the
  // "recommended" badge once the trackable activities are done.
  const recommended = useMemo<Activity | null>(() => {
    if (dialogues.length > 0 && dialoguesDone < dialogues.length)
      return 'dialogues';
    if (exercises.length > 0 && exercisesDone < exercises.length)
      return 'exercises';
    if (stories.length > 0) return 'stories';
    if (ayat.length > 0) return 'ayat';
    return null;
  }, [
    dialogues.length,
    dialoguesDone,
    exercises.length,
    exercisesDone,
    stories.length,
    ayat.length,
  ]);

  if (!chapter) {
    return (
      <div className="card p-6 text-center text-slate-500">
        Kapitulli nuk u gjet.
      </div>
    );
  }

  const enter = (a: Activity) => {
    setActive(a);
    track({
      name: 'section_expanded',
      props: { section: a, chapter: currentChapterId },
    });
  };

  const leave = () => setActive(null);

  // ── Activity view ─────────────────────────────────────────────────
  if (active) {
    return (
      <div className="max-w-3xl mx-auto">
        <ActivityHeader
          chapterId={chapter.id}
          chapterTitleAl={chapter.titleAl}
          activeLabel={LABEL[active]}
          onBack={leave}
        />

        <div
          key={active}
          className="card p-5 animate-[fadeIn_180ms_ease-out] motion-reduce:animate-none"
        >
          {active === 'dialogues' && dialogues.length > 0 && (
            <DialoguesView
              dialogues={dialogues}
              index={index}
              setIndex={setIndex}
              revealed={revealed}
              setRevealed={setRevealed}
              onKnown={() => {
                const current = dialogues[index];
                markDialogueMastered(current.id);
                track({
                  name: 'dialogue_mastered',
                  props: { chapter: currentChapterId, dialogue: current.id },
                });
                if (!sessionStarted) {
                  recordSession();
                  setSessionStarted(true);
                }
                setRevealed(false);
                setIndex((i) => (i + 1 < dialogues.length ? i + 1 : 0));
              }}
              onRetry={() => {
                if (!sessionStarted) {
                  recordSession();
                  setSessionStarted(true);
                }
                setRevealed(false);
                setIndex((i) => (i + 1 < dialogues.length ? i + 1 : 0));
              }}
              completedDialogues={completedDialogues}
            />
          )}

          {active === 'exercises' && exercises.length > 0 && (
            <ExercisesView
              exercises={exercises}
              index={exerciseIndex}
              setIndex={setExerciseIndex}
              completedExercises={completedExercises}
              onCorrect={markExerciseCompleted}
            />
          )}

          {active === 'stories' && stories.length > 0 && (
            <StoriesView
              stories={stories}
              index={storyIndex}
              setIndex={setStoryIndex}
              showHarakat={showHarakat}
            />
          )}

          {active === 'ayat' && ayat.length > 0 && (
            <AyatSection ayat={ayat} />
          )}
        </div>
      </div>
    );
  }

  // ── Hub view (default) ────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Chapter header — slim, no decorative panel. The dropdown in
          the TopBar already names the chapter, so here we just echo
          it for orientation when the user lands deep on the page.
          Grammar focus points used to live in a banner below the
          header; they're now tucked behind an info icon next to
          "Kapitulli N" so the hub stays visually quiet. */}
      {/* Chapter header: chapter chip + ornamental Arabic title.
          The Arabic title sits on a parchment-tone slab with a thin
          gold rule above and below — the visual cue that says "this
          is the page of a book", not "this is a row of metadata". */}
      <header className="min-w-0 text-center pt-2">
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-brand-700 font-semibold bg-brand-50 border border-brand-100 rounded-full px-3 py-1 shadow-sm">
          <Sparkles size={11} className="text-brand-500" />
          <span>Kapitulli {chapter.id}</span>
          {chapter.grammarFocus.length > 0 && (
            <GrammarFocusInfo points={chapter.grammarFocus} />
          )}
        </div>
        <div className="mt-3 flex items-center justify-center gap-3">
          <span className="hidden sm:block flex-1 max-w-[80px] h-px gold-rule" />
          <h1
            dir="rtl"
            className="font-amiri text-3xl sm:text-4xl text-slate-900 leading-tight break-words"
          >
            {chapter.titleAr}
          </h1>
          <span className="hidden sm:block flex-1 max-w-[80px] h-px gold-rule" />
        </div>
        <div className="mt-1.5 text-sm text-slate-500 break-words italic">
          {chapter.titleAl}
        </div>
      </header>

      {/* 2x2 activity grid — the hub. Vocabulary intentionally NOT a
          card here: it lives in the always-visible right rail. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <ActivityCard
          accent="emerald"
          icon={<MessageCircle size={22} />}
          title="Dialogjet"
          description="Fraza të zakonshme me kontroll shqiptimi."
          progress={
            dialogues.length > 0
              ? `${dialoguesDone} / ${dialogues.length}`
              : undefined
          }
          progressRatio={
            dialogues.length > 0 ? dialoguesDone / dialogues.length : 0
          }
          done={
            dialogues.length > 0 && dialoguesDone === dialogues.length
          }
          recommended={recommended === 'dialogues'}
          disabled={dialogues.length === 0}
          onClick={() => enter('dialogues')}
        />

        <ActivityCard
          accent="indigo"
          icon={<PencilLine size={22} />}
          title="Ushtrime"
          description="Transformime gjinie, numri dhe kohe."
          progress={
            exercises.length > 0
              ? `${exercisesDone} / ${exercises.length}`
              : 'Pa ushtrime'
          }
          progressRatio={
            exercises.length > 0 ? exercisesDone / exercises.length : 0
          }
          done={
            exercises.length > 0 && exercisesDone === exercises.length
          }
          recommended={recommended === 'exercises'}
          disabled={exercises.length === 0}
          onClick={() => enter('exercises')}
        />

        <ActivityCard
          accent="amber"
          icon={<BookOpen size={22} />}
          title="Tregime"
          description="Tekste të shkurtra për dëgjim dhe leximin me zë."
          progress={
            stories.length > 0
              ? `${stories.length} ${stories.length === 1 ? 'tregim' : 'tregime'}`
              : 'Pa tregime'
          }
          recommended={recommended === 'stories'}
          disabled={stories.length === 0}
          onClick={() => enter('stories')}
        />

        <ActivityCard
          accent="emerald"
          icon={<Sparkles size={22} />}
          title="Ajete të Kuranit"
          description="Vargjet ku kupton fjalët e mësuara."
          progress={
            ayat.length > 0
              ? `${ayat.length} ${ayat.length === 1 ? 'ajet' : 'ajete'}`
              : 'Pa ajete'
          }
          recommended={recommended === 'ayat'}
          disabled={ayat.length === 0}
          onClick={() => enter('ayat')}
        />
      </div>
    </div>
  );
}

// Per-activity labels used in the back-link header.
const LABEL: Record<Activity, string> = {
  dialogues: 'Dialogjet',
  exercises: 'Ushtrime',
  stories: 'Tregime',
  ayat: 'Ajete të Kuranit',
};

// ─────────────────────────────────────────────────────────────────────
// ActivityHeader — slim breadcrumb-style header shown above an active
// activity. The "Kthehu" link uses the browser back-button affordance
// learners already understand.
// ─────────────────────────────────────────────────────────────────────

function ActivityHeader({
  chapterId,
  chapterTitleAl,
  activeLabel,
  onBack,
}: {
  chapterId: number;
  chapterTitleAl: string;
  activeLabel: string;
  onBack: () => void;
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2 min-w-0">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        <span>Kthehu te kapitulli</span>
      </button>
      <div className="text-[11px] text-slate-400 truncate">
        Kap. {chapterId} · {chapterTitleAl} ·{' '}
        <span className="text-slate-600 font-medium">{activeLabel}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// GrammarFocusInfo — tiny "ⓘ" affordance next to the chapter label
// that opens a popover listing the chapter's grammar focus points.
// Replaces the wider banner that used to sit under the header.
// Behaviour: click toggles, click-outside or Escape closes, hover
// is intentionally not used so the popover is mobile-friendly.
// ─────────────────────────────────────────────────────────────────────

function GrammarFocusInfo({ points }: { points: string[] }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <span ref={wrapRef} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Pikat gramatikore të kapitullit"
        aria-expanded={open}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full text-brand-500 hover:text-brand-700 hover:bg-brand-50 transition-colors"
      >
        <Info size={13} />
      </button>
      {open && (
        <div
          role="dialog"
          className="absolute left-0 top-full mt-1.5 w-[min(85vw,320px)] rounded-xl border border-brand-100 bg-white shadow-xl z-40 p-3 animate-[fadeSlideDown_180ms_ease-out] motion-reduce:animate-none normal-case tracking-normal"
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-700 mb-2">
            <Sparkles size={12} />
            <span>Pikat gramatikore të këtij kapitulli</span>
          </div>
          <ul className="space-y-1.5">
            {points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2 text-xs text-slate-700"
              >
                <span className="mt-1 inline-block w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                <span className="leading-snug">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────────────
// DialoguesView / ExercisesView — extracted so the parent component
// stays readable. Both keep the prev/next + dot navigation patterns
// from the previous layout because they tested well.
// ─────────────────────────────────────────────────────────────────────

interface DialoguesViewProps {
  dialogues: import('@/data/curriculum').Dialogue[];
  index: number;
  setIndex: (i: number | ((prev: number) => number)) => void;
  revealed: boolean;
  setRevealed: (v: boolean) => void;
  onKnown: () => void;
  onRetry: () => void;
  completedDialogues: string[];
}

function DialoguesView({
  dialogues,
  index,
  setIndex,
  revealed,
  setRevealed,
  onKnown,
  onRetry,
  completedDialogues,
}: DialoguesViewProps) {
  const current = dialogues[index];
  const isLast = index === dialogues.length - 1;
  return (
    <div className="space-y-4">
      {current && (
        <Flashcard
          dialogue={current}
          revealed={revealed}
          onReveal={() => setRevealed(true)}
          onHide={() => setRevealed(false)}
          onKnown={onKnown}
          onRetry={onRetry}
          index={index}
          total={dialogues.length}
        />
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => {
            setRevealed(false);
            setIndex((i) => (i - 1 >= 0 ? i - 1 : dialogues.length - 1));
          }}
          className="btn-outline"
        >
          <ChevronLeft size={16} /> Para
        </button>
        <div className="flex items-center gap-1">
          {dialogues.map((d, i) => {
            const done = completedDialogues.includes(d.id);
            const active = i === index;
            const cls = active
              ? done
                ? 'bg-emerald-500 w-6'
                : 'bg-brand-600 w-6'
              : done
                ? 'bg-emerald-500 w-2 hover:bg-emerald-600'
                : 'bg-slate-300 w-2 hover:bg-slate-400';
            return (
              <button
                key={d.id}
                onClick={() => {
                  setIndex(i);
                  setRevealed(false);
                }}
                className={`h-2 rounded-full transition-all ${cls}`}
                aria-label={`Dialogu ${i + 1}${done ? ' — i mësuar' : ''}`}
                title={done ? 'I mësuar' : undefined}
              />
            );
          })}
        </div>
        <button
          onClick={() => {
            setRevealed(false);
            setIndex((i) => (i + 1 < dialogues.length ? i + 1 : 0));
          }}
          className="btn-outline"
        >
          {isLast ? 'Nga fillimi' : 'Pas'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// StoriesView — same prev/next + dot navigation as DialoguesView.
// Stories used to render as a stacked list, but mixing 3 long
// recordable stories on one page made the surface noisy and broke
// consistency with the other activities. Single-card view gives the
// learner one clear target at a time, just like the dialogue cards.
// ─────────────────────────────────────────────────────────────────────

interface StoriesViewProps {
  stories: import('@/data/curriculum').Story[];
  index: number;
  setIndex: (i: number | ((prev: number) => number)) => void;
  showHarakat: boolean;
}

function StoriesView({
  stories,
  index,
  setIndex,
  showHarakat,
}: StoriesViewProps) {
  const current = stories[index];
  const isLast = index === stories.length - 1;
  return (
    <div className="space-y-4 -m-5">
      <div key={current.id}>
        <StoryCard story={current} showHarakat={showHarakat} />
      </div>

      {stories.length > 1 && (
        <div className="flex items-center justify-between px-5 pb-5">
          <button
            onClick={() =>
              setIndex((i) => (i - 1 >= 0 ? i - 1 : stories.length - 1))
            }
            className="btn-outline"
          >
            <ChevronLeft size={16} /> Para
          </button>
          <div className="flex items-center gap-1">
            {stories.map((s, i) => {
              const active = i === index;
              const cls = active
                ? 'bg-amber-600 w-6'
                : 'bg-slate-300 w-2 hover:bg-slate-400';
              return (
                <button
                  key={s.id}
                  onClick={() => setIndex(i)}
                  className={`h-2 rounded-full transition-all ${cls}`}
                  aria-label={`Tregimi ${i + 1}: ${s.titleAl}`}
                  title={s.titleAl}
                />
              );
            })}
          </div>
          <button
            onClick={() =>
              setIndex((i) => (i + 1 < stories.length ? i + 1 : 0))
            }
            className="btn-outline"
          >
            {isLast ? 'Nga fillimi' : 'Pas'} <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}

interface ExercisesViewProps {
  exercises: import('@/data/curriculum').Exercise[];
  index: number;
  setIndex: (i: number | ((prev: number) => number)) => void;
  completedExercises: string[];
  onCorrect: (id: string) => void;
}

function ExercisesView({
  exercises,
  index,
  setIndex,
  completedExercises,
  onCorrect,
}: ExercisesViewProps) {
  return (
    <div>
      <TransformExercise
        exercise={exercises[index]}
        index={index}
        total={exercises.length}
        onNext={() =>
          setIndex((i) => (i + 1 < exercises.length ? i + 1 : 0))
        }
        onPrev={() =>
          setIndex((i) => (i - 1 >= 0 ? i - 1 : exercises.length - 1))
        }
        onCorrect={onCorrect}
      />

      <div className="mt-5 flex items-center justify-center gap-1">
        {exercises.map((ex, i) => {
          const done = completedExercises.includes(ex.id);
          const active = i === index;
          const cls = active
            ? done
              ? 'bg-emerald-500 w-6'
              : 'bg-indigo-600 w-6'
            : done
              ? 'bg-emerald-500 w-2 hover:bg-emerald-600'
              : 'bg-slate-300 w-2 hover:bg-slate-400';
          return (
            <button
              key={ex.id}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${cls}`}
              aria-label={`Ushtrimi ${i + 1}${done ? ' — i plotësuar' : ''}`}
              title={done ? 'I plotësuar' : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
