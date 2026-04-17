import { RELATIVE_PRONOUNS } from '@/data/grammar';
import { useStore } from '@/store/useStore';

/**
 * Relative pronouns (الأَسْمَاء المَوْصُولة) — "që / i cili / e cila".
 * Grouped by number: singular, dual, plural, each row showing the
 * masculine + feminine form side-by-side so the pattern is obvious
 * (e.g. الَّذِي / الَّتِي, الَّذِينَ / اللَّوَاتِي).
 */
export function RelativePronouns() {
  const groups: {
    title: string;
    number: 'singular' | 'dual' | 'plural';
  }[] = [
    { title: 'Njëjës (مُفْرَد)', number: 'singular' },
    { title: 'Dyjës (مُثَنَّى)', number: 'dual' },
    { title: 'Shumës (جَمْع)', number: 'plural' },
  ];

  return (
    <div className="space-y-3 text-sm">
      <p className="text-slate-500 text-xs uppercase tracking-wide">
        Përemrat relativë (الأَسْمَاء المَوْصُولة)
      </p>
      <p className="text-[11px] text-slate-500 leading-snug">
        Lidhin një fjali me emrin: "burri <em>që</em> është në xhami".
        Përputhet me gjininë dhe numrin e emrit të cilit i referohet.
      </p>

      {groups.map((g) => {
        const m = RELATIVE_PRONOUNS.find(
          (r) => r.number === g.number && r.gender === 'M',
        );
        const f = RELATIVE_PRONOUNS.find(
          (r) => r.number === g.number && r.gender === 'F',
        );
        return (
          <div
            key={g.number}
            className="rounded-lg border border-slate-200 overflow-hidden"
          >
            <div className="bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600">
              {g.title}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
              {m && <PronounCell label="Mashkullore" item={m} />}
              {f && <PronounCell label="Femërore" item={f} />}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PronounCell({
  label,
  item,
}: {
  label: string;
  item: (typeof RELATIVE_PRONOUNS)[number];
}) {
  const showTransliteration = useStore((s) => s.showTransliteration);
  return (
    <div className="p-2 space-y-1 min-w-0">
      <div className="text-[10px] uppercase tracking-wide text-slate-400 font-semibold">
        {label}
      </div>
      <div className="flex items-baseline gap-2 flex-wrap" dir="rtl">
        <span className="font-amiri text-lg text-slate-900 leading-[1.6]">
          {item.arabic}
        </span>
        {showTransliteration && (
          <span className="text-[11px] text-slate-500" dir="ltr">
            {item.translit}
          </span>
        )}
      </div>
      <div className="text-[12px] text-slate-600 break-words">
        {item.albanian}
      </div>
      <div className="mt-1 rounded-md bg-slate-50 p-1.5">
        <div
          dir="rtl"
          className="font-amiri text-[15px] text-slate-800 leading-[1.7] break-words"
        >
          {item.example}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5 break-words">
          {item.exampleAl}
        </div>
      </div>
    </div>
  );
}
