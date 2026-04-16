import { MUDARI_PREFIXES } from '@/data/grammar';

export function CheatSheet() {
  return (
    <div className="space-y-2 text-sm">
      <p className="text-slate-500 text-xs uppercase tracking-wide">
        Parashtesat e muḍāriʿ (e tashmja)
      </p>
      <div className="rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-2 py-1.5 text-right">Prefiks</th>
              <th className="px-2 py-1.5 text-left">Translit.</th>
              <th className="px-2 py-1.5 text-left">Përemri</th>
            </tr>
          </thead>
          <tbody>
            {MUDARI_PREFIXES.map((m) => (
              <tr key={m.translit} className="border-t border-slate-100">
                <td className="px-2 py-1.5 text-right" dir="rtl">
                  <span className="font-amiri text-xl text-brand-700">
                    {m.prefix}
                  </span>
                </td>
                <td className="px-2 py-1.5 font-semibold text-slate-700">
                  {m.translit}
                </td>
                <td className="px-2 py-1.5 text-slate-600">
                  {m.pronoun}{' '}
                  <span className="text-xs text-slate-400">({m.albanian})</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-[11px] leading-snug text-slate-500">
        Shembull: <strong>كَتَبَ</strong> (shkroi) → <strong>أَكْتُبُ</strong>{' '}
        (Unë shkruaj), <strong>نَكْتُبُ</strong> (Ne shkruajmë).
      </p>
    </div>
  );
}
