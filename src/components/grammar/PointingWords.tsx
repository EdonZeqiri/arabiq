import { POINTING_WORDS } from '@/data/grammar';
import type { PointingWord } from '@/data/grammar';
import { useStore } from '@/store/useStore';

/**
 * Pointing words (أَسْمَاءُ الإِشَارَة).
 *
 * The layout groups by distance (afër / larg) and, inside each group,
 * shows a 3×2 matrix: columns = number (njëjës / dyjës / shumës),
 * rows = gender (M / F). The plural row spans both columns because
 * Arabic uses the same form for both genders in the plural.
 */
export function PointingWords() {
  const near = POINTING_WORDS.filter((w) => w.distance === 'near');
  const far = POINTING_WORDS.filter((w) => w.distance === 'far');

  return (
    <div className="space-y-3 text-sm">
      <p className="text-slate-500 text-xs uppercase tracking-wide">
        Emrat tregues (أَسْمَاءُ الإِشَارَة)
      </p>

      <Group title="Afër (قريب) — ky / kjo / këta" words={near} />
      <Group title="Larg (بعيد) — ai / ajo / ata aty" words={far} />
    </div>
  );
}

function Group({ title, words }: { title: string; words: PointingWord[] }) {
  const find = (gender: 'M' | 'F', number: PointingWord['number']) =>
    words.find((w) => w.gender === gender && w.number === number);

  // Plural in Arabic is shared between genders — render it once, centered.
  const pluralWord = words.find((w) => w.number === 'plural');

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
        {title}
      </div>
      <div className="grid grid-cols-[auto_1fr_1fr] text-xs">
        <div className="px-2 py-1.5 text-slate-400 uppercase tracking-wide" />
        <div className="px-2 py-1.5 text-slate-400 uppercase tracking-wide text-center">
          Njëjës
        </div>
        <div className="px-2 py-1.5 text-slate-400 uppercase tracking-wide text-center">
          Dyjës
        </div>

        <RowHeader label="Mashk." />
        <Cell word={find('M', 'singular')} />
        <Cell word={find('M', 'dual')} />

        <RowHeader label="Fem." />
        <Cell word={find('F', 'singular')} />
        <Cell word={find('F', 'dual')} />

        <RowHeader label="Shumës" />
        <div className="col-span-2 px-2 py-2 border-t border-slate-100 flex items-center justify-center">
          {pluralWord ? (
            <Inline word={pluralWord} />
          ) : (
            <span className="text-slate-300">—</span>
          )}
        </div>
      </div>
    </div>
  );
}

function RowHeader({ label }: { label: string }) {
  return (
    <div className="px-2 py-2 border-t border-slate-100 text-[10px] uppercase tracking-wide text-slate-500 font-semibold flex items-center">
      {label}
    </div>
  );
}

function Cell({ word }: { word?: PointingWord }) {
  const showTransliteration = useStore((s) => s.showTransliteration);
  if (!word)
    return (
      <div className="px-2 py-2 border-t border-slate-100 text-slate-300 text-center">
        —
      </div>
    );
  return (
    <div className="px-2 py-2 border-t border-slate-100 text-center min-w-0">
      <div
        dir="rtl"
        className="font-amiri text-lg text-slate-900 leading-[1.6]"
      >
        {word.arabic}
      </div>
      {showTransliteration && (
        <div className="text-[10px] text-slate-500 truncate">
          {word.translit}
        </div>
      )}
      <div className="text-[11px] text-slate-600 break-words">
        {word.albanian}
      </div>
    </div>
  );
}

function Inline({ word }: { word: PointingWord }) {
  const showTransliteration = useStore((s) => s.showTransliteration);
  return (
    <div className="flex flex-col items-center">
      <div
        dir="rtl"
        className="font-amiri text-lg text-slate-900 leading-[1.6]"
      >
        {word.arabic}
      </div>
      <div className="text-[10px] text-slate-500">
        {showTransliteration ? `${word.translit} · ${word.albanian}` : word.albanian}
      </div>
    </div>
  );
}
