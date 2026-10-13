'use client';
import { useRef, useState } from 'react';
import { ATTACH, demoCheck, fixtureText, pickFixture, sleep } from '@/lib/demo';
import type { FixtureId } from '@/lib/i18n';
import { extractFile, LIVE, liveCheck } from '@/lib/live';
import type { StageEvent, Verdict } from '@/lib/types';
import { useLang } from '@/lib/prefs';
import { ChatHeader } from './ChatHeader';
import { ChatInput, type AttachType } from './ChatInput';
import { MessageList, type MoreAction, type Msg } from './MessageList';
import type { Stages } from './StageBubble';

let seq = 0;
const uid = () => `m${++seq}`;

type UserMsg = Extract<Msg, { from: 'user' }>;
type NewUserMsg = Omit<UserMsg, 'id' | 'at' | 'from'>;

const asUrl = (s: string) => { try { return /^https?:\/\/\S+$/i.test(s) ? new URL(s) : null; } catch { return null; } };

export function Chat() {
  const lang = useLang();
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [busy, setBusy] = useState(false);
  const [mood, setMood] = useState<Verdict>();
  const [asking, setAsking] = useState(false);
  const run = useRef(0); // bumped by "clear chat" so an in-flight check stops writing
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const ask = () => {
    setAsking(true);
    setTimeout(() => setAsking(false), 2000);
  };

  /** Post the user's message (if any), then render the StageEvent stream into one Lumi bubble. */
  async function check(user: NewUserMsg | null, events: () => AsyncIterable<StageEvent>) {
    if (busy) return;
    const token = ++run.current;
    const id = uid();
    const put = (m: Msg) => setMsgs((ms) => ms.map((x) => (x.id === id ? m : x)));
    setBusy(true);
    setMood(undefined);
    const typing: Msg = { id, at: Date.now(), from: 'lumi', kind: 'typing' };
    setMsgs((ms) => [...ms, ...(user ? [{ ...user, id: uid(), at: Date.now(), from: 'user' } as Msg] : []), typing]);
    await sleep(700);

    let stages: Stages = {};
    for await (const ev of events()) {
      if (run.current !== token) return;
      if (ev.stage === 'done') {
        put({ id, at: Date.now(), from: 'lumi', kind: 'verdict', result: ev.result });
        setMood(ev.result.overall);
        setTimeout(() => run.current === token && setMood(undefined), 2000);
      } else if (ev.stage === 'error') {
        // Can't-resolve → friendly "send me more"; infrastructure trouble → say so, never a fake verdict.
        const unavailable = ev.code === 'RETRIEVAL_UNAVAILABLE' || ev.code === 'INTERNAL';
        put({ id, at: Date.now(), from: 'lumi', kind: unavailable ? 'failed' : 'more' });
        if (!unavailable) ask();
      } else {
        stages = { ...stages, [ev.stage]: ev.status };
        put({ id, at: Date.now(), from: 'lumi', kind: 'stage', stages });
      }
    }
    setBusy(false);
  }

  const fixture = (user: NewUserMsg, f: FixtureId) => check(user, () => demoCheck(f, lang, user.kind));
  const demo = (f: FixtureId) => fixture({ kind: 'text', text: fixtureText(f), forwarded: true }, f);
  const send = (text: string) => {
    if (!LIVE) return fixture({ kind: 'text', text }, pickFixture(text));
    const url = asUrl(text);
    if (url) return check({ kind: 'url', text, label: url.hostname, sub: url.href }, () => liveCheck({ inputType: 'url', url: url.href, lang }));
    check({ kind: 'text', text }, () => liveCheck({ inputType: 'text', text, lang }));
  };
  const attach = (type: AttachType) => {
    // ponytail: voice notes stay on the demo fixture until Phase 5 (Scribe).
    if (LIVE && type === 'url') return inputRef.current?.focus();
    if (LIVE && (type === 'image' || type === 'pdf')) {
      fileRef.current!.accept = type === 'image' ? 'image/*' : 'application/pdf';
      return fileRef.current!.click();
    }
    const a = ATTACH[type];
    fixture({ kind: type, text: fixtureText(a.fixture), label: a.label, sub: a.sub }, a.fixture);
  };

  /** Upload → "Lumi read this" (editable) → user taps Check it → checkRead(). */
  async function upload(file: File) {
    if (busy) return;
    const token = ++run.current;
    const input = file.type === 'application/pdf' ? 'pdf' : 'image';
    const userId = uid();
    const id = uid();
    setBusy(true);
    setMood(undefined);
    setMsgs((ms) => [
      ...ms,
      { id: userId, at: Date.now(), from: 'user', kind: input, text: file.name, label: file.name, src: input === 'image' ? URL.createObjectURL(file) : undefined },
      { id, at: Date.now(), from: 'lumi', kind: 'typing' },
    ]);
    const read = await extractFile(file).catch(() => null);
    if (run.current !== token) return;
    setMsgs((ms) => ms.map((m) => {
      if (m.id === userId && read?.pages) return { ...m, sub: String(read.pages) };
      if (m.id !== id) return m;
      return read?.text.trim() ? { id, at: Date.now(), from: 'lumi', kind: 'read', text: read.text, input } : { id, at: Date.now(), from: 'lumi', kind: 'more' };
    }));
    if (!read?.text.trim()) ask();
    setBusy(false);
  }

  const checkRead = (id: string, text: string) => {
    const msg = msgs.find((m) => m.id === id);
    if (msg?.from !== 'lumi' || msg.kind !== 'read') return;
    setMsgs((ms) => ms.map((m) => (m.id === id ? { ...msg, text, done: true } : m)));
    check(null, () => liveCheck({ inputType: msg.input, text, lang }));
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
      <MessageList msgs={msgs} busy={busy} onDemo={demo} onMore={more} onCheckRead={checkRead} />
      <ChatInput busy={busy} inputRef={inputRef} onSend={send} onAttach={attach} />
      {LIVE && (
        <input ref={fileRef} type="file" hidden onChange={(e) => {
          const f = e.target.files?.[0];
          e.target.value = '';
          if (f) upload(f);
        }} />
      )}
    </>
  );
}
