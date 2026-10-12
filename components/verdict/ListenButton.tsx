'use client';
import { Volume2 } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';

// Stub until Phase 5 (ElevenLabs TTS + speechSynthesis fallback).
export function ListenButton() {
  const t = STR[useLang()];
  return (
    <button
      disabled
      title={t.listenSoon}
      aria-label={`${t.listen} (${t.listenSoon})`}
      className="flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium text-truth-header opacity-50 dark:text-truth-accent"
    >
      <Volume2 size={16} aria-hidden /> {t.listen}
    </button>
  );
}
