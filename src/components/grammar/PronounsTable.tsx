import { PRONOUNS } from '@/data/grammar';

export function PronounsTable() {
  return (
    <div className="space-y-2 text-sm">
      <p className="text-slate-500 text-xs uppercase tracking-wide">
        12 përemra vetorë (الضَّمَائِر)
      </p>
      <div className="overflow-hidden rounded-lg border border-slate-200">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-2 py-1.5">Arabisht</th>
              <th className="px-2 py-1.5">Translit.</th>
              <th className="px-2 py-1.5">Shqip</th>
            </tr>
          </thead>
          <tbody>
            {PRONOUNS.map((p) => (
              <tr
                key={p.translit}
                className="border-t border-slate-100 hover:bg-slate-50"
              >
                <td className="px-2 py-1.5 text-right" dir="rtl">
                  <span className="font-amiri text-lg">{p.arabic}</span>
                </td>
                <td className="px-2 py-1.5 text-slate-700">{p.translit}</td>
                <td className="px-2 py-1.5 text-slate-600">{p.albanian}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
