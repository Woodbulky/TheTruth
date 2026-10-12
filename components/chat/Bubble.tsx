import { CheckCheck } from 'lucide-react';
import type { ReactNode } from 'react';

const fmt = new Intl.DateTimeFormat(undefined, { hour: 'numeric', minute: '2-digit' });

/** Base chat bubble: 7.5px radius, tail on the first bubble of a group, time (+ ticks for user) bottom-right. */
export function Bubble({ side, tail, at, className = '', children }: {
  side: 'in' | 'out'; tail?: boolean; at?: number; className?: string; children: ReactNode;
}) {
  const out = side === 'out';
  return (
    <div className={`flex px-3 ${out ? 'justify-end' : 'justify-start'} ${tail ? 'mt-2' : 'mt-0.5'}`}>
      <div
        className={`relative max-w-[85%] rounded-[7.5px] px-2 pt-1.5 pb-2 text-[14.5px] leading-snug shadow-[0_1px_0.5px_rgba(11,20,26,.13)] ${
          out ? 'bg-truth-out dark:bg-truth-dout' : 'bg-truth-in dark:bg-truth-din'
        } ${tail ? (out ? 'rounded-tr-none' : 'rounded-tl-none') : ''} ${className}`}
      >
        {tail && (
          <svg aria-hidden viewBox="0 0 8 13" width="8" height="13"
            className={`absolute top-0 ${out ? '-right-2 fill-truth-out dark:fill-truth-dout' : '-left-2 fill-truth-in dark:fill-truth-din'}`}>
            <path d={out ? 'M0 0h8L0 11z' : 'M8 0H0l8 11z'} />
          </svg>
        )}
        {children}
        {at !== undefined && (
          <>
            {/* spacer keeps the last text line clear of the timestamp */}
            <span aria-hidden className={`inline-block ${out ? 'w-[70px]' : 'w-[52px]'}`} />
            <span className="absolute right-2 bottom-1 flex items-center gap-1 text-[11px] text-truth-muted dark:text-truth-dmuted">
              <time dateTime={new Date(at).toISOString()}>{fmt.format(at)}</time>
              {out && <CheckCheck size={16} className="text-truth-tick" aria-label="Read" />}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
