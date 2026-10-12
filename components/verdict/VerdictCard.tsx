'use client';
import { useState } from 'react';
import { Reply, ThumbsDown, ThumbsUp } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { CheckResult } from '@/lib/types';
import { Bubble } from '@/components/chat/Bubble';
import { ClaimRow } from './ClaimRow';
import { ClaimSheet } from './ClaimSheet';
import { ListenButton } from './ListenButton';
import { ReplyComposer } from './ReplyComposer';
import { VerdictChip } from './VerdictChip';

export function VerdictCard({ result, tail, at }: { result: CheckResult; tail?: boolean; at?: number }) {
  const t = STR[useLang()];
  const [open, setOpen] = useState<number | null>(null);
  const [reply, setReply] = useState(false);
  const [vote, setVote] = useState<'up' | 'down' | null>(null);

  return (
    <Bubble side="in" tail={tail} at={at} className="w-[85%]">
      <article aria-label={t.verdict[result.overall]} className="pt-1">
        <div className="flex items-start justify-between gap-2">
          <VerdictChip verdict={result.overall} size="lg" />
          {result.demo && (
            <span className="rounded bg-satya-lumi px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-satya-text">
              {t.demoData}
            </span>
          )}
        </div>
        <p className="mt-2 text-[14.5px]">{result.overallSummary}</p>
        <p className="mt-2 text-xs font-medium tracking-wide text-satya-muted uppercase dark:text-satya-dmuted">
          {t.claimsChecked(result.claims.length)}
        </p>
        <ul className="mt-1 divide-y divide-black/8 dark:divide-white/10">
          {result.claims.map((c, i) => (
            <ClaimRow key={c.id} claim={c} onOpen={() => setOpen(i)} />
          ))}
        </ul>
        <div className="mt-2 flex flex-wrap items-center gap-1 border-t border-black/8 pt-2 dark:border-white/10">
          <ListenButton />
          <button
            onClick={() => setReply(true)}
            className="flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-satya-header hover:bg-satya-accent/10 dark:text-satya-accent"
          >
            <Reply size={16} aria-hidden /> {t.replyToGroup}
          </button>
          <span className="ml-auto flex">
            <button
              aria-label={t.helpful}
              aria-pressed={vote === 'up'}
              onClick={() => setVote(vote === 'up' ? null : 'up')}
              className={`rounded-full p-1.5 ${vote === 'up' ? 'text-satya-accent' : 'text-satya-muted dark:text-satya-dmuted'}`}
            >
              <ThumbsUp size={16} fill={vote === 'up' ? 'currentColor' : 'none'} aria-hidden />
            </button>
            <button
              aria-label={t.notHelpful}
              aria-pressed={vote === 'down'}
              onClick={() => setVote(vote === 'down' ? null : 'down')}
              className={`rounded-full p-1.5 ${vote === 'down' ? 'text-[#E5484D]' : 'text-satya-muted dark:text-satya-dmuted'}`}
            >
              <ThumbsDown size={16} fill={vote === 'down' ? 'currentColor' : 'none'} aria-hidden />
            </button>
          </span>
        </div>
      </article>
      <ClaimSheet
        claim={open === null ? null : result.claims[open]}
        checkedAt={result.checkedAt}
        onClose={() => setOpen(null)}
      />
      <ReplyComposer open={reply} message={result.replyMessage} onClose={() => setReply(false)} />
    </Bubble>
  );
}
