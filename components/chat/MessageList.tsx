'use client';
import { useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { FIXTURE_IDS } from '@/lib/demo';
import { STR, type FixtureId } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { CheckResult, InputType } from '@/lib/types';
import { Lumi } from '@/components/lumi/Lumi';
import { VerdictCard } from '@/components/verdict/VerdictCard';
import { Bubble } from './Bubble';
import { ForwardedBubble } from './ForwardedBubble';
import { ImageBubble } from './ImageBubble';
import { LinkBubble } from './LinkBubble';
import { PdfBubble } from './PdfBubble';
import { StageBubble, TypingBubble, type Stages } from './StageBubble';
import { VoiceNoteBubble } from './VoiceNoteBubble';

export type Msg = { id: string; at: number } & (
  | { from: 'user'; kind: InputType; text: string; forwarded?: boolean; label?: string; sub?: string }
  | { from: 'lumi'; kind: 'typing' }
  | { from: 'lumi'; kind: 'stage'; stages: Stages }
  | { from: 'lumi'; kind: 'verdict'; result: CheckResult }
  | { from: 'lumi'; kind: 'more' }
);

export type MoreAction = 'paste' | 'screenshot' | 'link';

export function MessageList({ msgs, busy, onDemo, onMore }: {
  msgs: Msg[]; busy: boolean; onDemo: (id: FixtureId) => void; onMore: (a: MoreAction) => void;
}) {
  const t = STR[useLang()];
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll only the log itself (scrollIntoView would also scroll the page, e.g. /demo frames).
    const log = end.current?.parentElement;
    const smooth = !matchMedia('(prefers-reduced-motion: reduce)').matches;
    log?.scrollTo({ top: log.scrollHeight, behavior: smooth ? 'smooth' : 'auto' });
  }, [msgs]);

  return (
    <div role="log" aria-live="polite" aria-relevant="additions" className="chat-wallpaper flex-1 overflow-y-auto pt-3 pb-2">
      {/* Welcome: static so it renders identically on server and client */}
      <div className="mb-3 flex flex-col items-center gap-2 px-6 text-center">
        <Lumi size={96} />
        <span className="rounded-md bg-[#FFEECD] px-3 py-1 text-xs text-satya-text dark:bg-satya-dpanel dark:text-satya-dmuted">
          {t.tagline}
        </span>
      </div>
      <Bubble side="in" tail>
        <p>{t.welcome}</p>
        <p className="mt-3 mb-1 flex items-center gap-1 text-xs font-semibold text-satya-header dark:text-satya-accent">
          <Sparkles size={14} aria-hidden /> {t.tryDemo}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FIXTURE_IDS.map((id) => (
            <Chip key={id} disabled={busy} onClick={() => onDemo(id)}>{t.fixtureChips[id]}</Chip>
          ))}
        </div>
      </Bubble>

      {msgs.map((m, i) => {
        const tail = (i ? msgs[i - 1].from : 'lumi') !== m.from; // welcome bubble above is Lumi's
        if (m.from === 'user') {
          switch (m.kind) {
            case 'image': return <ImageBubble key={m.id} text={m.text} label={t.screenshot} tail={tail} at={m.at} />;
            case 'audio': return <VoiceNoteBubble key={m.id} duration={m.sub ?? ''} playLabel={t.playVoiceNote} tail={tail} at={m.at} />;
            case 'pdf': return <PdfBubble key={m.id} name={m.label ?? ''} pages={t.pages(Number(m.sub))} tail={tail} at={m.at} />;
            case 'url': return <LinkBubble key={m.id} url={m.sub ?? ''} title={m.label ?? ''} tail={tail} at={m.at} />;
            default: return <ForwardedBubble key={m.id} text={m.text} forwarded={m.forwarded} label={t.forwarded} tail={tail} at={m.at} />;
          }
        }
        switch (m.kind) {
          case 'typing': return <TypingBubble key={m.id} tail={tail} />;
          case 'stage': return <StageBubble key={m.id} stages={m.stages} tail={tail} />;
          case 'verdict': return <VerdictCard key={m.id} result={m.result} tail={tail} at={m.at} />;
          case 'more':
            return (
              <Bubble key={m.id} side="in" tail={tail} at={m.at}>
                <p>{t.moreInfo}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(['paste', 'screenshot', 'link'] as const).map((a) => (
                    <Chip key={a} disabled={busy} onClick={() => onMore(a)}>{t.moreChips[a]}</Chip>
                  ))}
                </div>
              </Bubble>
            );
        }
      })}
      <div ref={end} />
    </div>
  );
}

function Chip({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...p}
      className="rounded-full border border-satya-accent/40 bg-satya-accent/8 px-3 py-1 text-[13px] font-medium text-satya-header hover:bg-satya-accent/15 disabled:opacity-50 dark:text-satya-accent"
    >
      {children}
    </button>
  );
}
