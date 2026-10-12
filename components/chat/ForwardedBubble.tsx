import { Forward } from 'lucide-react';
import { Bubble } from './Bubble';

export function ForwardedBubble({ text, forwarded, label, tail, at }: {
  text: string; forwarded?: boolean; label: string; tail?: boolean; at: number;
}) {
  return (
    <Bubble side="out" tail={tail} at={at}>
      {forwarded && (
        <span className="mb-0.5 flex items-center gap-1 text-[12.5px] text-truth-muted italic dark:text-truth-dmuted">
          <Forward size={14} aria-hidden /> {label}
        </span>
      )}
      <span className="whitespace-pre-wrap break-words">{text}</span>
    </Bubble>
  );
}
