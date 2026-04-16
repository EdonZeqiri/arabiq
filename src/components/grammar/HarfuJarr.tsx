import { HARFU_JARR } from '@/data/grammar';

export function HarfuJarr() {
  return (
    <div className="space-y-2 text-sm">
      <p className="text-slate-500 text-xs uppercase tracking-wide">
        Parafjalët (حُرُوف الْجَرّ)
      </p>
      <ul className="space-y-1.5">
        {HARFU_JARR.map((h) => (
          <li
            key={h.translit}
            className="rounded-lg border border-slate-200 px-2 py-1.5"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-amiri text-lg" dir="rtl">
                {h.arabic}
              </span>
              <span className="text-xs font-semibold text-slate-600">
                {h.translit} — {h.albanian}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
              <span dir="rtl" className="font-amiri text-sm text-slate-700">
                {h.example}
              </span>
              <span>{h.exampleAl}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
