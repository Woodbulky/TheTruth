'use client';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';
import { STR } from '@/lib/i18n';
import { useLang } from '@/lib/prefs';
import { Lumi } from '@/components/lumi/Lumi';

// Placeholder until Phase 3 builds the full landing page.
export default function Home() {
  const t = STR[useLang()];
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-5 px-4 text-center">
      <Lumi size={96} />
      <p className="text-4xl font-extrabold tracking-[0.2em] text-satya-header dark:text-satya-accent">SATYA</p>
      <h1 className="max-w-md text-xl font-semibold">{t.heroLine}</h1>
      <p className="text-satya-muted dark:text-satya-dmuted">{t.tagline}</p>
      <Link href="/chat" className="flex items-center gap-2 rounded-full bg-satya-accent px-6 py-3 font-semibold text-white hover:brightness-95">
        <MessageCircle size={20} aria-hidden /> {t.chatWithLumi}
      </Link>
    </main>
  );
}
