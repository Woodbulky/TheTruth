'use client';
import { useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import { Sheet } from '@/components/ui/Sheet';

export function ReplyComposer({ open, message, onClose }: { open: boolean; message: string; onClose: () => void }) {
  const t = STR[useLang()];
  const ref = useRef<HTMLTextAreaElement>(null);
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(ref.current?.value ?? message);
    } catch {
      ref.current?.select(); // no clipboard API (insecure context): leave it selected for manual copy
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Sheet open={open} onClose={onClose} title={t.replyTitle} closeLabel={t.close}>
      <p className="mb-2 text-sm text-satya-muted dark:text-satya-dmuted">{t.replyHint}</p>
      <textarea
        ref={ref}
        key={message}
        defaultValue={message}
        rows={6}
        aria-label={t.replyTitle}
        className="w-full resize-none rounded-lg border border-black/10 bg-satya-out p-3 text-[15px] dark:border-white/10 dark:bg-satya-dout"
      />
      <button
        onClick={copy}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-satya-accent py-2.5 font-semibold text-white hover:brightness-95"
      >
        {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
        <span aria-live="polite">{copied ? t.copied : t.copy}</span>
      </button>
    </Sheet>
  );
}
