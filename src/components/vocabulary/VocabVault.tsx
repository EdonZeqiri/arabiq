import { useMemo, useState } from 'react';
import { Filter, Search } from 'lucide-react';
import { CHAPTERS, type VocabWord } from '@/data/curriculum';
import { useStore } from '@/store/useStore';
import { WordCard } from './WordCard';

type ChapterFilter = 'current' | 'all' | number;
type TypeFilter = 'all' | VocabWord['type'];

export function VocabVault() {
  const currentChapterId = useStore((s) => s.currentChapterId);
  const [chapterFilter, setChapterFilter] = useState<ChapterFilter>('current');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [search, setSearch] = useState('');

  const words = useMemo(() => {
    let pool: { word: VocabWord; chapterId: number }[] = [];
    if (chapterFilter === 'all') {
      pool = CHAPTERS.flatMap((c) =>
        c.vocabulary.map((w) => ({ word: w, chapterId: c.id })),
      );
    } else {
      const id = chapterFilter === 'current' ? currentChapterId : chapterFilter;
      const c = CHAPTERS.find((x) => x.id === id);
      pool = (c?.vocabulary ?? []).map((w) => ({ word: w, chapterId: id }));
    }

    return pool.filter(({ word }) => {
      if (typeFilter !== 'all' && word.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !word.albanian.toLowerCase().includes(q) &&
          !word.arabic.includes(search) &&
          !word.root.includes(search)
        )
          return false;
      }
      return true;
    });
  }, [chapterFilter, currentChapterId, typeFilter, search]);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Fjalori</h1>
          <p className="text-slate-500 text-sm">
            Të gjitha fjalët nga libri. Filtro sipas kapitullit ose tipit.
          </p>
        </div>
        <div className="text-xs text-slate-500">{words.length} fjalë</div>
      </header>

      {/* Filters */}
      <div className="card p-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 min-w-[220px] flex-1">
          <Search size={14} className="text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kërko në shqip, arabisht ose rrënjë…"
            className="w-full text-sm outline-none bg-transparent placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400" />
          <select
            value={String(chapterFilter)}
            onChange={(e) => {
              const v = e.target.value;
              if (v === 'all' || v === 'current') setChapterFilter(v);
              else setChapterFilter(Number(v));
            }}
            className="text-sm rounded-md border border-slate-200 px-2 py-1 bg-white"
          >
            <option value="current">Kapitulli aktual</option>
            <option value="all">Të gjithë kapitujt</option>
            {CHAPTERS.map((c) => (
              <option key={c.id} value={c.id}>
                Kap. {c.id} — {c.titleAl}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
            className="text-sm rounded-md border border-slate-200 px-2 py-1 bg-white"
          >
            <option value="all">Të gjitha tipet</option>
            <option value="noun">Emra</option>
            <option value="verb">Folje</option>
            <option value="adjective">Mbiemra</option>
            <option value="particle">Parafjalë</option>
          </select>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {words.map(({ word, chapterId }) => (
          <WordCard
            key={`${chapterId}-${word.id}`}
            word={word}
            chapterLabel={chapterFilter === 'all' ? `Kap. ${chapterId}` : undefined}
          />
        ))}
        {words.length === 0 && (
          <div className="card p-6 text-center text-sm text-slate-500 col-span-full">
            Asnjë fjalë nuk përputhet me filtrat.
          </div>
        )}
      </div>
    </div>
  );
}
