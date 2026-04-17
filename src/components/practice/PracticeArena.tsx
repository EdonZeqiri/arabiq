import { useEffect, useMemo, useState } from 'react';
import {
  BookA,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  MessageCircle,
  PencilLine,
  Target,
} from 'lucide-react';
import { getChapter } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { Flashcard } from './Flashcard';
import { StoryCard } from './StoryCard';
import { ChapterVocabulary } from './ChapterVocabulary';
import { TransformExercise } from './TransformExercise';
import { GrammarBullet } from './GrammarBullet';

type SectionKey = 'goals' | 'vocab' | 'dialogues' | 'exercises' | 'stories';

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
  const vocabulary = useMemo(() => chapter?.vocabulary ?? [], [chapter]);
  const exercises = useMemo(() => chapter?.exercises ?? [], [chapter]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [exerciseIndex, setExerciseIndex] = useState(0);

  // Accordion state — goals is collapsed by default (reference info),
  // while vocab and dialogues are open so the reader lands straight on
  // the work. Stories also expand so they are visible after scrolling.
  // Every accordion is collapsed by default — the reader opens the
  // section they want to work on. Keeps the page short and scannable
  // on first landing, especially on mobile.
  const [sections, setSections] = useState<Record<SectionKey, boolean>>({
    goals: false,
    vocab: false,
    dialogues: false,
    exercises: false,
    stories: false,
  });
  const toggle = (key: SectionKey) =>
    setSections((s) => ({ ...s, [key]: !s[key] }));

  // Reset whenever the chapter changes.
  useEffect(() => {
    setIndex(0);
    setRevealed(false);
    setSessionStarted(false);
    setExerciseIndex(0);
    setSections({
      goals: false,
      vocab: false,
      dialogues: false,
      exercises: false,
      stories: false,
    });
  }, [currentChapterId]);

  if (!chapter) {
    return (
      <div className="card p-6 text-center text-slate-500">
        Kapitulli nuk u gjet.
      </div>
    );
  }

  const current = dialogues[index];
  const isLast = index === dialogues.length - 1;

  const goNext = () => {
    setRevealed(false);
    setIndex((i) => (i + 1 < dialogues.length ? i + 1 : 0));
  };

  const goPrev = () => {
    setRevealed(false);
    setIndex((i) => (i - 1 >= 0 ? i - 1 : dialogues.length - 1));
  };

  const handleKnown = () => {
    markDialogueMastered(current.id);
    if (!sessionStarted) {
      recordSession();
      setSessionStarted(true);
    }
    goNext();
  };

  const handleRetry = () => {
    if (!sessionStarted) {
      recordSession();
      setSessionStarted(true);
    }
    goNext();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* ── Chapter header ───────────────────────────────────────── */}
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-brand-600 font-semibold">
          Kapitulli {chapter.id}
        </div>
        <h1
          dir="rtl"
          className="font-amiri text-2xl sm:text-3xl md:text-4xl text-slate-900 leading-tight break-words"
        >
          {chapter.titleAr}
        </h1>
        <div className="text-sm text-slate-500 break-words">
          {chapter.titleAl}
        </div>
      </div>

      {/* ── Section 1: Learning goals ────────────────────────────── */}
      <AccordionCard
        open={sections.goals}
        onToggle={() => toggle('goals')}
        accent="brand"
        icon={<Target size={16} className="text-brand-600" />}
        title="Çfarë do të mësojmë në këtë kapitull"
        meta={
          <span className="hidden sm:inline text-[11px] text-slate-500">
            Objektiva & përmbajtje
          </span>
        }
      >
        <div className="p-5 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
              Pika gramatikore
            </div>
            <ul className="space-y-2">
              {chapter.grammarFocus.map((g) => (
                <GrammarBullet key={g} text={g} />
              ))}
            </ul>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
              Përmbajtja
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="pill border border-slate-200 bg-slate-50 text-slate-600">
                {dialogues.length} dialogje
              </span>
              {stories.length > 0 && (
                <span className="pill border border-amber-200 bg-amber-50 text-amber-700">
                  {stories.length}{' '}
                  {stories.length === 1 ? 'tregim' : 'tregime'}
                </span>
              )}
              <span className="pill border border-blue-200 bg-blue-50 text-blue-700">
                {vocabulary.length} fjalë
              </span>
              {exercises.length > 0 && (
                <span className="pill border border-indigo-200 bg-indigo-50 text-indigo-700">
                  {exercises.length} ushtrime
                </span>
              )}
            </div>
          </div>
        </div>
      </AccordionCard>

      {/* ── Section 2: Vocabulary ────────────────────────────────── */}
      <AccordionCard
        open={sections.vocab}
        onToggle={() => toggle('vocab')}
        accent="blue"
        icon={<BookA size={16} className="text-blue-600" />}
        title="Fjalori i kapitullit"
        meta={
          <span className="pill bg-blue-100 text-blue-700 border border-blue-200">
            {vocabulary.length}
          </span>
        }
      >
        <ChapterVocabulary words={vocabulary} />
      </AccordionCard>

      {/* ── Section 3: Dialogues (flashcards) ────────────────────── */}
      <AccordionCard
        open={sections.dialogues}
        onToggle={() => toggle('dialogues')}
        accent="emerald"
        icon={<MessageCircle size={16} className="text-emerald-600" />}
        title="Dialogjet"
        meta={
          <span className="pill bg-emerald-100 text-emerald-700 border border-emerald-200">
            {index + 1}/{dialogues.length}
          </span>
        }
      >
        <div className="p-5 space-y-4">
          {current && (
            <Flashcard
              dialogue={current}
              revealed={revealed}
              onReveal={() => setRevealed(true)}
              onKnown={handleKnown}
              onRetry={handleRetry}
              index={index}
              total={dialogues.length}
            />
          )}

          {/* Manual nav */}
          <div className="flex items-center justify-between">
            <button onClick={goPrev} className="btn-outline">
              <ChevronLeft size={16} /> Para
            </button>
            <div className="flex items-center gap-1">
              {dialogues.map((d, i) => {
                const done = completedDialogues.includes(d.id);
                const active = i === index;
                // Green takes priority over brand when a dialogue is
                // already marked mastered, so progress stays visible
                // even after the reader moves on.
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
            <button onClick={goNext} className="btn-outline">
              {isLast ? 'Nga fillimi' : 'Tjetri'} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </AccordionCard>

      {/* ── Section 4: Exercises (transform drills) ──────────────── */}
      {exercises.length > 0 && (
        <AccordionCard
          open={sections.exercises}
          onToggle={() => toggle('exercises')}
          accent="indigo"
          icon={<PencilLine size={16} className="text-indigo-600" />}
          title="Ushtrime të kapitullit"
          meta={
            <span className="pill bg-indigo-100 text-indigo-700 border border-indigo-200">
              {exerciseIndex + 1}/{exercises.length}
            </span>
          }
        >
          <div className="p-5">
            <TransformExercise
              exercise={exercises[exerciseIndex]}
              index={exerciseIndex}
              total={exercises.length}
              onNext={() =>
                setExerciseIndex((i) =>
                  i + 1 < exercises.length ? i + 1 : 0,
                )
              }
              onPrev={() =>
                setExerciseIndex((i) =>
                  i - 1 >= 0 ? i - 1 : exercises.length - 1,
                )
              }
              onCorrect={markExerciseCompleted}
            />

            {/* Dots navigation — same logic as dialogues, but the
                active-and-unsolved dot picks up the indigo accent of
                the exercises section. */}
            <div className="mt-5 flex items-center justify-center gap-1">
              {exercises.map((ex, i) => {
                const done = completedExercises.includes(ex.id);
                const active = i === exerciseIndex;
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
                    onClick={() => setExerciseIndex(i)}
                    className={`h-2 rounded-full transition-all ${cls}`}
                    aria-label={`Ushtrimi ${i + 1}${done ? ' — i plotësuar' : ''}`}
                    title={done ? 'I plotësuar' : undefined}
                  />
                );
              })}
            </div>
          </div>
        </AccordionCard>
      )}

      {/* ── Section 5: Stories (long-form reading) ───────────────── */}
      {stories.length > 0 && (
        <AccordionCard
          open={sections.stories}
          onToggle={() => toggle('stories')}
          accent="amber"
          icon={<BookOpen size={16} className="text-amber-600" />}
          title="Tregime të kapitullit"
          meta={
            <span className="pill bg-amber-100 text-amber-700 border border-amber-200">
              {stories.length}
            </span>
          }
        >
          <div className="divide-y divide-slate-100">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                showHarakat={showHarakat}
              />
            ))}
          </div>
        </AccordionCard>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// AccordionCard — one reusable collapsible panel used for every
// section on the page. Supports a colored accent gradient for the
// header so each section stays visually distinct.
// ─────────────────────────────────────────────────────────────────────

const ACCENTS: Record<
  'brand' | 'blue' | 'emerald' | 'amber' | 'indigo',
  { from: string; hover: string }
> = {
  brand: { from: 'from-brand-50', hover: 'hover:from-brand-100/70' },
  blue: { from: 'from-blue-50', hover: 'hover:from-blue-100/70' },
  emerald: { from: 'from-emerald-50', hover: 'hover:from-emerald-100/70' },
  amber: { from: 'from-amber-50', hover: 'hover:from-amber-100/70' },
  indigo: { from: 'from-indigo-50', hover: 'hover:from-indigo-100/70' },
};

interface AccordionCardProps {
  open: boolean;
  onToggle: () => void;
  accent: keyof typeof ACCENTS;
  icon: React.ReactNode;
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
}

function AccordionCard({
  open,
  onToggle,
  accent,
  icon,
  title,
  meta,
  children,
}: AccordionCardProps) {
  const a = ACCENTS[accent];
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between gap-3 px-5 py-3 border-b border-slate-100 bg-gradient-to-r ${a.from} to-white ${a.hover} transition-colors`}
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 min-w-0">
          {icon}
          <span className="truncate">{title}</span>
          {meta}
        </div>
        {open ? (
          <ChevronUp size={16} className="text-slate-500 shrink-0" />
        ) : (
          <ChevronDown size={16} className="text-slate-500 shrink-0" />
        )}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}
