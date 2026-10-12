'use client';
import { Sparkles } from 'lucide-react';
import { VERDICT_META } from '@/components/verdict/VerdictChip';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { Verdict } from '@/lib/types';

export type LumiState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'reacting';

// ponytail: Phase 1 placeholder circle with the final props API; Phase 2 swaps in the illustrated SVG character.
export function Lumi({ state = 'idle', mood, size = 36 }: { state?: LumiState; mood?: Verdict; volume?: number; size?: number }) {
  const t = STR[useLang()];
  const ring = state === 'reacting' && mood ? VERDICT_META[mood].color : '#FFD166';
  return (
    <span
      role="img"
      aria-label={t.lumiAria}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-linear-to-br from-satya-accent to-satya-lumi-deep text-white transition-shadow ${state === 'thinking' ? 'motion-safe:animate-pulse' : ''}`}
      style={{ width: size, height: size, boxShadow: `0 0 0 ${Math.max(2, Math.round(size / 18))}px ${ring}` }}
    >
      <Sparkles aria-hidden size={Math.round(size * 0.5)} />
    </span>
  );
}
