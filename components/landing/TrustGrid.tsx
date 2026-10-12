'use client';
import Link from 'next/link';
import { FileSearch, HeartHandshake, Link2, MessageCircle, Phone, Scale } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { Lang } from '@/lib/types';
import healthTip from '@/fixtures/health-tip.json';
import { Lumi } from '@/components/lumi/Lumi';
import { SectionHead } from './Steps';

const REPLIES: Record<Lang, string> = {
  en: healthTip.replyMessage, hi: healthTip.localized.hi.replyMessage, mr: healthTip.localized.mr.replyMessage,
};

/** The same ready-to-paste group reply in all three languages (from the health-tip fixture). */
export function Languages() {
  const t = STR[useLang()];
  return (
    <section id="languages" className="scroll-mt-16 bg-truth-bg/60 py-20 dark:bg-truth-dpanel/40">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHead title={t.landing.langTitle} sub={t.landing.langSub} />
        <ul className="grid gap-4 lg:grid-cols-3">
          {(['en', 'hi', 'mr'] as const).map((l) => (
            <li key={l} className="chat-wallpaper rounded-2xl p-4 shadow-inner">
              <p className="mb-2 text-xs font-semibold tracking-wide text-truth-muted uppercase dark:text-truth-dmuted">{t.langFull[l]}</p>
              <p lang={l} className="rounded-[7.5px] rounded-tr-none bg-truth-out p-3 text-[14.5px] leading-snug shadow-sm dark:bg-truth-dout">
                {REPLIES[l]}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

const TRUST_ICONS = [FileSearch, Link2, Scale, HeartHandshake];

export function TrustGrid() {
  const t = STR[useLang()].landing;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionHead title={t.trustTitle} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {t.trust.map((x, i) => {
          const Icon = TRUST_ICONS[i];
          return (
            <li key={x.title} className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-truth-dpanel">
              <span className="flex size-11 items-center justify-center rounded-xl bg-truth-lumi/25 text-truth-header dark:text-truth-lumi">
                <Icon size={22} aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold">{x.title}</h3>
              <p className="mt-1 text-sm text-truth-muted dark:text-truth-dmuted">{x.body}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export function CtaBand() {
  const t = STR[useLang()];
  return (
    <section className="px-4 pb-20">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 rounded-3xl bg-linear-to-br from-truth-header to-[#0B3B36] p-8 text-center text-white shadow-xl sm:flex-row sm:p-10 sm:text-left">
        <Lumi size={120} />
        <div className="flex-1">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{t.landing.ctaTitle}</h2>
          <p className="mt-2 text-white/80">{t.landing.ctaSub}</p>
        </div>
        <div className="flex flex-col gap-3">
          <Link href="/chat" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-truth-header transition hover:brightness-95"><MessageCircle size={20} aria-hidden /> {t.chatWithLumi}</Link>
          <Link href="/call" className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/40 px-6 py-3 font-semibold text-white transition hover:bg-white/10"><Phone size={20} aria-hidden /> {t.call}</Link>
        </div>
      </div>
    </section>
  );
}
