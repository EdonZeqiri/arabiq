import { BookOpen, Flame, CalendarDays, Target, Sparkles } from 'lucide-react';
import { CHAPTERS } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { ProgressRing } from './ProgressRing';

export function ProgressDashboard() {
  const completedDialogues = useStore((s) => s.completedDialogues);
  const vocabularyMastery = useStore((s) => s.vocabularyMastery);
  const streak = useStore((s) => s.streakDays);
  const lastPracticeDate = useStore((s) => s.lastPracticeDate);
  const totalSessions = useStore((s) => s.totalPracticeSessions);
  const setChapter = useStore((s) => s.setChapter);
  const setView = useStore((s) => s.setView);

  const completedSet = new Set(completedDialogues);

  const perChapter = CHAPTERS.map((c) => {
    const total = c.dialogues.length;
    const done = c.dialogues.filter((d) => completedSet.has(d.id)).length;
    const vocabMastered = c.vocabulary.filter(
      (v) => (vocabularyMastery[v.id] ?? 0) >= 4,
    ).length;
    return {
      id: c.id,
      titleAr: c.titleAr,
      titleAl: c.titleAl,
      total,
      done,
      percent: total ? Math.round((done / total) * 100) : 0,
      vocabMastered,
      vocabTotal: c.vocabulary.length,
    };
  });

  const chaptersStarted = perChapter.filter((c) => c.done > 0).length;
  const totalDialoguesDone = perChapter.reduce((s, c) => s + c.done, 0);
  const totalDialogues = perChapter.reduce((s, c) => s + c.total, 0);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Progresi yt</h1>
        <p className="text-slate-500 text-sm">
          Bayna Yadayk — Libri 1. Të gjitha të dhënat ruhen në pajisjen tënde.
        </p>
      </header>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard
          icon={<BookOpen size={18} />}
          label="Kapituj të nisur"
          value={`${chaptersStarted}/${CHAPTERS.length}`}
          tone="emerald"
        />
        <KpiCard
          icon={<Target size={18} />}
          label="Dialogë të mësuar"
          value={`${totalDialoguesDone}/${totalDialogues}`}
          tone="blue"
        />
        <KpiCard
          icon={<Flame size={18} />}
          label="Ditë rresht"
          value={`${streak}`}
          tone="orange"
        />
        <KpiCard
          icon={<CalendarDays size={18} />}
          label="Seanca në total"
          value={`${totalSessions}`}
          tone="purple"
          footnote={lastPracticeDate ? `I fundit: ${lastPracticeDate}` : 'Asnjë ende'}
        />
      </div>

      {/* Per-chapter grid */}
      <section>
        <h2 className="text-sm font-semibold uppercase text-slate-500 tracking-wide mb-3">
          Kapitujt
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {perChapter.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setChapter(c.id);
                setView('practice');
              }}
              className="card p-4 text-left hover:border-brand-300 hover:shadow-lg transition group"
            >
              <div className="flex items-start gap-3">
                <ProgressRing
                  progress={c.percent}
                  size={52}
                  stroke={5}
                  label={`${c.percent}%`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs font-semibold text-brand-600">
                      Kap. {c.id}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {c.done}/{c.total} dialogë
                    </span>
                  </div>
                  <div className="font-amiri text-lg text-slate-800" dir="rtl">
                    {c.titleAr}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {c.titleAl}
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-slate-500">
                    <Sparkles size={12} className="text-amber-500" />
                    Fjalor: {c.vocabMastered}/{c.vocabTotal}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  tone,
  footnote,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tone: 'emerald' | 'blue' | 'orange' | 'purple';
  footnote?: string;
}) {
  const tones: Record<typeof tone, string> = {
    emerald: 'bg-emerald-50 text-emerald-700',
    blue: 'bg-blue-50 text-blue-700',
    orange: 'bg-orange-50 text-orange-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <div className="card p-4">
      <div className={`inline-flex items-center justify-center rounded-lg p-2 ${tones[tone]}`}>
        {icon}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-800">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
      {footnote && (
        <div className="text-[10px] text-slate-400 mt-1">{footnote}</div>
      )}
    </div>
  );
}
