import { useState } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/TopBar';
import { GrammarPanel } from '@/components/layout/GrammarPanel';
import { PracticeArena } from '@/components/practice/PracticeArena';
import { VocabVault } from '@/components/vocabulary/VocabVault';
import { ProgressDashboard } from '@/components/progress/ProgressDashboard';
import { PronounsTable } from '@/components/grammar/PronounsTable';
import { GrammarCodes } from '@/components/grammar/GrammarCodes';
import { PointingWords } from '@/components/grammar/PointingWords';
import { HarfuJarr } from '@/components/grammar/HarfuJarr';
import { CheatSheet } from '@/components/grammar/CheatSheet';
import { PossessiveSuffixes } from '@/components/grammar/PossessiveSuffixes';
import { RelativePronouns } from '@/components/grammar/RelativePronouns';
import { useStore } from '@/store/useStore';

function GrammarView() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">
          Gramatika — referencë e plotë
        </h1>
        <p className="text-slate-500 text-sm">
          Paneli i djathtë mbahet i hapur gjithmonë; kjo faqe është një pasqyrë
          e zgjeruar e të gjitha kartelave.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <section className="card p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Përemrat</h2>
          <PronounsTable />
        </section>
        <section className="card p-4">
          <h2 className="font-semibold text-slate-800 mb-3">
            Prapashtesat pronore
          </h2>
          <PossessiveSuffixes />
        </section>
        <section className="card p-4 lg:col-span-2">
          <h2 className="font-semibold text-slate-800 mb-3">
            Përemrat relativë
          </h2>
          <RelativePronouns />
        </section>
        <section className="card p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Emrat tregues</h2>
          <PointingWords />
        </section>
        <section className="card p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Kodet</h2>
          <GrammarCodes />
        </section>
        <section className="card p-4">
          <h2 className="font-semibold text-slate-800 mb-3">Parafjalët (Jarr)</h2>
          <HarfuJarr />
        </section>
        <section className="card p-4 lg:col-span-2">
          <h2 className="font-semibold text-slate-800 mb-3">Muḍāriʿ (E tashmja)</h2>
          <CheatSheet />
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const view = useStore((s) => s.currentView);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-full flex">
      <Sidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onToggleMobileSidebar={() => setMobileOpen((v) => !v)} />
        <div className="flex-1 min-h-0 flex">
          <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6">
            {view === 'practice' && <PracticeArena />}
            {view === 'vocabulary' && <VocabVault />}
            {view === 'progress' && <ProgressDashboard />}
            {view === 'grammar' && <GrammarView />}
          </main>
          <GrammarPanel />
        </div>
      </div>
    </div>
  );
}
