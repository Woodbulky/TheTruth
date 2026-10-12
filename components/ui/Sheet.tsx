'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';

/** Bottom sheet on native <dialog>: focus trap, Escape and backdrop close for free; drag the handle down to close. */
export function Sheet({ open, onClose, title, closeLabel, children }: {
  open: boolean; onClose: () => void; title: string; closeLabel: string; children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const drag = useDragControls();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className="sheet fixed inset-x-0 top-auto bottom-0 m-0 mx-auto w-full max-w-[430px] max-h-[85dvh] overflow-hidden rounded-t-2xl bg-white p-0 text-satya-text shadow-2xl dark:bg-satya-dpanel dark:text-satya-dtext"
    >
      <motion.div
        drag="y" dragControls={drag} dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }} dragElastic={{ top: 0, bottom: 0.7 }}
        onDragEnd={(_, i) => { if (i.offset.y > 80) onClose(); }}
        className="flex max-h-[85dvh] flex-col"
      >
        <div onPointerDown={(e) => drag.start(e)} className="flex cursor-grab touch-none justify-center pt-2 pb-1">
          <span className="h-1.5 w-10 rounded-full bg-black/20 dark:bg-white/25" />
        </div>
        <div className="flex items-center justify-between px-4 pb-2">
          <h2 className="text-base font-semibold">{title}</h2>
          <button onClick={onClose} aria-label={closeLabel} className="rounded-full p-1.5 hover:bg-black/5 dark:hover:bg-white/10">
            <X size={20} aria-hidden />
          </button>
        </div>
        <div className="overflow-y-auto px-4 pb-6">{children}</div>
      </motion.div>
    </dialog>
  );
}
