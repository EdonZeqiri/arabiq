import { useState } from 'react';
import { BookText, X } from 'lucide-react';
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

// Inner content shared between the desktop sidebar and the mobile
// drawer. Splitting this out keeps the cheat-sheet logic in one
// place — when we add a new grammar tab, both surfaces pick it up
// automatically.
function GrammarPanelContent() {
  const [tab, setTab] = useState<Tab>('pronouns');

  return (
    <>
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
    </>
  );
}

/**
 * Desktop right-sidebar variant. Visible from xl: (1280px) up — same
 * breakpoint as before so existing layouts keep working.
 */
export function GrammarPanel() {
  return (
    <aside className="hidden xl:flex flex-col w-[300px] shrink-0 border-l border-slate-200 bg-slate-50/60">
      <div className="px-4 py-3 border-b border-slate-200">
        <div className="text-[11px] uppercase tracking-wider text-slate-500">
          Fletë ndihmëse
        </div>
        <div className="font-semibold text-slate-800">Gramatika (ref.)</div>
      </div>
      <GrammarPanelContent />
    </aside>
  );
}

/**
 * Mobile / tablet drawer variant. Triggered by a floating button so
 * grammar reference is one tap away even on phones, where the
 * permanent sidebar is hidden. Slides up from the right edge with a
 * dimmed scrim behind it.
 */
export function GrammarDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <div
      // The drawer is always mounted so its open/close transitions
      // animate cleanly. `pointer-events-none` when closed keeps it
      // out of the tab order and click target.
      className={`xl:hidden fixed inset-0 z-40 transition-opacity duration-200 ${
        open ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      {/* Scrim */}
      <button
        aria-label="Mbylle gramatikën"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40"
      />
      {/* Sheet */}
      <aside
        role="dialog"
        aria-label="Gramatika (referencë)"
        className={`absolute right-0 top-0 h-full w-[88%] max-w-[360px] bg-slate-50 border-l border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              Fletë ndihmëse
            </div>
            <div className="font-semibold text-slate-800">Gramatika (ref.)</div>
          </div>
          <button
            onClick={onClose}
            className="btn-ghost !px-2 !py-1"
            aria-label="Mbyll"
          >
            <X size={18} />
          </button>
        </div>
        <GrammarPanelContent />
      </aside>
    </div>
  );
}

/**
 * Floating action button that opens the GrammarDrawer. Anchored
 * bottom-right with thumb-reach in mind. Hidden on xl: where the
 * sidebar version is always visible.
 */
export function GrammarFab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="xl:hidden fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-brand-600 hover:bg-brand-700 text-white shadow-lg shadow-brand-600/30 px-4 py-3 text-sm font-semibold transition-all active:scale-95"
      aria-label="Hap gramatikën"
    >
      <BookText size={16} />
      <span className="hidden sm:inline">Gramatika</span>
    </button>
  );
}
