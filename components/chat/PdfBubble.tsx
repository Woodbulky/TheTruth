import { FileText } from 'lucide-react';
import { Bubble } from './Bubble';

export function PdfBubble({ name, pages, tail, at }: { name: string; pages: string; tail?: boolean; at: number }) {
  return (
    <Bubble side="out" tail={tail} at={at}>
      <span className="flex w-60 items-center gap-3 rounded-md bg-black/5 p-2 dark:bg-white/5">
        <span className="flex size-10 shrink-0 items-center justify-center rounded bg-[#E5484D] text-[10px] font-bold text-white">
          <FileText size={16} aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block truncate font-medium">{name}</span>
          <span className="text-xs text-satya-muted dark:text-satya-dmuted">{pages} · PDF</span>
        </span>
      </span>
    </Bubble>
  );
}
