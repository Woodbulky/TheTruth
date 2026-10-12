'use client';
import { BadgeCheck, CircleDashed, History, XOctagon, type LucideIcon } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import type { Verdict } from '@/lib/types';

export const VERDICT_META: Record<Verdict, { color: string; Icon: LucideIcon }> = {
  VERIFIED: { color: '#1FA855', Icon: BadgeCheck },
  FALSE: { color: '#E5484D', Icon: XOctagon },
  OUTDATED: { color: '#8B5CF6', Icon: History },
  PARTLY_SUPPORTED: { color: '#F59E0B', Icon: CircleDashed },
};

/** Icon + label + colour: colour is never the only signal. */
export function VerdictChip({ verdict, size = 'md' }: { verdict: Verdict; size?: 'sm' | 'md' | 'lg' }) {
  const t = STR[useLang()];
  const { color, Icon } = VERDICT_META[verdict];
  const s = { sm: 'text-xs px-2 py-0.5 gap-1', md: 'text-sm px-2.5 py-1 gap-1.5', lg: 'text-base px-3 py-1.5 gap-2' }[size];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-semibold ${s}`}
      style={{ borderColor: color, background: `color-mix(in srgb, ${color} 14%, transparent)` }}
    >
      <Icon aria-hidden size={size === 'lg' ? 20 : size === 'md' ? 16 : 14} color={color} strokeWidth={2.4} />
      {t.verdict[verdict]}
    </span>
  );
}
