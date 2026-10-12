import { Link2 } from 'lucide-react';
import { Bubble } from './Bubble';

export function LinkBubble({ url, title, tail, at }: { url: string; title: string; tail?: boolean; at: number }) {
  return (
    <Bubble side="out" tail={tail} at={at}>
      <span className="mb-1 flex w-64 gap-2 rounded-md bg-black/5 p-2 dark:bg-white/5">
        <span className="flex size-12 shrink-0 items-center justify-center rounded bg-satya-accent/15 text-satya-accent"><Link2 size={20} aria-hidden /></span>
        <span className="min-w-0">
          <span className="line-clamp-2 text-sm font-medium">{title}</span>
          <span className="block truncate text-xs text-satya-muted dark:text-satya-dmuted">{new URL(url).hostname}</span>
        </span>
      </span>
      <span className="break-all text-[#027EB5] dark:text-satya-tick">{url}</span>
    </Bubble>
  );
}
