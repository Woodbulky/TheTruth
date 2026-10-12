'use client';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import { Lumi } from '@/components/lumi/Lumi';

// Placeholder until Phase 6 (ElevenLabs Agent call screen). Fills its parent (/call page or a /demo frame).
export function CallScreen() {
  const t = STR[useLang()];
  return (
    <div className="flex h-full flex-col items-center justify-center gap-6 bg-linear-to-b from-[#0B3B36] to-satya-dbg px-4 text-center text-satya-dtext">
      <Lumi size={220} />
      <p className="text-2xl font-semibold">Lumi</p>
      <p className="max-w-xs text-satya-dmuted">{t.callSoon}</p>
      <Link href="/chat" className="flex items-center gap-2 rounded-full bg-satya-accent px-6 py-3 font-semibold text-white hover:brightness-95">
        <MessageCircle size={20} aria-hidden /> {t.chatWithLumi}
      </Link>
    </div>
  );
}
