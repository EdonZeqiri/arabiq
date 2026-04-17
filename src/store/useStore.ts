import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      version: 1,
    },
  ),
);
