'use client';
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';
import { toPng } from 'html-to-image';
import { Download } from 'lucide-react';
import { fixtureResult, fixtureText } from '@/lib/demo';
import type { FixtureId } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { Verdict } from '@/lib/types';
import { Lumi, type LumiState } from '@/components/lumi/Lumi';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { ChatInput } from '@/components/chat/ChatInput';
import { MessageList, type Msg } from '@/components/chat/MessageList';
import { CallScreen } from '@/components/call/CallScreen';
import { ClaimSheet } from '@/components/verdict/ClaimSheet';
import { ReplyComposer } from '@/components/verdict/ReplyComposer';
import { InlineSheets } from '@/components/ui/Sheet';

const AT = Date.parse('2026-10-12T10:30:00+05:30');
const noop = () => {};
const VERDICT_SHOTS: [Exclude<FixtureId, 'unclear-forward'>, Verdict][] = [
  ['verified-news', 'VERIFIED'], ['health-tip', 'FALSE'], ['old-news', 'OUTDATED'], ['scheme-forward', 'PARTLY_SUPPORTED'],
];

// false during SSR + hydration, true after: frames show local times, so render them client-only.
const useMounted = () => useSyncExternalStore(() => noop, () => true, () => false);

/** /demo: every app state in a 390×844 phone frame, each downloadable as PNG for the PPT. */
export function Gallery() {
  const lang = useLang();
  const mounted = useMounted();
  if (!mounted) return null;

  const user = (id: FixtureId): Msg => ({ id: 'u', at: AT, from: 'user', kind: 'text', text: fixtureText(id), forwarded: true });
  const verdict = (id: Exclude<FixtureId, 'unclear-forward'>): Msg[] =>
    [user(id), { id: 'v', at: AT + 60_000, from: 'lumi', kind: 'verdict', result: fixtureResult(id, lang) }];
  const scheme = fixtureResult('scheme-forward', lang);

  return (
    <>
      <LumiPlayground />
      <section className="flex flex-wrap justify-center gap-10 px-4 py-10">
        <Frame name="empty-chat"><ChatScreen msgs={[]} /></Frame>
        <Frame name="checking">
          <ChatScreen lumi="thinking" msgs={[user('scheme-forward'), { id: 's', at: AT, from: 'lumi', kind: 'stage', stages: { extract: 'done', claims: 'done', search: 'start' } }]} />
        </Frame>
        {VERDICT_SHOTS.map(([id, v]) => (
          <Frame key={id} name={`verdict-${v.toLowerCase()}`}><ChatScreen lumi="reacting" mood={v} msgs={verdict(id)} /></Frame>
        ))}
        <Frame name="send-me-more">
          <ChatScreen msgs={[user('unclear-forward'), { id: 'm', at: AT + 60_000, from: 'lumi', kind: 'more' }]} />
        </Frame>
        <Frame name="claim-sheet">
          <ChatScreen msgs={verdict('scheme-forward')}>
            <ClaimSheet claim={scheme.claims[1]} checkedAt={scheme.checkedAt} onClose={noop} />
          </ChatScreen>
        </Frame>
        <Frame name="reply-composer">
          <ChatScreen msgs={verdict('health-tip')}>
            <ReplyComposer open message={fixtureResult('health-tip', lang).replyMessage} onClose={noop} />
          </ChatScreen>
        </Frame>
        <Frame name="dark-mode" dark><ChatScreen lumi="reacting" mood="FALSE" msgs={verdict('health-tip')} /></Frame>
        <Frame name="call-screen"><CallScreen /></Frame>
        <Frame name="landing-hero" src="/" />
      </section>
    </>
  );
}

function ChatScreen({ msgs, lumi = 'idle', mood, children }: { msgs: Msg[]; lumi?: LumiState; mood?: Verdict; children?: ReactNode }) {
  const input = useRef<HTMLTextAreaElement>(null);
  return (
    <div className="flex h-full flex-col">
      <ChatHeader lumi={lumi} mood={mood} busy={lumi === 'thinking'} onDemo={noop} onClear={noop} />
      <MessageList msgs={msgs} busy={false} onDemo={noop} onMore={noop} />
      <ChatInput busy={false} inputRef={input} onSend={noop} onAttach={noop} />
      {children}
    </div>
  );
}

function Frame({ name, dark, src, children }: { name: string; dark?: boolean; src?: string; children?: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const [err, setErr] = useState(false);

  async function download() {
    setErr(false);
    try {
      const node = src ? frame.current?.contentDocument?.body : box.current;
      if (!node) throw new Error('frame not ready');
      const a = document.createElement('a');
      a.href = await toPng(node, { pixelRatio: 2, width: 390, height: 844 });
      a.download = `truth-${name}.png`;
      a.click();
    } catch {
      setErr(true);
    }
  }

  return (
    <figure className="flex flex-col items-center gap-3">
      <div
        ref={box}
        className={`relative h-[844px] w-[390px] overflow-hidden rounded-[28px] shadow-2xl ring-1 ring-black/10 ${dark ? 'dark bg-truth-dbg text-truth-dtext' : 'bg-truth-bg text-truth-text'}`}
      >
        {src
          ? <iframe ref={frame} src={src} title={name} width={390} height={844} className="border-0" />
          : <InlineSheets.Provider value>{children}</InlineSheets.Provider>}
      </div>
      <figcaption className="flex items-center gap-3 text-sm">
        <code>{name}</code>
        <button onClick={download} className="inline-flex items-center gap-1.5 rounded-full bg-truth-accent px-3 py-1.5 font-semibold text-white hover:brightness-95">
          <Download size={16} aria-hidden /> Download PNG
        </button>
        {err && <span role="alert" className="text-[#E5484D]">Export failed, use a browser screenshot</span>}
      </figcaption>
    </figure>
  );
}

const STATES: LumiState[] = ['idle', 'listening', 'thinking', 'speaking', 'reacting'];
const MOODS: Verdict[] = ['VERIFIED', 'FALSE', 'OUTDATED', 'PARTLY_SUPPORTED'];

/** Dev controls: every state, mood, volume 0..1 and the "asking" nod, at all four sizes. */
function LumiPlayground() {
  const [state, setState] = useState<LumiState>('idle');
  const [mood, setMood] = useState<Verdict>('VERIFIED');
  const [volume, setVolume] = useState(0.5);
  const [talk, setTalk] = useState(false);
  const [asking, setAsking] = useState(false);

  // "Fake voice": random volume so the mouth/halo smoothing can be eyeballed.
  useEffect(() => {
    if (!talk) return;
    const id = setInterval(() => setVolume(Math.random() < 0.25 ? 0 : Math.random()), 120);
    return () => clearInterval(id);
  }, [talk]);

  const field = 'flex flex-col gap-1 text-sm font-medium';
  const select = 'rounded-lg border border-black/15 bg-white px-2 py-1.5 dark:border-white/15 dark:bg-truth-dpanel';
  return (
    <section className="mx-auto max-w-5xl px-4 pt-10">
      <h2 className="text-xl font-bold">Lumi playground</h2>
      <div className="mt-4 flex flex-wrap items-end gap-4 rounded-2xl bg-white p-4 shadow dark:bg-truth-dpanel">
        <label className={field}>State
          <select value={state} onChange={(e) => setState(e.target.value as LumiState)} className={select}>
            {STATES.map((s) => <option key={s}>{s}</option>)}
          </select>
        </label>
        <label className={field}>Mood (reacting)
          <select value={mood} onChange={(e) => setMood(e.target.value as Verdict)} className={select}>
            {MOODS.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label className={`${field} w-48`}>Volume {volume.toFixed(2)}
          <input type="range" min={0} max={1} step={0.01} value={volume} disabled={talk} onChange={(e) => setVolume(+e.target.value)} />
        </label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={talk} onChange={(e) => setTalk(e.target.checked)} /> Fake voice</label>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={asking} onChange={(e) => setAsking(e.target.checked)} /> Asking nod</label>
      </div>
      <div className="mt-6 flex flex-wrap items-end justify-center gap-8">
        {[36, 96, 220, 360].map((size) => (
          <figure key={size} className="flex flex-col items-center gap-2">
            <Lumi size={size} state={state} mood={mood} volume={volume} asking={asking} />
            <figcaption className="text-xs text-truth-muted">{size}px</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
