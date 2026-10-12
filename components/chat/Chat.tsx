'use client';
import { useRef, useState } from 'react';
import { ATTACH, demoCheck, fixtureText, pickFixture, sleep } from '@/lib/demo';
import type { FixtureId } from '@/lib/i18n';
import type { Verdict } from '@/lib/types';
import { useLang } from '@/lib/prefs';
import { ChatHeader } from './ChatHeader';
import { ChatInput, type AttachType } from './ChatInput';
import { MessageList, type MoreAction, type Msg } from './MessageList';
import type { Stages } from './StageBubble';

let seq = 0;
const uid = () => `m${++seq}`;

type UserMsg = Extract<Msg, { from: 'user' }>;

export function Chat() {
  const lang = useLang();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [mood, setMood] = useState<Verdict>();
  const [asking, setAsking] = useState(false);
  const run = useRef(0); // bumped by "clear chat" so an in-flight check stops writing
  const inputRef = useRef<HTMLTextAreaElement>(null);

  async function check(user: Omit<UserMsg, 'id' | 'at' | 'from'>, fixture: FixtureId) {
    if (busy) return;
    const token = ++run.current;
    const id = uid();
    const put = (m: Msg) => setMsgs((ms) => ms.map((x) => (x.id === id ? m : x)));
    setBusy(true);
    setMood(undefined);
    setMsgs((ms) => [...ms, { ...user, id: uid(), at: Date.now(), from: 'user' }, { id, at: Date.now(), from: 'lumi', kind: 'typing' }]);
    await sleep(700);

    // ponytail: demo fixtures only; Phase 4 branches to /api/check when NEXT_PUBLIC_DEMO_MODE=false.
    let stages: Stages = {};
    for await (const ev of demoCheck(fixture, lang, user.kind)) {
      if (run.current !== token) return;
      if (ev.stage === 'done') {
        put({ id, at: Date.now(), from: 'lumi', kind: 'verdict', result: ev.result });
        setMood(ev.result.overall);
        setTimeout(() => run.current === token && setMood(undefined), 2000);
      } else if (ev.stage === 'error') {
        put({ id, at: Date.now(), from: 'lumi', kind: 'more' });
        setAsking(true);
        setTimeout(() => setAsking(false), 2000);
      } else {
        stages = { ...stages, [ev.stage]: ev.status };
        put({ id, at: Date.now(), from: 'lumi', kind: 'stage', stages });
      }
    }
    setBusy(false);
  }

  const demo = (f: FixtureId) => check({ kind: 'text', text: fixtureText(f), forwarded: true }, f);
  const send = (text: string) => check({ kind: 'text', text }, pickFixture(text));
  const attach = (type: AttachType) => {
    const a = ATTACH[type];
    check({ kind: type, text: fixtureText(a.fixture), label: a.label, sub: a.sub }, a.fixture);
  };
  const more = (a: MoreAction) => (a === 'paste' ? inputRef.current?.focus() : attach(a === 'screenshot' ? 'image' : 'url'));
  const clear = () => {
    run.current++;
    setMsgs([]);
    setBusy(false);
    setMood(undefined);
  };

  return (
    <>
      <ChatHeader lumi={busy ? 'thinking' : mood ? 'reacting' : 'idle'} mood={mood} asking={asking} busy={busy} onDemo={demo} onClear={clear} />
      <MessageList msgs={msgs} busy={busy} onDemo={demo} onMore={more} />
      <ChatInput busy={busy} inputRef={inputRef} onSend={send} onAttach={attach} />
    </>
  );
}
