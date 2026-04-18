// Word-level pronunciation diff for the "speak the phrase" drills in
// Flashcard and StoryCard. We take the expected Arabic string and what
// the Web Speech API heard, tokenize both to WordToken pairs, then run
// LCS alignment on the normalized keys. The result is a colorized
// transcript the learner can read at a glance.
//
// This is deliberately coarser than a real pronunciation assessor: ASR
// gives us text, not phonemes, so we can only detect word-level
// substitution / omission / insertion. Good enough for Book 1.

import { tokenizeWords, WordToken } from './arabicText';

export type DiffStatus =
  // Heard exactly the right word.
  | 'correct'
  // Expected this word but ASR skipped it or produced silence here.
  | 'missing'
  // ASR produced a different word in this slot — wrong or mispronounced.
  | 'substituted';

export interface DiffToken {
  /** The expected word as it appears in the source (vocalized form). */
  display: string;
  /** Normalized key from the expected side. */
  key: string;
  status: DiffStatus;
  /** For 'substituted', the word the learner actually said. */
  heard?: string;
}

export interface DiffResult {
  /** One entry per expected word, in order. */
  tokens: DiffToken[];
  /** Words the learner said that had no home in the expected phrase. */
  extras: string[];
  /** Count of tokens with status === 'correct'. */
  correctCount: number;
  /** Total expected tokens. */
  totalCount: number;
  /** correctCount / totalCount, or 0 when expected is empty. */
  accuracy: number;
}

/**
 * Classic LCS table over two token arrays, comparing normalized keys.
 * Returns the backtrace as pairs of indices (i, j) into expected/actual
 * that line up. Runs in O(n*m) time and memory which is fine for the
 * short phrases (<= ~50 words) we run this against.
 */
function lcsPairs(
  expected: WordToken[],
  actual: WordToken[],
): Array<[number, number]> {
  const n = expected.length;
  const m = actual.length;
  if (n === 0 || m === 0) return [];

  // dp[i][j] = LCS length of expected[0..i) vs actual[0..j).
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0),
  );
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (expected[i - 1].key === actual[j - 1].key) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Walk back from (n, m) to collect the aligned pairs. Prefer diagonal
  // moves on ties so substitutions line up slot-for-slot where possible.
  const pairs: Array<[number, number]> = [];
  let i = n;
  let j = m;
  while (i > 0 && j > 0) {
    if (expected[i - 1].key === actual[j - 1].key) {
      pairs.push([i - 1, j - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] >= dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  pairs.reverse();
  return pairs;
}

/**
 * Produce a word-aligned diff of what the learner actually said versus
 * what the phrase asked for. Unmatched expected words become 'missing'
 * if nothing took their slot, or 'substituted' if a heard word sits
 * between the previous and next aligned pair. Surplus heard words that
 * don't fit any slot end up in `extras`.
 */
export function computeDiff(expected: string, actual: string): DiffResult {
  const exp = tokenizeWords(expected);
  const act = tokenizeWords(actual);

  const pairs = lcsPairs(exp, act);

  // Mark correctness per expected index, and which actual indices got
  // consumed as correct matches.
  const matchedActual = new Set<number>();
  const correctAt = new Array(exp.length).fill(false);
  for (const [i, j] of pairs) {
    correctAt[i] = true;
    matchedActual.add(j);
  }

  // Walk the expected sequence, filling gaps between consecutive
  // matches by peeling off unmatched heard words as substitutions. Any
  // heard words that overflow a gap become extras.
  const tokens: DiffToken[] = [];
  const extras: string[] = [];

  // Pointer into `act` tracking the next unmatched heard word we
  // haven't assigned yet.
  let actCursor = 0;

  // Helper: advance actCursor past already-matched indices, collecting
  // up to `limit` unmatched heard words (or all of them if limit is
  // Infinity). Anything we can't consume is left for the next gap.
  const takeUnmatched = (upto: number, limit: number): string[] => {
    const out: string[] = [];
    while (actCursor < upto && out.length < limit) {
      if (!matchedActual.has(actCursor)) {
        out.push(act[actCursor].display);
      }
      actCursor++;
    }
    return out;
  };

  let nextPairIdx = 0;
  for (let i = 0; i < exp.length; i++) {
    if (correctAt[i]) {
      // This expected word aligned with some actual word. Advance the
      // cursor past the matched actual position, spilling any skipped
      // unmatched heard words as extras (they sit before an aligned
      // pair, so they don't belong to any expected slot).
      const pair = pairs[nextPairIdx++];
      const actualIdx = pair[1];
      // Anything in act between actCursor and actualIdx that isn't
      // matched is surplus.
      while (actCursor < actualIdx) {
        if (!matchedActual.has(actCursor)) {
          extras.push(act[actCursor].display);
        }
        actCursor++;
      }
      // Skip the matched index itself.
      actCursor = actualIdx + 1;
      tokens.push({
        display: exp[i].display,
        key: exp[i].key,
        status: 'correct',
      });
      continue;
    }

    // Expected word didn't align. Try to claim one unmatched heard word
    // from before the next matched position (or from the tail if no
    // more matches remain) as a substitution.
    const nextMatchedActual =
      nextPairIdx < pairs.length ? pairs[nextPairIdx][1] : act.length;

    const claimed = takeUnmatched(nextMatchedActual, 1);
    if (claimed.length === 1) {
      tokens.push({
        display: exp[i].display,
        key: exp[i].key,
        status: 'substituted',
        heard: claimed[0],
      });
    } else {
      tokens.push({
        display: exp[i].display,
        key: exp[i].key,
        status: 'missing',
      });
    }
  }

  // Any heard words still sitting past the last match are extras.
  while (actCursor < act.length) {
    if (!matchedActual.has(actCursor)) {
      extras.push(act[actCursor].display);
    }
    actCursor++;
  }

  const correctCount = tokens.filter((t) => t.status === 'correct').length;
  const totalCount = tokens.length;
  const accuracy = totalCount === 0 ? 0 : correctCount / totalCount;

  return { tokens, extras, correctCount, totalCount, accuracy };
}
