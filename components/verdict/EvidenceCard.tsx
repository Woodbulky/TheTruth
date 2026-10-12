'use client';
import { ExternalLink } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { Evidence } from '@/lib/types';

const TIER_STYLE: Record<Evidence['tier'], string> = {
  A: 'bg-[#1FA855]/15 text-[#137a3c] dark:text-[#5fd68f]',
  B: 'bg-[#0b84c6]/15 text-[#0a6aa0] dark:text-[#6cc4f2]',
  C: 'bg-black/8 text-truth-text dark:bg-white/10 dark:text-truth-dtext',
  D: 'bg-black/5 text-truth-muted dark:bg-white/5 dark:text-truth-dmuted',
};

export function EvidenceCard({ e }: { e: Evidence }) {
  const lang = useLang();
  const t = STR[lang];
  const date =
    e.publishedAt &&
    new Date(e.publishedAt).toLocaleDateString(`${lang}-IN`, { day: 'numeric', month: 'short', year: 'numeric' });
  return (
    <li className="rounded-lg border border-black/8 p-3 dark:border-white/10">
      <div className="flex items-center gap-2">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center rounded-full bg-truth-accent/15 font-semibold text-truth-header dark:text-truth-accent"
        >
          {e.publisher.charAt(0)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium">{e.publisher}</span>
          {date && (
            <span className="text-xs text-truth-muted dark:text-truth-dmuted">
              {t.published} {date}
            </span>
          )}
        </span>
        <span className={`rounded px-1.5 py-0.5 text-[11px] font-semibold ${TIER_STYLE[e.tier]}`}>
          {e.tier} · {t.tiers[e.tier]}
        </span>
      </div>
      <p className="mt-2 text-sm font-medium">{e.title}</p>
      <p className="mt-1 text-sm text-truth-muted dark:text-truth-dmuted">“{e.excerpt}”</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="rounded-full border border-black/10 px-2 py-0.5 text-xs dark:border-white/15">
          {t.relations[e.relation]}
        </span>
        {e.url !== '#' && (
          <a
            href={e.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium text-truth-header dark:text-truth-accent"
          >
            {t.openSource} <ExternalLink size={12} aria-hidden />
          </a>
        )}
      </div>
    </li>
  );
}
