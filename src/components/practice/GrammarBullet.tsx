import { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { findGlossaryTerms } from '@/data/grammarGlossary';

interface GrammarBulletProps {
  text: string;
}

/**
 * Renders a single chapter grammar-focus bullet and — if the text
 * mentions a term from the glossary — exposes an info button that
 * expands inline-below with plain-Albanian explanations for every
 * term found in the bullet.
 *
 * We deliberately avoid a floating popover here: inline expansion
 * plays better on mobile and sidesteps z-index / scroll edge cases.
 */
export function GrammarBullet({ text }: GrammarBulletProps) {
  const [open, setOpen] = useState(false);
  const terms = findGlossaryTerms(text);
  const hasInfo = terms.length > 0;

  return (
    <li className="text-sm text-slate-700">
      <div className="flex items-start gap-2">
        <CheckCircle2 size={16} className="text-brand-600 mt-0.5 shrink-0" />
        <span className="flex-1 min-w-0 break-words">{text}</span>
        {hasInfo && (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'Mbyll shpjegimin' : 'Shfaq shpjegimin'}
            title={
              open
                ? 'Mbyll shpjegimin'
                : `Shpjegim: ${terms.map((t) => t.label.split(' ')[0]).join(', ')}`
            }
            className={`shrink-0 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium transition
              ${
                open
                  ? 'bg-brand-600 text-white'
                  : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
              }`}
          >
            <Info size={12} />
            {open ? (
              <ChevronUp size={10} />
            ) : (
              <ChevronDown size={10} />
            )}
          </button>
        )}
      </div>

      {open && hasInfo && (
        <div className="mt-2 ml-6 space-y-2">
          {terms.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border border-brand-200 bg-brand-50/60 px-3 py-2"
            >
              <div className="text-xs font-semibold text-brand-800 mb-1">
                {t.label}
              </div>
              <p className="text-xs leading-relaxed text-slate-700">
                {t.explanation}
              </p>
              {t.example && (
                <div className="mt-1.5 flex items-baseline justify-between gap-3">
                  <span
                    dir="rtl"
                    className="font-amiri text-base text-slate-900"
                  >
                    {t.example.arabic}
                  </span>
                  <span className="text-[11px] text-slate-500 text-right min-w-0 truncate">
                    {t.example.albanian}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </li>
  );
}
