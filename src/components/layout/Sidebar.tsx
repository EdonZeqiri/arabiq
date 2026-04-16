import { useMemo } from 'react';
import {
  BookOpen,
  GraduationCap,
  BarChart3,
  Library,
  X,
} from 'lucide-react';
import { CHAPTERS } from '@/data/curriculum';
import { useStore, type AppView } from '@/store/useStore';
import { ProgressRing } from '@/components/progress/ProgressRing';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const currentView = useStore((s) => s.currentView);
  const completedDialogues = useStore((s) => s.completedDialogues);
  const setChapter = useStore((s) => s.setChapter);
  const setView = useStore((s) => s.setView);

  const perChapter = useMemo(() => {
    const set = new Set(completedDialogues);
    return CHAPTERS.map((c) => {
      const total = c.dialogues.length || 1;
      const done = c.dialogues.filter((d) => set.has(d.id)).length;
      return { id: c.id, percent: Math.round((done / total) * 100) };
    });
  }, [completedDialogues]);

  const navItems: { view: AppView; label: string; icon: React.ReactNode }[] = [
    { view: 'practice', label: 'Praktikë', icon: <GraduationCap size={16} /> },
    { view: 'vocabulary', label: 'Fjalori', icon: <Library size={16} /> },
    { view: 'progress', label: 'Progresi', icon: <BarChart3 size={16} /> },
    { view: 'grammar', label: 'Gramatika', icon: <BookOpen size={16} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed z-50 inset-y-0 left-0 w-[260px] bg-slate-900 text-white flex flex-col
          transform transition-transform duration-200
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:static md:translate-x-0`}
      >
        {/* Header */}
        <div className="px-4 py-4 flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="font-amiri text-2xl leading-none" dir="rtl">
              بَيْنَ يَدَيْكَ
            </div>
            <div className="text-[11px] text-slate-400 mt-1 tracking-wide uppercase">
              Arabiq · Libri 1
            </div>
          </div>
          <button
            className="md:hidden text-slate-400 hover:text-white"
            onClick={onCloseMobile}
            aria-label="Mbyll menunë"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav icons */}
        <nav className="px-2 pt-3 pb-2 grid grid-cols-2 gap-1">
          {navItems.map((n) => {
            const active = currentView === n.view;
            return (
              <button
                key={n.view}
                onClick={() => {
                  setView(n.view);
                  onCloseMobile();
                }}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition ${
                  active
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {n.icon}
                <span>{n.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Chapter list */}
        <div className="px-3 pt-2 text-[11px] uppercase tracking-wider text-slate-500">
          Kapitujt
        </div>
        <ul className="flex-1 overflow-y-auto scroll-thin px-2 pb-4 space-y-0.5">
          {CHAPTERS.map((c) => {
            const active = c.id === currentChapterId;
            const percent = perChapter.find((p) => p.id === c.id)?.percent ?? 0;
            return (
              <li key={c.id}>
                <button
                  onClick={() => {
                    setChapter(c.id);
                    setView('practice');
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 rounded-lg px-2 py-2 text-left transition ${
                    active
                      ? 'bg-slate-800 border border-brand-500/40'
                      : 'hover:bg-slate-800/60 border border-transparent'
                  }`}
                >
                  <ProgressRing
                    progress={percent}
                    size={34}
                    stroke={3}
                    color="#34d399"
                    trackColor="rgba(255,255,255,0.12)"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-brand-400">
                        {c.id.toString().padStart(2, '0')}
                      </span>
                      <span className="font-amiri text-base truncate" dir="rtl">
                        {c.titleAr}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {c.titleAl}
                    </div>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="px-4 py-3 border-t border-slate-800 text-[10px] text-slate-500">
          v0.1 · Offline PWA
        </div>
      </aside>
    </>
  );
}
