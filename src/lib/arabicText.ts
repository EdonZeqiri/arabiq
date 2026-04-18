// Shared Arabic text utilities — normalization for comparison,
// tokenization for word-level diffing, and sentence splitting for
// breaking up story paragraphs into drillable chunks.
//
// The normalize function is deliberately forgiving: we strip every
// marker a learner or ASR might reasonably omit or inject. Real
// pronunciation assessment is out of scope; what we want here is a
// canonical form that answers "did you say the right word, setting
// aside vocalization".

// Harakat (tashkīl): short vowels, nunation, shadda, sukun, madda,
// hamza marks. Everything in these ranges is a diacritic, not a letter.
const HARAKAT = /[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED\u0670]/g;

// Invisible characters that iOS Arabic keyboards and the Web Speech
// API silently inject: bidi isolates/embeddings/overrides, zero-width
// joiners, BOM, Arabic Letter Mark, and the cosmetic tatweel kashida.
// Leaving any of these in the string breaks literal comparison.
const INVISIBLES =
  /[\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF\u061C\u0640]/g;

/**
 * Reduce Arabic to a bare-consonant canonical form for string compare.
 * Strips harakat, bidi chars, tatweel, and folds alif variants
 * (أ إ آ → ا), alif maqsura (ى → ي), and tā marbūṭa (ة → ه).
 * Also drops punctuation and whitespace.
 */
export function normalizeArabic(s: string): string {
  return s
    .replace(INVISIBLES, '')
    .replace(HARAKAT, '')
    .replace(/[\u0623\u0625\u0622]/g, '\u0627') // أ إ آ → ا
    .replace(/\u0649/g, '\u064A') // ى → ي
    .replace(/\u0629/g, '\u0647') // ة → ه
    .replace(/[\s\u00A0.،,!؟?؛:"'()\-]/g, '')
    .trim();
}

/**
 * Strip only harakat, without folding letter variants or removing
 * whitespace. Useful when you want a bare-consonant DISPLAY form
 * while still preserving the word boundaries and alif spelling.
 */
export function stripHarakat(s: string): string {
  return s.replace(HARAKAT, '');
}

export interface WordToken {
  /** Original form as it appears in the source string, harakat and all. */
  display: string;
  /** Normalized key used for equality comparisons. */
  key: string;
}

/**
 * Split a phrase into word tokens suitable for word-level diffing.
 * Each token keeps its display form (vocalized) alongside a
 * normalized key. Tokens whose key becomes empty after normalization
 * — e.g. pure punctuation — are dropped.
 */
export function tokenizeWords(s: string): WordToken[] {
  return s
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean)
    .map((w) => ({ display: w, key: normalizeArabic(w) }))
    .filter((t) => t.key.length > 0);
}

/**
 * Split an Arabic paragraph into sentences on Arabic and Latin
 * terminators (. ؟ ! ؛). Preserves the terminator with its sentence
 * and trims whitespace. Empty fragments are dropped.
 *
 * Used by StoryCard to break multi-sentence paragraphs into drillable
 * chunks that fit inside a single Web Speech API recognition window.
 */
export function splitSentences(text: string): string[] {
  const out: string[] = [];
  let buf = '';
  for (const ch of text) {
    buf += ch;
    if ('.؟!؛'.includes(ch)) {
      const t = buf.trim();
      if (t) out.push(t);
      buf = '';
    }
  }
  const tail = buf.trim();
  if (tail) out.push(tail);
  return out;
}
