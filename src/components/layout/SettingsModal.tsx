import { CaseSensitive, FileType, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { ProgressDashboard } from '@/components/progress/ProgressDashboard';

// Bundles all "secondary" controls that used to clutter the TopBar
// (harakat / transliteration toggles) and the now-retired Progress
// view into a single, side-loaded modal. Two stacked sections —
// preferences first because they're cheap to scan, full progress
// dashboard second because it's where the user lingers.

interface SettingsModalProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsModal({ open, onClose }: SettingsModalProps) {
  const showHarakat = useStore((s) => s.showHarakat);
  const showTransliteration = useStore((s) => s.showTransliteration);
  const toggleHarakat = useStore((s) => s.toggleHarakat);
  const toggleTransliteration = useStore((s) => s.toggleTransliteration);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:pt-[8vh]">
      <button
        aria-label="Mbylle"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-label="Cilësimet"
        className="relative w-full max-w-3xl card overflow-hidden animate-[fadeSlideDown_180ms_ease-out] motion-reduce:animate-none"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 sticky top-0 bg-white z-10">
          <h2 className="font-semibold text-slate-800">
            Cilësimet & progresi
          </h2>
          <button
            onClick={onClose}
            className="btn-ghost !px-2 !py-1"
            aria-label="Mbyll"
          >
            <X size={18} />
          </button>
        </div>

        <div className="max-h-[80vh] overflow-y-auto scroll-thin">
          {/* ── Preferences ───────────────────────────────────────── */}
          <div className="p-5 border-b border-slate-100">
            <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-3">
              Preferencat
            </div>
            <div className="space-y-2">
              <ToggleRow
                icon={<FileType size={16} />}
                label="Shfaqi harakat (zanoret)"
                description="Shenjat e zanoreve mbi shkronjat arabe — fataha, kasra, etj."
                value={showHarakat}
                onToggle={toggleHarakat}
              />
              <ToggleRow
                icon={<CaseSensitive size={16} />}
                label="Shfaqi transliterimin"
                description="Shqiptimi i fjalëve me shkronja latine, p.sh. *kitāb*."
                value={showTransliteration}
                onToggle={toggleTransliteration}
              />
            </div>
          </div>

          {/* ── Progress dashboard ───────────────────────────────── */}
          <div className="p-5">
            <div className="text-xs uppercase tracking-wide text-slate-400 font-semibold mb-3">
              Progresi yt
            </div>
            <ProgressDashboard />
          </div>
        </div>
      </div>
    </div>
  );
}

function ToggleRow({
  icon,
  label,
  description,
  value,
  onToggle,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 p-3 text-left"
    >
      <div className="shrink-0 w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-800">{label}</div>
        <div className="text-xs text-slate-500 leading-snug">{description}</div>
      </div>
      <span
        className={`shrink-0 inline-flex w-10 h-6 rounded-full p-0.5 transition-colors ${
          value ? 'bg-brand-600' : 'bg-slate-300'
        }`}
        aria-hidden
      >
        <span
          className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
            value ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}
