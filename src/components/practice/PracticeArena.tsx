import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Brain,
  ChevronLeft,
  ChevronRight,
  Ear,
  Info,
  MessageCircle,
  PencilLine,
  Sparkles,
} from 'lucide-react';
import { getChapter } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { track } from '@/lib/analytics';
import { dueCards, isoToday } from '@/lib/srs';
import { Flashcard } from './Flashcard';
import { StoryCard } from './StoryCard';
import { TransformExercise } from './TransformExercise';
import { AyatSection } from './AyatSection';
import { ActivityCard } from './ActivityCard';
import { SrsReview } from './SrsReview';
import { Dictation } from './Dictation';
import { HeroCard } from './HeroCard';
import { maturityStats } from '@/lib/srs';
import { BookMarked, Flame } from 'lucide-react';

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

type Activity = 'dialogues' | 'exercises' | 'stories' | 'ayat' | 'srs' | 'dictation';

// The hub now has a level *between* "land on chapter" and "open an
// activity": a section page that holds either the daily-retention
// activities (SRS + Dictation) or the chapter activities (Dialogues
// → Exercises → Stories → Ayat). Two reasons we want this drill-down:
//
//   1. Cognitive grouping — the learner thinks in two modes ("review
//      old" vs "advance new"), and the hub should mirror that mental
//      model. A flat 6-card grid forced the learner to re-classify
//      every card on every visit.
//   2. Less density per screen — the previous hub stacked 6 cards +
//      stats + section labels; the section-page split keeps every
//      level to 2–4 cards plus a compact header.
type Section = 'daily' | 'chapter';

const SECTION_LABEL: Record<Section, string> = {
  daily: 'Përditshmëri',
  chapter: 'Kapitulli',
};

export function PracticeArena() {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const markDialogueMastered = useStore((s) => s.markDialogueMastered);
  const markExerciseCompleted = useStore((s) => s.markExerciseCompleted);
  const completedDialogues = useStore((s) => s.completedDialogues);
  const completedExercises = useStore((s) => s.completedExercises);
  const recordSession = useStore((s) => s.recordSession);
  const showHarakat = useStore((s) => s.showHarakat);
  const srs = useStore((s) => s.srs);
  const srsDailyNew = useStore((s) => s.srsDailyNew);
  const srsDailyCap = useStore((s) => s.srsDailyNewCap);
  const streakDays = useStore((s) => s.streakDays);

  const chapter = getChapter(currentChapterId);
  const dialogues = useMemo(() => chapter?.dialogues ?? [], [chapter]);
  const stories = useMemo(() => chapter?.stories ?? [], [chapter]);
  const exercises = useMemo(() => chapter?.exercises ?? [], [chapter]);
  const ayat = useMemo(() => chapter?.ayat ?? [], [chapter]);

  const [section, setSection] = useState<Section | null>(null);
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
    setSection(null);
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

  // SRS counts for the daily-practice strip. `due` is the number of
  // cards across the whole curriculum that are scheduled for today or
  // earlier; `freshLeft` is how many new cards we'll still introduce
  // today before hitting the daily cap.
  const today = isoToday();
  const dueCount = useMemo(() => dueCards(srs, today).length, [srs, today]);
  const freshLeft = useMemo(() => {
    const usedToday = srsDailyNew.date === today ? srsDailyNew.count : 0;
    const capLeft = Math.max(0, srsDailyCap - usedToday);
    if (capLeft > 0) return capLeft;
    // Daily cap exhausted? Fall back to a bonus pool so the SRS card
    // is *always* tappable when there are still un-introduced words
    // sitting in the curriculum. The cap is meant as a recommended
    // pace, not a hard wall — the learner who wants to push deeper
    // should always have cards waiting.
    if (!chapter) return 0;
    const unintroduced = chapter.vocabulary.filter((w) => !srs[w.id]).length;
    return Math.min(unintroduced, 5);
  }, [srsDailyNew, srsDailyCap, today, chapter, srs]);

  // Recommended next activity. Pedagogically, SRS review takes
  // precedence the moment there are ≥5 cards waiting — long-term
  // retention is more valuable than a fresh chapter activity. Below
  // that threshold the chapter funnel resumes (dialogues → exercises
  // → stories → ayat). Stories and ayat have no completion model yet,
  // so they get the badge once the trackable activities are done.
  const recommended = useMemo<Activity | null>(() => {
    if (dueCount >= 5) return 'srs';
    if (dialogues.length > 0 && dialoguesDone < dialogues.length)
      return 'dialogues';
    if (exercises.length > 0 && exercisesDone < exercises.length)
      return 'exercises';
    if (stories.length > 0) return 'stories';
    if (ayat.length > 0) return 'ayat';
    if (dueCount > 0 || freshLeft > 0) return 'srs';
    return null;
  }, [
    dueCount,
    freshLeft,
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

          {active === 'srs' && <SrsReview onExit={leave} />}

          {active === 'dictation' && <Dictation onExit={leave} />}
        </div>
      </div>
    );
  }

  // ── Hub view (default) ────────────────────────────────────────────
  // Build the activity list once so the hero card and the small grid
  // pull from the same source of truth. Each entry carries everything
  // an ActivityCard needs *plus* the wider HeroCard fields (eyebrow,
  // longer pitch). When an activity is `recommended`, we promote it
  // out of the small grid and into the hero slot at the top — so the
  // learner's eye lands on exactly one primary action, not six.
  const stats = maturityStats(srs);
  const activityDefs: Array<{
    id: Activity;
    accent: 'brand' | 'blue' | 'emerald' | 'amber' | 'indigo';
    icon: ReactNode;
    title: string;
    description: string;
    /** Longer pitch shown only when this activity is the hero. */
    heroPitch: string;
    /** Eyebrow on the hero card — explains *why* it's recommended. */
    heroEyebrow: string;
    progress?: string;
    progressRatio?: number;
    done?: boolean;
    disabled: boolean;
  }> = [
    {
      id: 'srs',
      accent: 'brand',
      icon: <Brain size={22} />,
      title: 'Përsëritje',
      description: 'Pak fjalë çdo ditë — kujtesë afatgjatë.',
      heroPitch:
        'Mban gjallë fjalët që ke mësuar. 5–10 minuta çdo ditë mjaftojnë për të mos harruar asgjë.',
      heroEyebrow: dueCount >= 5 ? 'Të afatshme për sot' : 'Bëje çdo ditë',
      progress:
        dueCount > 0
          ? `${dueCount} për sot${freshLeft > 0 ? ` · ${freshLeft} të reja` : ''}`
          : freshLeft > 0
            ? `${freshLeft} fjalë të reja`
            : Object.keys(srs).length > 0
              ? 'Mbaruar për sot ✓'
              : 'Hap kapitullin për të filluar',
      // Stay tappable even when "done": the learner may want to drill
      // bonus reviews, and the SrsReview screen handles the empty
      // queue with its own friendly empty-state.
      disabled: false,
    },
    {
      id: 'dictation',
      accent: 'blue',
      icon: <Ear size={22} />,
      title: 'Diktim',
      description: 'Dëgjo dhe zgjidh kuptimin — pa parë shkrimin.',
      heroPitch:
        'Dëgjo fjalën, zgjidh kuptimin nga 4 mundësi. Stërvit veshin që mëson të dallojë fjalët në shqiptim natyral.',
      heroEyebrow: 'Stërvit veshin',
      progress:
        chapter.vocabulary.length >= 4
          ? `${Math.min(10, chapter.vocabulary.length)} fjalë`
          : 'Pa fjalor',
      disabled: chapter.vocabulary.length < 4,
    },
    {
      id: 'dialogues',
      accent: 'emerald',
      icon: <MessageCircle size={22} />,
      title: 'Dialogjet',
      description: 'Fraza të zakonshme me kontroll shqiptimi.',
      heroPitch:
        'Mëso fraza për biseda të përditshme dhe testo shqiptimin tënd me mikrofonin.',
      heroEyebrow: 'Vazhdo me kapitullin',
      progress:
        dialogues.length > 0
          ? `${dialoguesDone} / ${dialogues.length}`
          : undefined,
      progressRatio:
        dialogues.length > 0 ? dialoguesDone / dialogues.length : 0,
      done: dialogues.length > 0 && dialoguesDone === dialogues.length,
      disabled: dialogues.length === 0,
    },
    {
      id: 'exercises',
      accent: 'indigo',
      icon: <PencilLine size={22} />,
      title: 'Ushtrime',
      description: 'Transformime gjinie, numri dhe kohe.',
      heroPitch:
        'Drilla të shkurtra që forcojnë gramatikën — transformo fjalën nga mashkull në femër, nga njëjësi në shumës, etj.',
      heroEyebrow: 'Forco gramatikën',
      progress:
        exercises.length > 0
          ? `${exercisesDone} / ${exercises.length}`
          : 'Pa ushtrime',
      progressRatio:
        exercises.length > 0 ? exercisesDone / exercises.length : 0,
      done: exercises.length > 0 && exercisesDone === exercises.length,
      disabled: exercises.length === 0,
    },
    {
      id: 'stories',
      accent: 'amber',
      icon: <BookOpen size={22} />,
      title: 'Tregime',
      description: 'Tekste të shkurtra për lexim me zë.',
      heroPitch:
        'Lexo tregime të shkurtra dhe regjistro veten me zë. Praktikë leximi në kontekst të vërtetë.',
      heroEyebrow: 'Lexim me zë',
      progress:
        stories.length > 0
          ? `${stories.length} ${stories.length === 1 ? 'tregim' : 'tregime'}`
          : 'Pa tregime',
      disabled: stories.length === 0,
    },
    {
      id: 'ayat',
      accent: 'emerald',
      // "Iqra" (اقرأ — "Read!") is the very first word revealed of
      // the Qur'an (Surah Al-ʿAlaq 96:1), and the most evocative
      // single-word identifier we could put on this tile. Rendered
      // in Amiri with naskh kerning so the four letters sit
      // calligraphically inside the icon container.
      icon: (
        <span
          aria-hidden
          dir="rtl"
          lang="ar"
          className="font-amiri text-[22px] leading-none font-bold tracking-tight"
        >
          اقرأ
        </span>
      ),
      title: 'Ajete të Kuranit',
      description: 'Vargjet ku kupton fjalët e mësuara.',
      heroPitch:
        'Shih ajetet ku fjalët që sapo ke mësuar shfaqen në Kuran — kuptimi i drejtpërdrejtë i vargjeve.',
      heroEyebrow: 'Lidhje me Kuranin',
      progress:
        ayat.length > 0
          ? `${ayat.length} ${ayat.length === 1 ? 'ajet' : 'ajete'}`
          : 'Pa ajete',
      disabled: ayat.length === 0,
    },
  ];

  // Two-lane hero layout. The hub now picks ONE recommended item per
  // lane: a daily-retention hero (SRS preferred, dictation as fallback)
  // and a chapter-progress hero (the next unfinished chapter activity).
  // Pedagogically this mirrors what a teacher prescribes — "every day
  // you do BOTH": review yesterday's flashcards, then advance in the
  // current chapter. One global "recommended" hid that distinction.
  const dailyHeroId: Activity =
    !activityDefs.find((a) => a.id === 'srs')!.disabled
      ? 'srs'
      : !activityDefs.find((a) => a.id === 'dictation')!.disabled
        ? 'dictation'
        : 'srs';

  // (We used to also resolve a `chapterHeroId` to drive the chapter
  // hero's accent + icon. That coupling is gone — the chapter hero
  // now uses a fixed amber accent and a fixed BookOpen icon so it
  // stays visually distinct from the green daily hero regardless of
  // which sub-activity is up next inside the chapter.)
  const dailyHero = activityDefs.find((a) => a.id === dailyHeroId)!;

  // Section-level summaries — shown on the two heroes. Each
  // summarises the *whole lane* (not a single activity), since the
  // hero now opens a section, not an activity. The eyebrow flips to
  // call out the most pressing thing inside the lane (e.g. "12 të
  // afatshme" for daily when SRS has work waiting).
  const chapterTotal =
    dialogues.length + exercises.length + stories.length + ayat.length;
  const chapterDone =
    dialoguesDone +
    exercisesDone +
    (stories.length > 0 ? stories.length : 0) +
    (ayat.length > 0 ? ayat.length : 0);
  // Stories and ayat have no completion model yet, so the "done"
  // count above counts them as fully done. That's intentional for
  // now — the bar reflects "trackable progress" only.
  const trackableTotal = dialogues.length + exercises.length;
  const trackableDone = dialoguesDone + exercisesDone;

  // Two-line copy per card. Title is the imperative ("do this") —
  // subtitle is the *why* in one sentence. The earlier copy stacked
  // a lane label, an eyebrow, a long description and a meta chip;
  // most of it said the same thing twice. The new model is simpler:
  // tell the learner what the card is for, tell them how long it
  // takes, show the live numbers in the chip.
  const dailySummary: {
    title: string;
    subtitle: ReactNode;
    meta: string;
    bullets: { label: string }[];
  } = {
    title: 'Përsëritja e Ditës',
    subtitle: 'Përforcoji fjalët që ke mësuar me vetëm 15 minuta praktikë.',
    meta:
      dueCount > 0
        ? `${dueCount} për sot${freshLeft > 0 ? ` · ${freshLeft} të reja` : ''}`
        : freshLeft > 0
          ? `${freshLeft} të reja`
          : 'I përditësuar',
    // Peek strip — three concrete things waiting inside the daily
    // lane so the learner sees the *content* of the card, not just
    // the gradient + button.
    bullets: [
      {
        label:
          dueCount > 0
            ? `${dueCount} ${dueCount === 1 ? 'kartë' : 'karta'} për përsëritje`
            : 'Përsëritja e ditës',
      },
      { label: `${freshLeft} fjalë të reja` },
      { label: 'Diktim me 4 mundësi' },
    ],
  };

  // Chapter hero. Title is "Kapitulli {n} — {titleAl}" so the card
  // identifies itself by both number *and* topic at a glance. The
  // subtitle is the chapter's authored summary (a one-line learning
  // outcome, e.g. "Anëtarët e familjes, mbaresat pronëzuese..."), or
  // a counts-based fallback when summary isn't authored yet.
  const chapterSubtitleText =
    chapter.summary ??
    `${chapter.vocabulary.length} fjalë të reja, ${dialogues.length} ${
      dialogues.length === 1 ? 'dialog' : 'dialogje'
    } dhe ${ayat.length} ${ayat.length === 1 ? 'ajet' : 'ajete'}.`;
  const chapterSummary: {
    title: ReactNode;
    subtitle: ReactNode;
    meta: string;
    bullets: { label: string }[];
  } = {
    // Title format: "Kapitulli {n} — {titleAl} ({titleAr})". The
    // Arabic chapter name is wrapped in an inline RTL span so harakat
    // sit correctly above the letters and the Amiri font kicks in
    // without disrupting the surrounding Latin title.
    title: (
      <>
        Kapitulli {chapter.id} — {chapter.titleAl}
        {' ('}
        <span dir="rtl" className="arabic-inline font-amiri">
          {chapter.titleAr}
        </span>
        {')'}
      </>
    ),
    subtitle: chapterSubtitleText,
    meta:
      trackableTotal > 0
        ? `${trackableDone} / ${trackableTotal}`
        : `${chapterTotal} aktivitete`,
    // Peek strip — list every chapter section with its count so the
    // chapter card surfaces "what's inside" at a glance (a learner
    // shouldn't have to drill in just to know whether a chapter has
    // ayat or stories yet).
    bullets: [
      {
        label: `Dialogjet ${dialoguesDone}/${dialogues.length}`,
      },
      {
        label: `Ushtrime ${exercisesDone}/${exercises.length}`,
      },
      {
        label: `${stories.length} ${stories.length === 1 ? 'tregim' : 'tregime'}`,
      },
      {
        label: `${ayat.length} ${ayat.length === 1 ? 'ajet' : 'ajete'}`,
      },
      {
        label: `${chapter.vocabulary.length} fjalë në fjalor`,
      },
    ].filter((b) => !b.label.includes('0/0') && !b.label.startsWith('0 ')),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* The standalone chapter-title header was removed — the Arabic
          and Albanian chapter names now live inside the Kapitulli
          hero's description, where they double as a description of
          what tapping the card opens. A thin chapter-pill remains so
          the learner still sees which chapter (and its grammar focus)
          they're currently working through. Streak / mature / due
          stats moved to the Settings dashboard, which is one tap
          away — the hub itself is now just the two action heroes. */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-brand-700 font-semibold bg-brand-50 border border-brand-100 rounded-full px-2.5 py-0.5">
          <Sparkles size={11} className="text-brand-500" />
          <span>Kap. {chapter.id}</span>
          {chapter.grammarFocus.length > 0 && (
            <GrammarFocusInfo points={chapter.grammarFocus} />
          )}
        </div>
        <div className="flex items-center gap-2 text-xs tabular-nums">
          {streakDays > 0 && (
            <span
              title="Ditë rresht"
              className="inline-flex items-center gap-1 text-amber-700"
            >
              <Flame size={13} className="text-amber-500" />
              {streakDays}
            </span>
          )}
          {stats.mature > 0 && (
            <span
              title="Fjalë të zotëruara"
              className="inline-flex items-center gap-1 text-emerald-700"
            >
              <BookMarked size={13} className="text-emerald-600" />
              {stats.mature}
            </span>
          )}
        </div>
      </div>

      {/* Section view — shows the activities that belong to whichever
          lane the learner just opened. Back button returns to the
          two-hero hub. Renders inline so we don't have to duplicate
          the chapter header above. */}
      {section ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={() => setSection(null)}
              className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft size={16} />
              <span>Kthehu</span>
            </button>
            <span className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
              {SECTION_LABEL[section]}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {activityDefs
              .filter((def) =>
                section === 'daily'
                  ? def.id === 'srs' || def.id === 'dictation'
                  : def.id === 'dialogues' ||
                    def.id === 'exercises' ||
                    def.id === 'stories' ||
                    def.id === 'ayat',
              )
              .map((def) => (
                <ActivityCard
                  key={def.id}
                  accent={def.accent}
                  icon={def.icon}
                  title={def.title}
                  description={def.description}
                  progress={def.progress}
                  progressRatio={def.progressRatio}
                  done={def.done}
                  recommended={def.id === recommended}
                  disabled={def.disabled}
                  onClick={() => enter(def.id)}
                />
              ))}
          </div>
        </section>
      ) : (
        // Hub view — just two heroes, nothing else. The drill-down
        // pattern (open a section to see its activities) keeps each
        // screen to a single, obvious decision.
        <div className="space-y-3 sm:space-y-4">
          {/* Accent pairing: blue daily + brand-green chapter. Blue
              carries the daily-rhythm message — an open, calm sky
              overhead, "do this every morning". Green is the brand
              colour and now anchors the chapter card, where it reads
              as the deeper, more substantive lane (the chapter is
              the *content*; daily is the *habit* on top of it). */}
          <HeroCard
            accent="blue"
            icon={dailyHero.icon}
            title={dailySummary.title}
            subtitle={dailySummary.subtitle}
            meta={dailySummary.meta}
            bullets={dailySummary.bullets}
            onClick={() => setSection('daily')}
          />
          <HeroCard
            accent="brand"
            icon={<BookOpen size={22} />}
            title={chapterSummary.title}
            subtitle={chapterSummary.subtitle}
            meta={chapterSummary.meta}
            bullets={chapterSummary.bullets}
            onClick={() => setSection('chapter')}
          />

          {/* Snapshot panel — anchors the bottom of the hub. Without
              this the page used to feel oddly empty: two heroes and
              a sea of paper below. The panel shows the four numbers
              every learner cares about (streak, mastered, in-flight,
              level), in a single calm row that matches the hero
              corner-radius / shadow language. */}
          <SnapshotPanel
            streak={streakDays}
            mastered={stats.mature}
            active={stats.young + stats.learning}
            chapterId={chapter.id}
          />
        </div>
      )}
    </div>
  );
}

// Per-activity labels used in the back-link header.
const LABEL: Record<Activity, string> = {
  dialogues: 'Dialogjet',
  exercises: 'Ushtrime',
  stories: 'Tregime',
  ayat: 'Ajete të Kuranit',
  srs: 'Përsëritje',
  dictation: 'Diktim',
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
          // Position-strategy: anchor under the icon, but center the
          // popover on its own midpoint. On a wide page that lands it
          // straight below the chip; on a narrow phone it stays
          // visually anchored to the icon without spilling off either
          // edge of the viewport. `max-w-[calc(100vw-1rem)]` is the
          // safety net for the truly narrow screens.
          className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 w-[min(88vw,320px)] max-w-[calc(100vw-1rem)] rounded-xl border border-brand-100 bg-white shadow-xl z-40 p-3 animate-[fadeSlideDown_180ms_ease-out] motion-reduce:animate-none normal-case tracking-normal"
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
// SnapshotPanel — the third surface on the hub, anchoring the bottom
// of the page. Without this the hub felt sparse: two heroes and a
// large empty canvas underneath. The panel shows the four numbers
// every learner cares about — streak, mastered, in-flight words, and
// current level — in a single calm row that mirrors the heroes'
// rounded / shadowed language without competing with them for the
// "primary action" slot.
//
// Why these four metrics:
//   • streak       — habit / consistency anchor
//   • mastered     — long-term progress (interval ≥21d in SM-2)
//   • active       — today's "live load" of cards in study
//   • level        — orienting label (which book, which volume)
// ─────────────────────────────────────────────────────────────────────

function SnapshotPanel({
  streak,
  mastered,
  active,
  chapterId,
}: {
  streak: number;
  mastered: number;
  active: number;
  chapterId: number;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white/70 backdrop-blur-sm shadow-soft px-4 py-4 sm:px-6 sm:py-5">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="text-[11px] uppercase tracking-[0.2em] font-bold text-slate-500">
          Përmbledhja jote
        </div>
        <div className="text-[11px] text-slate-400">
          Bayna Yadayk · Vëllimi 1
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <SnapshotCell
          icon={<Flame size={16} className="text-amber-500" />}
          label="Ditë rresht"
          value={streak}
          tone="amber"
          empty={streak === 0 ? 'Fillo sot' : undefined}
        />
        <SnapshotCell
          icon={<BookMarked size={16} className="text-emerald-600" />}
          label="Të zotëruara"
          value={mastered}
          tone="emerald"
        />
        <SnapshotCell
          icon={<Brain size={16} className="text-blue-500" />}
          label="Në studim"
          value={active}
          tone="blue"
        />
        <SnapshotCell
          icon={<Sparkles size={16} className="text-brand-500" />}
          label="Kapitulli"
          value={chapterId}
          tone="brand"
          suffix={` / 16`}
        />
      </div>
    </div>
  );
}

function SnapshotCell({
  icon,
  label,
  value,
  tone,
  suffix,
  empty,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone: 'amber' | 'emerald' | 'blue' | 'brand';
  suffix?: string;
  empty?: string;
}) {
  // Tone-driven backplate so each cell carries a tiny accent glow
  // matching its icon. Subtle on purpose — the hero cards are the
  // saturated surfaces; this panel sits a half-step quieter.
  const toneBg: Record<typeof tone, string> = {
    amber: 'from-amber-50 to-white',
    emerald: 'from-emerald-50 to-white',
    blue: 'from-blue-50 to-white',
    brand: 'from-brand-50 to-white',
  };
  const toneText: Record<typeof tone, string> = {
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
    blue: 'text-blue-700',
    brand: 'text-brand-700',
  };
  return (
    <div
      className={`rounded-xl border border-slate-200/60 bg-gradient-to-br ${toneBg[tone]} px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-1`}
    >
      <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-wide font-semibold text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      {value === 0 && empty ? (
        <div className="text-sm font-medium text-slate-500 mt-1">{empty}</div>
      ) : (
        <div
          className={`text-2xl sm:text-3xl font-bold tabular-nums leading-none ${toneText[tone]}`}
        >
          {value}
          {suffix && (
            <span className="ml-0.5 text-sm font-medium text-slate-400">
              {suffix}
            </span>
          )}
        </div>
      )}
    </div>
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
