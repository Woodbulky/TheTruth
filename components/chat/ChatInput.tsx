'use client';
import { useCallback, useRef, useState, type RefObject } from 'react';
import { AudioLines, FileText, Image as ImageIcon, Link2, Mic, Paperclip, SendHorizontal } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { InputType } from '@/lib/types';
import { useDismiss } from '@/components/ui/useDismiss';

export type AttachType = Exclude<InputType, 'text'>;

const ATTACH_ITEMS = [
  { type: 'image', Icon: ImageIcon, color: '#7F66FF' },
  { type: 'pdf', Icon: FileText, color: '#5157AE' },
  { type: 'audio', Icon: AudioLines, color: '#FA6533' },
  { type: 'url', Icon: Link2, color: '#02A698' },
] as const;

export function ChatInput({ busy, inputRef, onSend, onAttach }: {
  busy: boolean; inputRef: RefObject<HTMLTextAreaElement | null>;
  onSend: (text: string) => void; onAttach: (type: AttachType) => void;
}) {
  const t = STR[useLang()];
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(open, close, menu);

  const send = () => {
    const v = text.trim();
    if (!v || busy) return;
    onSend(v);
    setText('');
  };

  const round = 'flex size-11 shrink-0 items-center justify-center rounded-full';

  return (
    <div className="flex shrink-0 items-end gap-1.5 bg-truth-bg px-1.5 py-1.5 dark:bg-truth-dbg">
      <div className="flex min-h-11 flex-1 items-end rounded-3xl bg-white dark:bg-truth-dpanel">
        <div ref={menu} className="relative">
          <button onClick={() => setOpen(!open)} disabled={busy} aria-label={t.attach} aria-expanded={open}
            className={`${round} text-truth-muted disabled:opacity-50 dark:text-truth-dmuted`}>
            <Paperclip size={22} className="-rotate-45" aria-hidden />
          </button>
          {open && (
            <div className="absolute bottom-full left-0 mb-2 w-56 overflow-hidden rounded-xl bg-white py-1 shadow-xl dark:bg-truth-dpanel">
              {ATTACH_ITEMS.map(({ type, Icon, color }) => (
                <button key={type} onClick={() => { close(); onAttach(type); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-black/5 dark:hover:bg-white/5">
                  <span className="flex size-8 items-center justify-center rounded-full text-white" style={{ background: color }}>
                    <Icon size={16} aria-hidden />
                  </span>
                  {t.attachItems[type]}
                </button>
              ))}
            </div>
          )}
        </div>
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={1}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          className="field-sizing-content max-h-32 min-h-11 flex-1 resize-none bg-transparent py-2.5 pr-3 text-[15px] outline-none placeholder:text-truth-muted dark:placeholder:text-truth-dmuted"
        />
      </div>
      {text.trim() ? (
        <button onClick={send} disabled={busy} aria-label={t.send} className={`${round} bg-truth-accent text-white disabled:opacity-60`}>
          <SendHorizontal size={20} aria-hidden />
        </button>
      ) : (
        <button onClick={() => onAttach('audio')} disabled={busy} aria-label={t.record} className={`${round} bg-truth-accent text-white disabled:opacity-60`}>
          <Mic size={20} aria-hidden />
        </button>
      )}
    </div>
  );
}
