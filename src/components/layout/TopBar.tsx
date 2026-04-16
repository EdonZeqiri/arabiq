import { Menu, Eye, EyeOff, Languages, FileType } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { getChapter } from '@/data/curriculum';

interface TopBarProps {
  onToggleMobileSidebar: () => void;
}

export function TopBar({ onToggleMobileSidebar }: TopBarProps) {
  const showHarakat = useStore((s) => s.showHarakat);
  const showTransliteration = useStore((s) => s.showTransliteration);
  const toggleHarakat = useStore((s) => s.toggleHarakat);
  const toggleTransliteration = useStore((s) => s.toggleTransliteration);
  const currentChapterId = useStore((s) => s.currentChapterId);

  const chapter = getChapter(currentChapterId);

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/90 backdrop-blur border-b border-slate-200 px-4 py-2">
      <button
        className="md:hidden btn-ghost !px-2"
        onClick={onToggleMobileSidebar}
        aria-label="Hap menunë"
      >
        <Menu size={20} />
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span className="font-amiri text-base text-slate-700" dir="rtl">
            بَيْنَ يَدَيْكَ
          </span>
          <span>·</span>
          <span>Kap. {currentChapterId}</span>
        </div>
        <div className="truncate text-sm font-semibold text-slate-800">
          {chapter ? `${chapter.titleAl}` : 'Bayna Yadayk — Libri 1'}
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={toggleHarakat}
          className={`btn-ghost !px-2 !py-1 text-xs ${
            showHarakat ? 'text-brand-700' : 'text-slate-500'
          }`}
          title="Harakat on/off"
        >
          <FileType size={14} />
          <span className="hidden sm:inline">حَرَكَات</span>
          {showHarakat ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
        <button
          onClick={toggleTransliteration}
          className={`btn-ghost !px-2 !py-1 text-xs ${
            showTransliteration ? 'text-brand-700' : 'text-slate-500'
          }`}
          title="Transliterimi on/off"
        >
          <Languages size={14} />
          <span className="hidden sm:inline">Translit.</span>
          {showTransliteration ? <Eye size={12} /> : <EyeOff size={12} />}
        </button>
      </div>
    </header>
  );
}
