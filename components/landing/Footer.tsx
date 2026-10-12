'use client';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import { Wordmark } from './Hero';

export function Footer() {
  const t = STR[useLang()];
  return (
    <footer className="border-t border-black/5 bg-white dark:border-white/10 dark:bg-satya-dbg">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Wordmark />
          <p className="mt-2 text-sm text-satya-muted dark:text-satya-dmuted">{t.tagline}</p>
        </div>
        <div className="text-sm sm:text-right">
          <p className="font-semibold">Hack On Track 2026 · PS3 “Is This Forward True”</p>
          <p className="mt-1 text-satya-muted dark:text-satya-dmuted">
            {t.landing.builtBy} Harsh Kasliwal, Kashish Mathur, Kartik Kokate
          </p>
        </div>
      </div>
      <p className="mx-auto max-w-6xl border-t border-black/5 px-4 py-5 text-xs text-satya-muted dark:border-white/10 dark:text-satya-dmuted">
        {t.landing.disclaimer}
      </p>
    </footer>
  );
}
