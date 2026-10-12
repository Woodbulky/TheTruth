import type { Metadata } from 'next';
import { Chat } from '@/components/chat/Chat';
import { SidePanel } from '@/components/chat/SidePanel';

export const metadata: Metadata = { title: 'Chat with Lumi · The Truth' };

export default function ChatPage() {
  return (
    // Phone column sits at the exact viewport centre so bottom sheets (centred dialogs) line up with it.
    <div className="grid h-dvh bg-[#DFE5E7] lg:grid-cols-[1fr_430px_1fr] lg:gap-12 lg:py-5 dark:bg-[#0C1317]">
      <SidePanel />
      <main className="mx-auto flex h-full min-h-0 w-full max-w-[430px] flex-col overflow-hidden bg-truth-bg lg:rounded-2xl lg:shadow-2xl dark:bg-truth-dbg">
        <Chat />
      </main>
    </div>
  );
}
