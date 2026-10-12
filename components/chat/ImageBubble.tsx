import { Bubble } from './Bubble';

/** Demo-mode screenshot: a drawn notice card rather than a real image file. */
export function ImageBubble({ text, label, tail, at }: { text: string; label: string; tail?: boolean; at: number }) {
  return (
    <Bubble side="out" tail={tail} at={at} className="p-1!">
      <figure role="img" aria-label={`${label}: ${text}`} className="w-60 overflow-hidden rounded-[5px] bg-white text-left text-satya-text">
        <div className="bg-[#C0392B] px-3 py-1.5 text-xs font-bold tracking-wide text-white">NOTICE</div>
        <p className="px-3 py-3 font-serif text-[13px] leading-snug">{text}</p>
        <div className="h-6 bg-[repeating-linear-gradient(90deg,#eee_0_6px,#fff_6px_12px)]" />
      </figure>
    </Bubble>
  );
}
