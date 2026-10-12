'use client';
import { useEffect, useState } from 'react';
import { Mic } from 'lucide-react';
import { demoCheck, fixtureText, sleep } from '@/lib/demo';
import { STR, type FixtureId } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { CheckResult, Verdict } from '@/lib/types';
import { Lumi, type LumiState } from '@/components/lumi/Lumi';
import { ForwardedBubble } from '@/components/chat/ForwardedBubble';
import { StageBubble, TypingBubble, type Stages } from '@/components/chat/StageBubble';
import { VerdictCard } from '@/components/verdict/VerdictCard';

const LOOP: FixtureId[] = ['health-tip', 'scheme-forward', 'old-news', 'verified-news'];

export type LumiPose = { state: LumiState; mood?: Verdict };
type Reply = { kind: 'typing' } | { kind: 'stage'; stages: Stages } | { kind: 'verdict'; result: CheckResult };

/** Looping live demo built from the real chat components + lib/demo.ts fixtures. Decorative (inert). */
export function LiveDemoPhone({ onPose }: { onPose?: (p: LumiPose) => void }) {
  const lang = useLang();
  const t = STR[lang];
  const [fixture, setFixture] = useState<{ id: FixtureId; at: number } | null>(null);
  const [reply, setReply] = useState<Reply | null>(null);
  const [pose, setPose] = useState<LumiPose>({ state: 'idle' });

  useEffect(() => {
    let alive = true;
    const pose = (p: LumiPose) => { setPose(p); onPose?.(p); };
    (async () => {
      for (let i = 0; ; i++) {
        const id = LOOP[i % LOOP.length];
        pose({ state: 'idle' });
        setReply(null);
        setFixture({ id, at: Date.now() });
        await sleep(1200);
        if (!alive) return;
        setReply({ kind: 'typing' });
        pose({ state: 'thinking' });
        await sleep(600);
        let stages: Stages = {};
        for await (const ev of demoCheck(id, lang, 'text')) {
          if (!alive) return;
          if (ev.stage === 'done') {
            setReply({ kind: 'verdict', result: ev.result });
            pose({ state: 'reacting', mood: ev.result.overall });
          } else if (ev.stage !== 'error') {
            stages = { ...stages, [ev.stage]: ev.status };
            setReply({ kind: 'stage', stages });
          }
        }
        await sleep(2200);
        if (!alive) return;
        pose({ state: 'idle' });
        await sleep(4500);
        if (!alive) return;
      }
    })();
    return () => { alive = false; };
  }, [lang, onPose]);

  const status = pose.state === 'thinking' ? t.status.checking : t.status.online;

  return (
    <figure className="relative w-[300px] shrink-0 sm:w-[320px]">
      <figcaption className="sr-only">{t.landing.demoLabel}</figcaption>
      <div inert className="overflow-hidden rounded-[2.6rem] border-[10px] border-[#1F2C33] bg-truth-bg shadow-2xl shadow-truth-header/25 dark:border-[#2A3942] dark:bg-truth-dbg">
        <div className="flex h-14 items-center gap-2 bg-truth-header px-3 text-white dark:bg-truth-dpanel dark:text-truth-dtext">
          <span className="relative">
            <Lumi size={34} state={pose.state} mood={pose.mood} />
            <span className="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-truth-header bg-truth-green dark:border-truth-dpanel" />
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">Lumi</span>
            <span className="block text-[11px] text-white/80 dark:text-truth-dmuted">{status}</span>
          </span>
        </div>
        <div className="chat-wallpaper flex h-[500px] flex-col justify-end overflow-hidden pb-2 text-left">
          {fixture && <ForwardedBubble text={fixtureText(fixture.id)} forwarded label={t.forwarded} tail at={fixture.at} />}
          {reply?.kind === 'typing' && <TypingBubble tail />}
          {reply?.kind === 'stage' && <StageBubble stages={reply.stages} tail />}
          {reply?.kind === 'verdict' && <VerdictCard result={reply.result} tail at={fixture?.at} />}
        </div>
        <div className="flex items-center gap-2 bg-truth-bg px-2 pb-3 dark:bg-truth-dbg">
          <span className="flex-1 truncate rounded-full bg-white px-4 py-2 text-sm text-truth-muted dark:bg-truth-dpanel dark:text-truth-dmuted">{t.placeholder}</span>
          <span className="flex size-10 items-center justify-center rounded-full bg-truth-accent text-white"><Mic size={18} aria-hidden /></span>
        </div>
      </div>
    </figure>
  );
}
