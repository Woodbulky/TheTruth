'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { Verdict } from '@/lib/types';
import { Lumi } from '@/components/lumi/Lumi';
import { VERDICT_META, VerdictChip } from '@/components/verdict/VerdictChip';
import { SectionHead } from './Steps';

const VERDICTS: Verdict[] = ['VERIFIED', 'FALSE', 'OUTDATED', 'PARTLY_SUPPORTED'];

export function VerdictShowcase() {
  const t = STR[useLang()];
  const asking = useRef<HTMLDivElement>(null);
  const askingInView = useInView(asking, { amount: 0.8 });
  return (
    <section id="verdicts" className="mx-auto max-w-6xl scroll-mt-16 px-4 py-20">
      <SectionHead title={t.landing.verdictsTitle} sub={t.landing.verdictsSub} />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VERDICTS.map((v) => <VerdictCardDemo key={v} v={v} />)}
      </ul>
      <div ref={asking} className="mx-auto mt-6 flex max-w-2xl items-center gap-4 rounded-2xl border-2 border-dashed border-truth-lumi bg-truth-lumi/10 p-4">
        <Lumi size={64} asking={askingInView} />
        <p className="text-sm">{t.landing.noVerdict}</p>
      </div>
    </section>
  );
}

function VerdictCardDemo({ v }: { v: Verdict }) {
  const t = STR[useLang()];
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { amount: 0.7 });
  const { color } = VERDICT_META[v];
  return (
    <li
      ref={ref}
      className="flex flex-col items-center rounded-2xl border-t-4 bg-white p-6 text-center shadow-sm dark:bg-truth-dpanel"
      style={{ borderTopColor: color }}
    >
      <Lumi size={112} state={inView ? 'reacting' : 'idle'} mood={v} />
      <div className="mt-4"><VerdictChip verdict={v} size="lg" /></div>
      <p className="mt-3 text-sm">{t.landing.meaning[v]}</p>
      <dl className="mt-4 w-full space-y-1 border-t border-black/5 pt-3 text-xs text-truth-muted dark:border-white/10 dark:text-truth-dmuted">
        {(['en', 'hi', 'mr'] as const).map((l) => (
          <div key={l} className="flex justify-between gap-2">
            <dt>{STR.en.langFull[l]}</dt>
            <dd lang={l} className="font-medium text-truth-text dark:text-truth-dtext">{STR[l].verdict[v]}</dd>
          </div>
        ))}
      </dl>
    </li>
  );
}
