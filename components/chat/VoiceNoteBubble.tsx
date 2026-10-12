import { Mic, Play } from 'lucide-react';
import { Bubble } from './Bubble';

const BARS = [6, 10, 16, 9, 20, 14, 8, 18, 22, 12, 7, 15, 19, 11, 6, 13, 17, 9, 14, 8, 12, 18, 10, 6, 9, 15, 7];

export function VoiceNoteBubble({ duration, playLabel, tail, at }: { duration: string; playLabel: string; tail?: boolean; at: number }) {
  return (
    <Bubble side="out" tail={tail} at={at}>
      <span className="flex w-60 items-center gap-2 py-1">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-satya-accent text-white"><Mic size={20} aria-hidden /></span>
        <button type="button" aria-label={playLabel} className="text-satya-muted dark:text-satya-dmuted"><Play size={22} fill="currentColor" aria-hidden /></button>
        <span aria-hidden className="flex h-6 flex-1 items-center gap-[2px]">
          {BARS.map((h, i) => <span key={i} className="w-[3px] rounded-full bg-satya-muted/60 dark:bg-satya-dmuted/70" style={{ height: h }} />)}
        </span>
      </span>
      <span className="absolute bottom-1 left-14 text-[11px] text-satya-muted dark:text-satya-dmuted">{duration}</span>
    </Bubble>
  );
}
