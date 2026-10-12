'use client';
import { useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, Moon, Phone, Sun } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { nextLang, setDark, setLang, useDark, useLang } from '@/lib/prefs';
import { LANG_SHORT } from '@/components/chat/ChatHeader';
import { Lumi } from '@/components/lumi/Lumi';
import { VerdictChip } from '@/components/verdict/VerdictChip';
import { LiveDemoPhone, type LumiPose } from './LiveDemoPhone';

export const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-full bg-truth-accent px-6 py-3 font-semibold text-white shadow-lg shadow-truth-accent/25 transition hover:brightness-95';
export const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-full border-2 border-truth-accent/40 px-6 py-3 font-semibold text-truth-header transition hover:bg-truth-accent/10 dark:text-truth-accent';

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <Lumi size={34} />
      <span className="text-xl font-extrabold tracking-[0.18em] text-truth-header dark:text-truth-accent">The Truth</span>
    </span>
  );
}

export function Nav() {
  const lang = useLang();
  const dark = useDark();
  const t = STR[lang];
  const pill = 'rounded-full px-3 py-1.5 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10';
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/80 backdrop-blur-md dark:border-white/10 dark:bg-truth-dbg/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4">
        <Link href="/" aria-label="The Truth" className="mr-auto rounded-full"><Wordmark /></Link>
        <a href="#how" className={`hidden md:block ${pill}`}>{t.landing.nav.how}</a>
        <a href="#verdicts" className={`hidden md:block ${pill}`}>{t.landing.nav.verdicts}</a>
        <a href="#languages" className={`hidden md:block ${pill}`}>{t.landing.nav.languages}</a>
        <button
          onClick={() => setLang(nextLang(lang))}
          aria-label={`${t.language}: ${t.langFull[lang]}`}
          className="min-w-11 rounded-full border border-truth-accent/40 px-2 py-1 text-xs font-semibold text-truth-header hover:bg-truth-accent/10 dark:text-truth-accent"
        >
          {LANG_SHORT[lang]}
        </button>
        <button onClick={() => setDark(!dark)} aria-label={dark ? t.landing.lightMode : t.darkMode} className="rounded-full p-2 hover:bg-black/5 dark:hover:bg-white/10">
          {dark ? <Sun size={18} aria-hidden /> : <Moon size={18} aria-hidden />}
        </button>
        <Link href="/chat" className="inline-flex items-center gap-1.5 rounded-full bg-truth-accent px-3 py-2 text-sm font-semibold text-white hover:brightness-95 sm:px-4">
          <MessageCircle size={16} aria-hidden />
          <span className="sr-only sm:not-sr-only">{t.chatWithLumi}</span>
        </Link>
      </nav>
    </header>
  );
}

export function Hero() {
  const t = STR[useLang()];
  const [pose, setPose] = useState<LumiPose>({ state: 'idle' });
  const bubble = pose.state === 'thinking' ? t.status.checking : pose.mood ? pose.mood : t.landing.lumiSays;

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="chat-wallpaper absolute inset-0 opacity-60" />
      <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_20%,rgb(255_209_102/0.35),transparent),radial-gradient(50%_60%_at_10%_90%,rgb(6_214_160/0.18),transparent)]" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 pt-12 pb-16 lg:grid-cols-[1fr_auto] lg:pt-20 lg:pb-24">
        <div className="text-center lg:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-truth-header shadow-sm dark:bg-truth-dpanel dark:text-truth-accent">
            <span className="size-2 rounded-full bg-truth-green" aria-hidden /> {t.landing.eyebrow}
          </p>
          <h1 className="mt-5 text-4xl leading-[1.1] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t.heroLine}
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-truth-muted text-pretty lg:mx-0 dark:text-truth-dmuted">{t.landing.sub}</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link href="/chat" className={btnPrimary}><MessageCircle size={20} aria-hidden /> {t.chatWithLumi}</Link>
            <Link href="/call" className={btnGhost}><Phone size={20} aria-hidden /> {t.call}</Link>
          </div>
          <p className="mt-6 text-sm text-truth-muted dark:text-truth-dmuted">English · हिंदी · मराठी</p>
        </div>

        <div className="relative flex items-end justify-center gap-2">
          <div className="relative hidden w-[220px] sm:block xl:w-[340px] [&>svg]:h-auto [&>svg]:w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={bubble}
                aria-hidden
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-2xl rounded-bl-sm bg-white px-3 py-1.5 text-sm font-medium shadow-lg dark:bg-truth-dpanel"
              >
                {pose.mood && pose.state === 'reacting' ? <VerdictChip verdict={pose.mood} size="sm" /> : bubble}
              </motion.div>
            </AnimatePresence>
            <Lumi size={340} state={pose.state} mood={pose.mood} />
          </div>
          <LiveDemoPhone onPose={setPose} />
        </div>
      </div>
    </section>
  );
}
