'use client';
import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, EllipsisVertical, Moon, Phone, Sparkles, Trash2 } from 'lucide-react';
import { FIXTURE_IDS } from '@/lib/demo';
import { STR, type FixtureId } from '@/lib/i18n';
import { nextLang, setDark, setLang, useDark, useLang } from '@/lib/prefs';
import type { Verdict } from '@/lib/types';
import { Lumi, type LumiState } from '@/components/lumi/Lumi';
import { useDismiss } from '@/components/ui/useDismiss';

export const LANG_SHORT = { en: 'EN', hi: 'हिं', mr: 'मरा' } as const;

export function ChatHeader({ lumi, mood, asking, busy, onDemo, onClear }: {
  lumi: LumiState; mood?: Verdict; asking?: boolean; busy: boolean; onDemo: (id: FixtureId) => void; onClear: () => void;
}) {
  const lang = useLang();
  const dark = useDark();
  const t = STR[lang];
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, menu);

  const status = lumi === 'thinking' ? t.status.checking : lumi === 'speaking' ? t.status.speaking : t.status.online;
  const item = 'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-black/5 disabled:opacity-50 dark:hover:bg-white/5';

  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center gap-1 bg-satya-header px-1 text-white dark:bg-satya-dpanel dark:text-satya-dtext">
      <Link href="/" aria-label={t.back} className="rounded-full p-2 hover:bg-white/10">
        <ArrowLeft size={22} aria-hidden />
      </Link>
      <span className="relative">
        <Lumi size={36} state={lumi} mood={mood} asking={asking} />
        <span aria-hidden className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-satya-header bg-satya-green dark:border-satya-dpanel" />
      </span>
      <div className="ml-2 min-w-0 flex-1 leading-tight">
        <h1 className="text-base font-semibold">Lumi</h1>
        <p aria-live="polite" className="truncate text-xs text-white/80 dark:text-satya-dmuted">{status}</p>
      </div>
      <Link href="/call" aria-label={t.call} className="rounded-full p-2 hover:bg-white/10">
        <Phone size={20} aria-hidden />
      </Link>
      <button
        onClick={() => setLang(nextLang(lang))}
        aria-label={`${t.language}: ${t.langFull[lang]}`}
        className="min-w-11 rounded-full border border-white/40 px-2 py-0.5 text-xs font-semibold hover:bg-white/10"
      >
        {LANG_SHORT[lang]}
      </button>
      <div ref={menu} className="relative">
        <button onClick={() => setOpen(!open)} aria-label={t.menu} aria-expanded={open} aria-haspopup="true" className="rounded-full p-2 hover:bg-white/10">
          <EllipsisVertical size={20} aria-hidden />
        </button>
        {open && (
          <div className="absolute top-full right-1 mt-1 w-60 overflow-hidden rounded-lg bg-white py-1 text-satya-text shadow-xl dark:bg-satya-dpanel dark:text-satya-dtext">
            <p className="px-4 pt-1.5 pb-1 text-xs font-semibold text-satya-muted dark:text-satya-dmuted">{t.demoForwards}</p>
            {FIXTURE_IDS.map((id) => (
              <button key={id} disabled={busy} className={item} onClick={() => { close(); onDemo(id); }}>
                <Sparkles size={16} className="text-satya-accent" aria-hidden /> {t.fixtureChips[id]}
              </button>
            ))}
            <hr className="my-1 border-black/8 dark:border-white/10" />
            <button role="switch" aria-checked={dark} className={item} onClick={() => setDark(!dark)}>
              <Moon size={16} aria-hidden /> <span className="flex-1">{t.darkMode}</span>
              <span className={`h-5 w-9 rounded-full p-0.5 transition-colors ${dark ? 'bg-satya-accent' : 'bg-black/20'}`}>
                <span className={`block size-4 rounded-full bg-white transition-transform ${dark ? 'translate-x-4' : ''}`} />
              </span>
            </button>
            <button className={item} onClick={() => { close(); onClear(); }}>
              <Trash2 size={16} aria-hidden /> {t.clearChat}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
