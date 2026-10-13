import { Bubble } from './Bubble';

/** Uploaded screenshot (`src`), or in demo mode a drawn notice card rather than a real image file. */
export function ImageBubble({ text, src, label, tail, at }: { text: string; src?: string; label: string; tail?: boolean; at: number }) {
  if (src) {
    return (
      <Bubble side="out" tail={tail} at={at} className="p-1!">
        {/* eslint-disable-next-line @next/next/no-img-element -- local blob: URL, nothing for next/image to optimise */}
        <img src={src} alt={`${label}: ${text}`} className="block max-h-80 w-60 rounded-[5px] object-cover" />
      </Bubble>
    );
  }
  return (
    <Bubble side="out" tail={tail} at={at} className="p-1!">
      <figure role="img" aria-label={`${label}: ${text}`} className="w-60 overflow-hidden rounded-[5px] bg-white text-left text-truth-text">
        <div className="bg-[#C0392B] px-3 py-1.5 text-xs font-bold tracking-wide text-white">NOTICE</div>
        <p className="px-3 py-3 font-serif text-[13px] leading-snug">{text}</p>
        <div className="h-6 bg-[repeating-linear-gradient(90deg,#eee_0_6px,#fff_6px_12px)]" />
      </figure>
    </Bubble>
  );
}
