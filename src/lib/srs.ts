// Spaced Repetition System (SRS) — SuperMemo SM-2 algorithm.
//
// We use SM-2 with the standard 4-grade Anki-style mapping:
//   "Again" (1) → reset reps, due tomorrow
//   "Hard"  (3) → keep reps, smaller interval, ease drops
//   "Good"  (4) → standard schedule, ease unchanged
//   "Easy"  (5) → bonus interval, ease climbs
//
// Why SM-2 and not FSRS or a custom curve: SM-2 is the algorithm Anki
// shipped with for a decade, it's well understood, predictable, and
// the math is ~30 lines. FSRS is better but requires a stats backend
// and a tuned model; not worth it for a learner with <500 cards.

export type SrsGrade = 1 | 3 | 4 | 5;

export interface SrsCard {
  wordId: string;
  /** SM-2 ease factor. Starts at 2.5, clamped to ≥1.3.
   *  Higher = card scheduled further out for the same grade. */
  ease: number;
  /** Days until next review after the most recent grade. */
  interval: number;
  /** Consecutive successful (grade ≥ 3) reviews. Reset to 0 on lapse. */
  reps: number;
  /** Total times the card has been forgotten (graded "Again"). */
  lapses: number;
  /** ISO date (YYYY-MM-DD) when the card next becomes due. */
  dueDate: string;
  /** ISO date of the last review, or null if never reviewed. */
  lastReview: string | null;
}

const ISO_DAY_MS = 1000 * 60 * 60 * 24;

export const isoToday = (): string =>
  new Date().toISOString().slice(0, 10);

export const addDays = (iso: string, days: number): string => {
  const t = new Date(iso + 'T00:00:00Z').getTime();
  return new Date(t + days * ISO_DAY_MS).toISOString().slice(0, 10);
};

/** Build a fresh card for a word the learner hasn't seen yet. New
 *  cards are due immediately so they appear in today's queue. */
export const newCard = (wordId: string): SrsCard => ({
  wordId,
  ease: 2.5,
  interval: 0,
  reps: 0,
  lapses: 0,
  dueDate: isoToday(),
  lastReview: null,
});

/** Apply a grade to a card and return the updated card. Pure — does
 *  not mutate the input. The interval rules are the textbook SM-2
 *  schedule (1d → 6d → interval × ease). The ease formula is the
 *  classic SM-2 update too, simplified for our 4-grade mapping. */
export function gradeCard(card: SrsCard, grade: SrsGrade): SrsCard {
  const today = isoToday();

  // Lapse: "Again". Drop ease, reset reps, schedule for tomorrow.
  if (grade === 1) {
    const ease = Math.max(1.3, card.ease - 0.2);
    return {
      ...card,
      ease,
      interval: 1,
      reps: 0,
      lapses: card.lapses + 1,
      dueDate: addDays(today, 1),
      lastReview: today,
    };
  }

  // Successful review (grade 3/4/5). Compute new interval.
  let interval: number;
  const reps = card.reps + 1;
  if (reps === 1) {
    interval = 1;
  } else if (reps === 2) {
    interval = grade === 3 ? 3 : 6;
  } else {
    // Hard shrinks interval growth, Easy adds a bonus multiplier.
    const multiplier = grade === 3 ? 1.2 : grade === 4 ? card.ease : card.ease * 1.3;
    interval = Math.max(1, Math.round(card.interval * multiplier));
  }

  // SM-2 ease update — same formula Anki uses, mapped to our 4 grades.
  // Quality q ∈ {3, 4, 5}; ease += 0.1 - (5-q)·(0.08 + (5-q)·0.02)
  const q = grade;
  const easeDelta = 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
  const ease = Math.max(1.3, card.ease + easeDelta);

  return {
    ...card,
    ease,
    interval,
    reps,
    dueDate: addDays(today, interval),
    lastReview: today,
  };
}

/** Filter a card map to only those due today or earlier. */
export function dueCards(
  cards: Record<string, SrsCard>,
  today: string = isoToday(),
): SrsCard[] {
  return Object.values(cards).filter((c) => c.dueDate <= today);
}

/** Build today's session queue: due cards first (oldest due first),
 *  then up to `newCap` brand-new cards drawn from `candidatePool`.
 *  candidatePool is the list of wordIds that COULD become new cards
 *  (typically the current chapter's vocab). */
export function buildSession(
  cards: Record<string, SrsCard>,
  candidatePool: string[],
  newCap: number,
  today: string = isoToday(),
): { due: SrsCard[]; fresh: string[] } {
  const due = dueCards(cards, today).sort((a, b) =>
    a.dueDate < b.dueDate ? -1 : a.dueDate > b.dueDate ? 1 : 0,
  );
  const fresh = candidatePool
    .filter((id) => !cards[id])
    .slice(0, Math.max(0, newCap));
  return { due, fresh };
}

/** Quick mastery proxy for the dashboard: % of cards with interval ≥21d
 *  (the SM-2 graduation threshold for "young" → "mature"). */
export function maturityStats(cards: Record<string, SrsCard>) {
  const all = Object.values(cards);
  if (all.length === 0)
    return { total: 0, mature: 0, young: 0, learning: 0 };
  let mature = 0,
    young = 0,
    learning = 0;
  for (const c of all) {
    if (c.interval >= 21) mature++;
    else if (c.reps >= 1) young++;
    else learning++;
  }
  return { total: all.length, mature, young, learning };
}
