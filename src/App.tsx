import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { GrammarDrawer } from '@/components/layout/GrammarPanel';
import {
  RightVocabPanel,
  VocabDrawer,
} from '@/components/layout/RightVocabPanel';
import { SearchModal } from '@/components/layout/SearchModal';
import { SettingsModal } from '@/components/layout/SettingsModal';
import { PracticeArena } from '@/components/practice/PracticeArena';

// Top-level layout. The earlier shell had three persistent sidebars
// (left chapter list, right grammar reference) plus four top-level
// "views" (practice / vocabulary / progress / grammar). The redesign
// collapses that into:
//
//   - TopBar with brand + chapter dropdown + action icons
//   - Main canvas (the chapter "hub" or an active activity)
//   - Right rail dedicated to the chapter's vocabulary (lg+ only)
//   - Modals/drawers for grammar, settings, and global vocab search —
//     surfaces the user enters momentarily and exits back to context
//
// Practice is the only top-level "view" left because vocabulary,
// progress, and grammar are all surfaces the user dips into without
// leaving their place. The dedicated /grammar fallback page is kept
// only as a wide reference for users who want to graze the cheat
// sheets — it is not in the primary nav.

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [grammarDrawerOpen, setGrammarDrawerOpen] = useState(false);
  const [vocabDrawerOpen, setVocabDrawerOpen] = useState(false);
  // The right vocab rail is collapsible on lg+. When collapsed it
  // shrinks to a 44px rail with a vertical "Fjalori" label so the
  // main canvas re-centers and the page breathes. State lives at
  // the top level so we can read it from inside the panel itself.
  const [vocabRailOpen, setVocabRailOpen] = useState(true);

  // ⌘K / Ctrl+K opens the global vocab search from anywhere. We bind
  // at the document level so the shortcut works regardless of where
  // focus is — even inside the dialogue input or the recorder UI.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <TopBar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
        onOpenGrammar={() => setGrammarDrawerOpen(true)}
        onOpenVocab={() => setVocabDrawerOpen(true)}
      />

      <div className="flex-1 min-h-0 flex">
        <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-6">
          <PracticeArena />
        </main>
        {/* Right vocabulary rail — visible only on lg: and up. On
            smaller screens the same content is reachable via the
            VocabDrawer triggered from the TopBar. Grammar reference
            is now drawer-only (entry via TopBar 📘 button), so we
            don't claim a second rail for it. */}
        <RightVocabPanel
          open={vocabRailOpen}
          onToggle={() => setVocabRailOpen((v) => !v)}
        />
      </div>

      {/* Modals & drawers — all controlled from TopBar buttons or
          ⌘K. Mounted at the root so they overlay every layer. */}
      <SearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
      <GrammarDrawer
        open={grammarDrawerOpen}
        onClose={() => setGrammarDrawerOpen(false)}
      />
      <VocabDrawer
        open={vocabDrawerOpen}
        onClose={() => setVocabDrawerOpen(false)}
      />
    </div>
  );
}
