import { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import type { VocabWord } from '@/data/curriculum';
import { CHAPTERS } from '@/data/curriculum';
import { useStore } from '@/store/useStore';

// Global vocabulary search. Replaces the old "Vocabulary" view in the
// main nav — that view forced users to leave their chapter to look
// something up. The modal-style search is reachable from anywhere
// (TopBar 🔍 or ⌘K) and offers a one-shot lookup that returns them
// to where they were.
//
// Match is a simple case-insensitive substring across Arabic surface,
// transliterated (root) form, and Albanian gloss. Results carry the
// chapter ID so a click can deep-link the user there directly.

interface SearchHit {
  word: VocabWord;
  chapterId: number;
  chapterTitle: string;
}

export function SearchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const setChapter = useStore((s) => s.setChapter);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus the input as soon as the modal mounts so the user can
  // start typing immediately. Reset the query on close so the next
  // open is a clean slate.
  useEffect(() => {
    if (open) {
      // Defer one tick — the input isn't in the DOM yet on first open.
      setTimeout(() => inputRef.current?.focus(), 30);
    } else {
      setQuery('');
    }
  }, [open]);

  // Esc to close, ⌘K toggle is wired by the parent.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const hits = useMemo<SearchHit[]>(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 1) return [];
    const out: SearchHit[] = [];
    for (const ch of CHAPTERS) {
      for (const w of ch.vocabulary) {
        if (
          w.arabic.toLowerCase().includes(q) ||
          w.albanian.toLowerCase().includes(q) ||
          w.root.toLowerCase().includes(q)
        ) {
          out.push({ word: w, chapterId: ch.id, chapterTitle: ch.titleAl });
          if (out.length >= 50) break; // hard cap — keeps the UI snappy
        }
      }
      if (out.length >= 50) break;
    }
    return out;
  }, [query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 md:pt-[10vh]">
      <button
        aria-label="Mbylle kërkimin"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
      />
      <div
        role="dialog"
        aria-label="Kërko në fjalor"
        className="relative w-full max-w-2xl card overflow-hidden animate-[fadeSlideDown_180ms_ease-out] motion-reduce:animate-none"
      >
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100">
          <Search size={18} className="text-slate-400" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Kërko çdo fjalë (arabisht, shqip, ose rrënja)..."
            className="flex-1 outline-none text-base placeholder:text-slate-400"
          />
          <button
            onClick={onClose}
            className="btn-ghost !px-2 !py-1"
            aria-label="Mbyll"
          >
            <X size={16} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scroll-thin">
          {query.trim().length === 0 ? (
            <div className="p-6 text-sm text-slate-500 text-center">
              Shkruaj qoftë edhe një shkronjë për të kërkuar nëpër të gjithë
              kapitujt.
            </div>
          ) : hits.length === 0 ? (
            <div className="p-6 text-sm text-slate-500 text-center">
              S'u gjet asnjë rezultat për <strong>"{query}"</strong>.
            </div>
          ) : (
            <ul>
              {hits.map((h) => (
                <li
                  key={`${h.chapterId}-${h.word.id}`}
                  className="border-b border-slate-100 last:border-b-0"
                >
                  <button
                    onClick={() => {
                      setChapter(h.chapterId);
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 text-left"
                  >
                    <span
                      dir="rtl"
                      className="font-amiri text-xl text-slate-900 min-w-[120px] truncate"
                    >
                      {h.word.arabic}
                    </span>
                    <span className="text-sm text-slate-700 flex-1 truncate">
                      {h.word.albanian}
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      Kap. {h.chapterId} · {h.chapterTitle}
                    </span>
                    <ArrowRight size={14} className="text-slate-300" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
