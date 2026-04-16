import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Target } from 'lucide-react';
import { getChapter } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { Flashcard } from './Flashcard';
import { StoryCard } from './StoryCard';

export function PracticeArena() {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const markDialogueMastered = useStore((s) => s.markDialogueMastered);
  const recordSession = useStore((s) => s.recordSession);
  const showHarakat = useStore((s) => s.showHarakat);

  const chapter = getChapter(currentChapterId);
  const dialogues = useMemo(() => chapter?.dialogues ?? [], [chapter]);
  const stories = useMemo(() => chapter?.stories ?? [], [chapter]);

  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [storyOpen, setStoryOpen] = useState(true);
  const [goalsOpen, setGoalsOpen] = useState(true);

  // Reset whenever the chapter changes.
  useEffect(() => {
    setIndex(0);
    setRevealed(false);
    setSessionStarted(false);
    setStoryOpen(true);
    setGoalsOpen(true);
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
      {/* Chapter header */}
      <div className="min-w-0">
        <div className="text-xs uppercase tracking-wide text-brand-600 font-semibold">
          Kapitulli {chapter.id}
        </div>
        <h1
          dir="rtl"
          className="font-amiri text-3xl md:text-4xl text-slate-900 leading-tight"
        >
          {chapter.titleAr}
        </h1>
        <div className="text-sm text-slate-500">{chapter.titleAl}</div>
      </div>

      {/* "What you'll learn" — structured learning goals card */}
      <div className="card overflow-hidden">
        <button
          onClick={() => setGoalsOpen((o) => !o)}
          className="w-full flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-white hover:from-brand-100/70 transition-colors"
        >
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Target size={16} className="text-brand-600" />
            Çfarë do të mësojmë në këtë kapitull
          </div>
          {goalsOpen ? (
            <ChevronUp size={16} className="text-slate-500" />
          ) : (
            <ChevronDown size={16} className="text-slate-500" />
          )}
        </button>
        {goalsOpen && (
          <div className="p-5 grid gap-3 sm:grid-cols-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-2">
                Pika gramatikore
              </div>
              <ul className="space-y-2">
                {chapter.grammarFocus.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-sm text-slate-700">
                    <CheckCircle2 size={16} className="text-brand-600 mt-0.5 shrink-0" />
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-2 content-start">
              <div className="w-full text-xs uppercase tracking-wide text-slate-400 font-semibold mb-1">
                Përmbajtja
              </div>
              <span className="pill border border-slate-200 bg-slate-50 text-slate-600">
                {dialogues.length} dialogje
              </span>
              {stories.length > 0 && (
                <span className="pill border border-amber-200 bg-amber-50 text-amber-700">
                  {stories.length} {stories.length === 1 ? 'tregim' : 'tregime'}
                </span>
              )}
              <span className="pill border border-slate-200 bg-slate-50 text-slate-600">
                {chapter.vocabulary.length} fjalë
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Flashcard */}
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
          {dialogues.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setIndex(i);
                setRevealed(false);
              }}
              className={`h-2 rounded-full transition-all ${
                i === index
                  ? 'bg-brand-600 w-6'
                  : 'bg-slate-300 w-2 hover:bg-slate-400'
              }`}
              aria-label={`Dialogu ${i + 1}`}
            />
          ))}
        </div>
        <button onClick={goNext} className="btn-outline">
          {isLast ? 'Nga fillimi' : 'Tjetri'} <ChevronRight size={16} />
        </button>
      </div>

      {/* Stories (paragraph-style reading practice) — placed after the
          dialogue flashcards so the user practices short phrases first,
          then reads a longer connected text. */}
      {stories.length > 0 && (
        <div className="card overflow-hidden">
          <button
            onClick={() => setStoryOpen((o) => !o)}
            className="w-full flex items-center justify-between px-5 py-3 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white hover:from-amber-100/70 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <BookOpen size={16} className="text-amber-600" />
              Tregime të kapitullit
              <span className="pill bg-amber-100 text-amber-700 border border-amber-200">
                {stories.length}
              </span>
            </div>
            {storyOpen ? (
              <ChevronUp size={16} className="text-slate-500" />
            ) : (
              <ChevronDown size={16} className="text-slate-500" />
            )}
          </button>
          {storyOpen && (
            <div className="divide-y divide-slate-100">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  showHarakat={showHarakat}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
