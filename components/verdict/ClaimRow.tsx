'use client';
import { ChevronRight } from 'lucide-react';
import type { Claim } from '@/lib/types';
import { VerdictChip } from './VerdictChip';

export function ClaimRow({ claim, onOpen }: { claim: Claim; onOpen: () => void }) {
  return (
    <li>
      <button
        onClick={onOpen}
        className="flex w-full items-start gap-2 rounded-md px-1 py-2 text-left hover:bg-black/4 dark:hover:bg-white/5"
      >
        <span className="min-w-0 flex-1">
          <VerdictChip verdict={claim.verdict} size="sm" />
          <span className="mt-1 line-clamp-2 block text-sm font-medium">{claim.text}</span>
          <span className="mt-0.5 block text-[13px] text-truth-muted dark:text-truth-dmuted">{claim.oneLine}</span>
        </span>
        <ChevronRight size={18} className="mt-1 shrink-0 text-truth-muted" aria-hidden />
      </button>
    </li>
  );
}
