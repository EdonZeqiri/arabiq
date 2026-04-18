import { useState } from 'react';
import { ExternalLink, Sparkles } from 'lucide-react';
import type { ChapterAyah } from '@/data/curriculum';

// Quran.com deep-link — clicking the reference pill opens the ayah
// in its canonical online Mus·haf with recitation + tafsir. We use
// this rather than embedding our own text-critical apparatus because
// (a) Quran.com is authoritative and familiar to Albanian readers,
// and (b) this keeps us out of the business of rendering scripture
// ourselves beyond a single, hand-curated verse.
const quranComUrl = (ref: string): string => {
  const [surah, ayah] = ref.split(':');
  return `https://quran.com/${surah}/${ayah}`;
};

interface HighlightChunk {
  text: string;
  known?: { gloss: string };
}

/**
 * Walk the verse text and split it into alternating plain + known
 * chunks based on the `knownWords` surface-form matches. We scan
 * longest-first so a surface like الْأَسْمَاءَ doesn't accidentally get
 * pre-empted by a shorter prefix. Each known surface is matched as
 * many times as it occurs — أَنَا in Taha 20:14 appears twice.
 *
 * Matching is purely textual on the already-vocalized Arabic; we do
 * NOT normalize here because the verse text is authoritative and the
 * curator must supply `surface` values that are literal substrings.
 */
function splitAyah(
  arabic: string,
  known: ChapterAyah['knownWords'],
): HighlightChunk[] {
  if (known.length === 0) return [{ text: arabic }];

  // Sort surfaces by length descending so we prefer the longest match
  // at each position. Ties don't matter — a verse won't have two
  // known surfaces of the same length overlapping in practice.
  const sorted = [...known].sort((a, b) => b.surface.length - a.surface.length);

  const chunks: HighlightChunk[] = [];
  let i = 0;
  outer: while (i < arabic.length) {
    for (const k of sorted) {
      if (
        k.surface.length > 0 &&
        arabic.startsWith(k.surface, i)
      ) {
        chunks.push({ text: k.surface, known: { gloss: k.gloss } });
        i += k.surface.length;
        continue outer;
      }
    }
    // Nothing matched at this position — accumulate plain text until
    // the next known surface (or end of string). We coalesce runs of
    // plain characters into a single chunk so the rendered output
    // stays tidy.
    const last = chunks[chunks.length - 1];
    if (last && !last.known) {
      last.text += arabic[i];
    } else {
      chunks.push({ text: arabic[i] });
    }
    i++;
  }
  return chunks;
}

interface AyatSectionProps {
  ayat: ChapterAyah[];
}

export function AyatSection({ ayat }: AyatSectionProps) {
  // Track which ayah has its gloss list expanded. We keep it closed
  // by default — the visual highlight already conveys the "you know
  // this word" signal; the gloss table is a secondary affordance.
  const [openGloss, setOpenGloss] = useState<string | null>(null);

  if (ayat.length === 0) {
    return (
      <p className="text-sm text-slate-500">
        Ajete për këtë kapitull do të shtohen së shpejti.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {/* Motivational lead-in — this is the whole point of the section.
          The tone here matters: we want the student to feel that the
          doors of Qur'anic reading are already cracking open. */}
      <div className="flex items-start gap-2 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-xs text-amber-800">
        <Sparkles size={14} className="mt-0.5 shrink-0" />
        <span>
          Me fjalët që ke mësuar deri tani, mund të njohësh tashmë pjesë
          nga Kurani. Fjalët e theksuara janë ato që i di nga ky kapitull
          ose më parë.
        </span>
      </div>

      {ayat.map((a) => {
        const chunks = splitAyah(a.arabic, a.knownWords);
        const isOpen = openGloss === a.reference;
        return (
          <article
            key={a.reference}
            className="rounded-xl border border-slate-200 bg-white p-4 space-y-3"
          >
            {/* Header: surah + reference link */}
            <header className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-semibold text-slate-800">
                  {a.surahNameAl}
                </span>
                <span
                  dir="rtl"
                  className="font-amiri text-sm text-slate-500"
                >
                  {a.surahNameAr}
                </span>
              </div>
              <a
                href={quranComUrl(a.reference)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-brand-700 hover:text-brand-800 hover:underline underline-offset-2"
                title="Hape në Quran.com"
              >
                {a.reference} <ExternalLink size={11} />
              </a>
            </header>

            {/* Verse text with word-level highlighting. We render each
                chunk as an inline span so text-flow and line-wrapping
                stay native to the browser's Arabic shaper. */}
            <p
              dir="rtl"
              className="font-amiri text-2xl md:text-[28px] text-slate-900 leading-loose text-right"
            >
              {chunks.map((c, i) =>
                c.known ? (
                  <span
                    key={i}
                    className="text-emerald-700 bg-emerald-50 rounded px-1"
                    title={c.known.gloss}
                  >
                    {c.text}
                  </span>
                ) : (
                  <span key={i}>{c.text}</span>
                ),
              )}
            </p>

            {/* Albanian translation */}
            <p className="text-sm text-slate-700 leading-relaxed border-r-2 border-slate-200 pr-3">
              {a.albanian}
            </p>

            {/* Known-words summary: how many, which ones.
                Collapsed by default; click to expand. This is what
                converts the abstract highlight into a concrete
                "progress" moment — "I know THESE specific words". */}
            <div>
              <button
                onClick={() =>
                  setOpenGloss(isOpen ? null : a.reference)
                }
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-medium inline-flex items-center gap-1"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {a.knownWords.length}{' '}
                {a.knownWords.length === 1 ? 'fjalë' : 'fjalë'} që i njeh
                {isOpen ? ' ▾' : ' ▸'}
              </button>
              {isOpen && (
                <ul className="mt-2 space-y-1 text-xs">
                  {a.knownWords.map((w, i) => (
                    <li
                      key={i}
                      className="flex items-baseline justify-between gap-3 rounded-md bg-slate-50 px-2 py-1"
                    >
                      <span
                        dir="rtl"
                        className="font-amiri text-lg text-emerald-700"
                      >
                        {w.surface}
                      </span>
                      <span className="text-slate-600">{w.gloss}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
