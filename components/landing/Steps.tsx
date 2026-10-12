'use client';
import { FileText, Image as ImageIcon, Link as LinkIcon, MessageSquareText, Mic } from 'lucide-react';
import type { ReactNode } from 'react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import { STEP_ICONS } from '@/components/chat/SidePanel';

export function SectionHead({ title, sub, children }: { title: string; sub?: string; children?: ReactNode }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <h2 className="text-3xl font-extrabold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {sub && <p className="mt-3 text-lg text-satya-muted text-pretty dark:text-satya-dmuted">{sub}</p>}
      {children}
    </div>
  );
}

const INPUTS = [
  ['text', MessageSquareText], ['image', ImageIcon], ['audio', Mic], ['pdf', FileText], ['url', LinkIcon],
] as const;

/** "What you can forward": text · screenshot · voice note · PDF · link. */
export function ForwardTypes() {
  const t = STR[useLang()].landing;
  return (
    <section className="mx-auto max-w-6xl px-4 py-20">
      <SectionHead title={t.forwardTitle} sub={t.forwardSub} />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {INPUTS.map(([k, Icon], i) => (
          <li key={k} className={`rounded-2xl border border-black/5 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-satya-dpanel ${i === 4 ? 'col-span-2 sm:col-span-1' : ''}`}>
            <span className="flex size-11 items-center justify-center rounded-xl bg-satya-out text-satya-header dark:bg-satya-dout dark:text-satya-dtext">
              <Icon size={22} aria-hidden />
            </span>
            <h3 className="mt-4 font-semibold">{t.inputs[k].title}</h3>
            <p className="mt-1 text-sm text-satya-muted dark:text-satya-dmuted">{t.inputs[k].body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** How Lumi checks: Read → Find claims → Search → Judge → Explain. */
export function Steps() {
  const t = STR[useLang()];
  return (
    <section id="how" className="scroll-mt-16 bg-satya-bg/60 py-20 dark:bg-satya-dpanel/40">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHead title={t.howLumiChecks} sub={t.landing.howSub} />
        <ol className="relative grid gap-6 lg:grid-cols-5 lg:gap-4">
          <span aria-hidden className="absolute top-7 right-[10%] left-[10%] hidden h-0.5 bg-linear-to-r from-satya-accent via-satya-lumi to-satya-lumi-deep lg:block" />
          {t.steps.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <li key={s.title} className="relative flex gap-4 lg:flex-col lg:items-center lg:text-center">
                <span className="relative flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-satya-header shadow-md ring-4 ring-satya-bg dark:bg-satya-dpanel dark:text-satya-accent dark:ring-satya-dbg">
                  <Icon size={24} aria-hidden />
                  <span className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-satya-accent text-xs font-bold text-white">{i + 1}</span>
                </span>
                <span>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="mt-1 text-sm text-satya-muted dark:text-satya-dmuted">{s.body}</p>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
