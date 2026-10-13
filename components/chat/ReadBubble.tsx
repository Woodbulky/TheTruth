'use client';
import { useState } from 'react';
import { ScanText } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import { Bubble } from './Bubble';

/** What Lumi read from a screenshot/PDF, editable before checking (fix misreads first). */
export function ReadBubble({ text, done, busy, tail, at, onCheck }: {
  text: string; done?: boolean; busy: boolean; tail?: boolean; at: number; onCheck: (text: string) => void;
}) {
  const t = STR[useLang()];
  const [value, setValue] = useState(text);
  return (
    <Bubble side="in" tail={tail} at={at}>
      <p className="flex items-center gap-1 text-xs font-semibold text-truth-header dark:text-truth-accent">
        <ScanText size={14} aria-hidden /> {t.readThis}
      </p>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        readOnly={done}
        aria-label={t.readThis}
        className="field-sizing-content mt-1 block max-h-64 min-h-20 w-64 resize-none rounded-md bg-black/5 p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-truth-accent dark:bg-white/5"
      />
      {!done && (
        <>
          <p className="mt-1 text-xs text-truth-muted dark:text-truth-dmuted">{t.readHint}</p>
          <button
            onClick={() => onCheck(value.trim())}
            disabled={busy || !value.trim()}
            className="mt-2 w-full rounded-full bg-truth-accent py-1.5 text-sm font-medium text-white disabled:opacity-60"
          >
            {t.checkIt}
          </button>
        </>
      )}
    </Bubble>
  );
}
