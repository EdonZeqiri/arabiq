import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  type SrsCard,
  type SrsGrade,
  gradeCard as srsGradeCard,
  newCard as srsNewCard,
  isoToday as srsIsoToday,
} from '@/lib/srs';

export type AppView = 'practice' | 'vocabulary' | 'progress' | 'grammar';

interface AppState {
  // Navigation
  currentChapterId: number;
  currentView: AppView;

  // Progress tracking
  completedDialogues: string[]; // dialogue IDs
  completedExercises: string[]; // transform-exercise IDs passed
  vocabularyMastery: Record<string, number>; // wordId -> 0..5
  chapterNotes: Record<number, string>; // chapterId -> note

  // UI preferences
  showHarakat: boolean;
  showTransliteration: boolean;

  // Stats
  totalPracticeSessions: number;
  lastPracticeDate: string | null;
  streakDays: number;

  // SRS — spaced repetition state. `srs` is the per-word card map;
  // `srsDailyNew` tracks how many *new* cards have been introduced
  // today so we can cap them (default 5/day). Reset lazily when the
  // date rolls over.
  srs: Record<string, SrsCard>;
  srsDailyNew: { date: string; count: number };
  srsDailyNewCap: number;

  // Actions
  setChapter: (id: number) => void;
  setView: (view: AppView) => void;
  markDialogueMastered: (id: string) => void;
  unmarkDialogue: (id: string) => void;
  markExerciseCompleted: (id: string) => void;
  updateVocabMastery: (wordId: string, level: number) => void;
  saveNote: (chapterId: number, note: string) => void;
  toggleHarakat: () => void;
  toggleTransliteration: () => void;
  recordSession: () => void;

  // SRS actions
  introduceSrsCard: (wordId: string) => void;
  gradeSrsCard: (wordId: string, grade: SrsGrade) => void;
  setSrsDailyNewCap: (cap: number) => void;
}

// ISO date helpers (YYYY-MM-DD) used for the streak tracker.
const isoToday = (): string => new Date().toISOString().slice(0, 10);

const daysBetween = (a: string, b: string): number => {
  const da = new Date(a + 'T00:00:00Z').getTime();
  const db = new Date(b + 'T00:00:00Z').getTime();
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
};

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentChapterId: 1,
      currentView: 'practice',

      completedDialogues: [],
      completedExercises: [],
      vocabularyMastery: {},
      chapterNotes: {},

      showHarakat: true,
      showTransliteration: true,

      totalPracticeSessions: 0,
      lastPracticeDate: null,
      streakDays: 0,

      srs: {},
      srsDailyNew: { date: srsIsoToday(), count: 0 },
      srsDailyNewCap: 5,

      setChapter: (id) => set({ currentChapterId: id }),

      setView: (view) => set({ currentView: view }),

      markDialogueMastered: (id) =>
        set((s) =>
          s.completedDialogues.includes(id)
            ? s
            : { completedDialogues: [...s.completedDialogues, id] },
        ),

      unmarkDialogue: (id) =>
        set((s) => ({
          completedDialogues: s.completedDialogues.filter((d) => d !== id),
        })),

      markExerciseCompleted: (id) =>
        set((s) =>
          s.completedExercises.includes(id)
            ? s
            : { completedExercises: [...s.completedExercises, id] },
        ),

      updateVocabMastery: (wordId, level) =>
        set((s) => ({
          vocabularyMastery: {
            ...s.vocabularyMastery,
            [wordId]: Math.max(0, Math.min(5, level)),
          },
        })),

      saveNote: (chapterId, note) =>
        set((s) => ({
          chapterNotes: { ...s.chapterNotes, [chapterId]: note },
        })),

      toggleHarakat: () => set((s) => ({ showHarakat: !s.showHarakat })),

      toggleTransliteration: () =>
        set((s) => ({ showTransliteration: !s.showTransliteration })),

      introduceSrsCard: (wordId) =>
        set((s) => {
          if (s.srs[wordId]) return s;
          const today = srsIsoToday();
          const dailyNew =
            s.srsDailyNew.date === today
              ? s.srsDailyNew
              : { date: today, count: 0 };
          return {
            srs: { ...s.srs, [wordId]: srsNewCard(wordId) },
            srsDailyNew: { date: today, count: dailyNew.count + 1 },
          };
        }),

      gradeSrsCard: (wordId, grade) =>
        set((s) => {
          const existing = s.srs[wordId] ?? srsNewCard(wordId);
          const updated = srsGradeCard(existing, grade);
          return { srs: { ...s.srs, [wordId]: updated } };
        }),

      setSrsDailyNewCap: (cap) =>
        set({ srsDailyNewCap: Math.max(1, Math.min(50, cap)) }),

      recordSession: () =>
        set((s) => {
          const today = isoToday();
          let streak = s.streakDays;

          if (!s.lastPracticeDate) {
            streak = 1;
          } else {
            const delta = daysBetween(s.lastPracticeDate, today);
            if (delta === 0) {
              // same day, keep streak
            } else if (delta === 1) {
              streak = s.streakDays + 1;
            } else {
              streak = 1;
            }
          }

          return {
            totalPracticeSessions: s.totalPracticeSessions + 1,
            lastPracticeDate: today,
            streakDays: streak,
          };
        }),
    }),
    {
      name: 'bayna-yadayk-progress',
      version: 2,
      // Migration v1 → v2 added the SRS fields. Without an explicit
      // merge, Zustand only shallow-overrides keys that exist in the
      // persisted blob — meaning fields added in v2 stay `undefined`
      // and downstream math (e.g. `cap - usedToday`) silently produces
      // NaN. We fill the missing keys with their initial values here.
      migrate: (persisted: unknown, version: number) => {
        const base = (persisted ?? {}) as Partial<AppState>;
        if (version < 2) {
          return {
            ...base,
            srs: base.srs ?? {},
            srsDailyNew: base.srsDailyNew ?? { date: isoToday(), count: 0 },
            srsDailyNewCap: base.srsDailyNewCap ?? 5,
          } as AppState;
        }
        return base as AppState;
      },
      // Defensive: if the user's stored blob *somehow* ends up with
      // missing keys despite the migrate (e.g. a partial sync from an
      // older device), backfill on every rehydrate so the rest of the
      // app never sees `undefined` for these fields.
      merge: (persistedRaw, current) => {
        const persisted = (persistedRaw ?? {}) as Partial<AppState>;
        return {
          ...current,
          ...persisted,
          srs: persisted.srs ?? current.srs,
          srsDailyNew: persisted.srsDailyNew ?? current.srsDailyNew,
          srsDailyNewCap: persisted.srsDailyNewCap ?? current.srsDailyNewCap,
        };
      },
    },
  ),
);
