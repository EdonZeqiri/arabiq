import { POSSESSIVE_SUFFIXES } from '@/data/grammar';
import { useStore } from '@/store/useStore';

/**
 * Possessive suffixes (الضَّمَائِر المتَّصِلة) — the 6 small morphemes
 * that attach to the end of a noun to turn "a book" into "my book,
 * your book, his book…". Introduced in CAC Foundation Book p.13 and
 * used constantly in Bayna Yadayk from ch.2 onward.
 *
 * Rendered as a list of stacked rows rather than a wide table so the
 * whole component fits comfortably on mobile. Each row shows the
 * suffix on the right (RTL) and meaning + example on the left.
 */
export function PossessiveSuffixes() {
  const showTransliteration = useStore((s) => s.showTransliteration);

  return (
    <div className="space-y-2 text-sm">
      <p className="text-slate-500 text-xs uppercase tracking-wide">
        Prapashtesat pronore (الضَّمَائِر المُتَّصِلة)
      </p>
      <p className="text-[11px] text-slate-500 leading-snug">
        Këto prapashtesa ngjiten në fund të emrit dhe e bëjnë të caktuar
        (prandaj s'vjen "AL" me ta). Shembulli: كِتَاب → libër.
      </p>
      <ul className="space-y-1.5">
        {POSSESSIVE_SUFFIXES.map((s) => (
          <li
            key={s.translit}
            className="rounded-lg border border-slate-200 px-2.5 py-2"
          >
            <div className="flex items-baseline justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[13px] font-semibold text-slate-700">
                  {s.albanian}
                </div>
                {showTransliteration && (
                  <div className="text-[11px] text-slate-500">
                    {s.translit}
                  </div>
                )}
              </div>
              <span
                dir="rtl"
                className="font-amiri text-xl text-slate-900 shrink-0"
              >
                {s.suffix}
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between gap-3 rounded-md bg-slate-50 px-2 py-1.5">
              <div className="text-[11px] text-slate-500 min-w-0 break-words">
                {s.exampleAl}
              </div>
              <div
                dir="rtl"
                className="font-amiri text-base text-slate-800 leading-[1.7] shrink-0"
              >
                {s.example}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
