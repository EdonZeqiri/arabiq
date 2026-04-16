import { GRAMMAR_CODES, type GrammarCode } from '@/data/grammar';

const COLOR_MAP: Record<GrammarCode['color'], string> = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-green-50 text-green-700 border-green-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  orange: 'bg-orange-50 text-orange-700 border-orange-200',
  teal: 'bg-teal-50 text-teal-700 border-teal-200',
  red: 'bg-red-50 text-red-700 border-red-200',
  gray: 'bg-slate-50 text-slate-700 border-slate-200',
};

export function GrammarCodes() {
  return (
    <div className="space-y-2">
      <p className="text-slate-500 text-xs uppercase tracking-wide">
        Kodet e gramatikës
      </p>
      <ul className="space-y-1.5">
        {GRAMMAR_CODES.map((g) => (
          <li
            key={g.code}
            className={`rounded-lg border px-2 py-1.5 text-sm ${COLOR_MAP[g.color]}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-amiri text-base" dir="rtl">
                {g.term}
              </span>
              <span className="pill bg-white/70 text-[10px] font-bold tracking-wide">
                {g.code}
              </span>
            </div>
            <div className="mt-0.5 text-xs opacity-80">
              <strong>{g.albanian}</strong> — {g.desc}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
