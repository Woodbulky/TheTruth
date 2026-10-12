'use client';
import { BookOpenText, Gavel, MessageSquareText, ScanSearch, Search } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';

export const STEP_ICONS = [BookOpenText, ScanSearch, Search, Gavel, MessageSquareText];

/** Desktop-only (≥1024px) info panel beside the phone column. */
export function SidePanel() {
  const t = STR[useLang()];
  return (
    <aside className="hidden w-[360px] flex-col justify-center gap-6 justify-self-end lg:flex">
      <div>
        <p className="text-4xl font-extrabold tracking-[0.2em] text-truth-header dark:text-truth-accent">The Truth</p>
        <p className="mt-1 text-lg text-truth-muted dark:text-truth-dmuted">{t.tagline}</p>
      </div>
      <section>
        <h2 className="mb-3 text-sm font-semibold tracking-wide uppercase">{t.howLumiChecks}</h2>
        <ol className="space-y-3">
          {t.steps.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={s.title} className="flex gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-truth-accent/15 text-truth-header dark:text-truth-accent">
                  <Icon size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold">{i + 1}. {s.title}</span>
                  <span className="text-sm text-truth-muted dark:text-truth-dmuted">{s.body}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </section>
    </aside>
  );
}
