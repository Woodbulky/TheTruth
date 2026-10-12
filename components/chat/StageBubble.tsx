'use client';
import { Check, LoaderCircle } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import { Bubble } from './Bubble';

export const STAGES = ['extract', 'claims', 'search', 'judge', 'explain'] as const;
export type StageName = (typeof STAGES)[number];
export type Stages = Partial<Record<StageName, 'start' | 'done'>>;

/** Live checklist: Reading → Finding claims → Searching → Judging → Explaining. */
export function StageBubble({ stages, tail }: { stages: Stages; tail?: boolean }) {
  const t = STR[useLang()];
  return (
    <Bubble side="in" tail={tail}>
      <ol className="w-60 space-y-1.5 py-1">
        {STAGES.map((s) => {
          const st = stages[s];
          return (
            <li key={s} className={`flex items-center gap-2 text-sm ${st ? '' : 'opacity-45'}`}>
              {st === 'done' ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-satya-accent text-white">
                  <Check size={13} strokeWidth={3} aria-hidden />
                </span>
              ) : st === 'start' ? (
                <LoaderCircle size={20} className="text-satya-accent motion-safe:animate-spin" aria-hidden />
              ) : (
                <span className="size-5 rounded-full border-2 border-satya-muted/50" aria-hidden />
              )}
              <span className={st === 'start' ? 'font-medium' : ''}>
                {t.stages[s]}
                {st === 'start' ? '…' : ''}
              </span>
            </li>
          );
        })}
      </ol>
    </Bubble>
  );
}

export function TypingBubble({ tail }: { tail?: boolean }) {
  return (
    <Bubble side="in" tail={tail}>
      <span className="flex gap-1 px-1 py-1.5" aria-label="Lumi is typing">
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-dot size-2 rounded-full bg-satya-muted dark:bg-satya-dmuted" />
        ))}
      </span>
    </Bubble>
  );
}
