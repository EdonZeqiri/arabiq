import { useState } from 'react';
import { PronounsTable } from '@/components/grammar/PronounsTable';
import { GrammarCodes } from '@/components/grammar/GrammarCodes';
import { PointingWords } from '@/components/grammar/PointingWords';
import { HarfuJarr } from '@/components/grammar/HarfuJarr';
import { CheatSheet } from '@/components/grammar/CheatSheet';
import { PossessiveSuffixes } from '@/components/grammar/PossessiveSuffixes';
import { RelativePronouns } from '@/components/grammar/RelativePronouns';

type Tab =
  | 'pronouns'
  | 'codes'
  | 'pointers'
  | 'jarr'
  | 'mudari'
  | 'possessive'
  | 'relative';

const TABS: { id: Tab; label: string }[] = [
  { id: 'pronouns', label: 'Përemra' },
  { id: 'possessive', label: 'Pronore' },
  { id: 'relative', label: 'Relativë' },
  { id: 'codes', label: 'Kodet' },
  { id: 'pointers', label: 'Tregues' },
  { id: 'jarr', label: 'Jarr' },
  { id: 'mudari', label: 'Muḍāriʿ' },
];

export function GrammarPanel() {
  const [tab, setTab] = useState<Tab>('pronouns');

  return (
    <aside className="hidden xl:flex flex-col w-[300px] shrink-0 border-l border-slate-200 bg-slate-50/60">
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="text-[11px] uppercase tracking-wider text-slate-500">
          Fletë ndihmëse
        </div>
        <div className="font-semibold text-slate-800">Gramatika (ref.)</div>
      </div>

      <div className="px-2 pt-2 flex flex-wrap gap-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-xs rounded-full px-2.5 py-1 border transition ${
              tab === t.id
                ? 'bg-brand-600 text-white border-brand-600'
                : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto scroll-thin p-3">
        {tab === 'pronouns' && <PronounsTable />}
        {tab === 'possessive' && <PossessiveSuffixes />}
        {tab === 'relative' && <RelativePronouns />}
        {tab === 'codes' && <GrammarCodes />}
        {tab === 'pointers' && <PointingWords />}
        {tab === 'jarr' && <HarfuJarr />}
        {tab === 'mudari' && <CheatSheet />}
      </div>
    </aside>
  );
}
