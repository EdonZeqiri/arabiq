import { POINTING_WORDS } from '@/data/grammar';

export function PointingWords() {
  const near = POINTING_WORDS.filter((w) => w.distance === 'near');
  const far = POINTING_WORDS.filter((w) => w.distance === 'far');

  return (
    <div className="space-y-3 text-sm">
      <p className="text-slate-500 text-xs uppercase tracking-wide">
        Emrat tregues (أَسْمَاءُ الإِشَارَة)
      </p>

      <Group title="Afër (قريب)" words={near} />
      <Group title="Larg (بعيد)" words={far} />
    </div>
  );
}

function Group({
  title,
  words,
}: {
  title: string;
  words: typeof POINTING_WORDS;
}) {
  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
        {title}
      </div>
      <ul>
        {words.map((w) => (
          <li
            key={w.translit}
            className="grid grid-cols-[auto_1fr_auto] items-center gap-2 px-2 py-1.5 border-t border-slate-100"
          >
            <span className="font-amiri text-lg" dir="rtl">
              {w.arabic}
            </span>
            <span className="text-slate-700">{w.translit}</span>
            <span className="text-xs text-slate-500">
              {w.albanian} · {w.gender}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
