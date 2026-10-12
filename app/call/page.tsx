import type { Metadata } from 'next';
import { CallScreen } from '@/components/call/CallScreen';

export const metadata: Metadata = { title: 'Call Lumi · The Truth' };

export default function CallPage() {
  return (
    <main className="h-dvh">
      <CallScreen />
    </main>
  );
}
