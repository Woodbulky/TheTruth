import type { Metadata } from 'next';
import { Gallery } from './Gallery';

export const metadata: Metadata = { title: 'Screens · SATYA', robots: { index: false } };

export default function DemoPage() {
  return (
    <main className="min-h-dvh bg-[#DFE5E7] dark:bg-[#0C1317]">
      <Gallery />
    </main>
  );
}
