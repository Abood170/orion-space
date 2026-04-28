'use client';

import { useState, useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'bottom';
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };
  const hide = () => {
    timerRef.current = setTimeout(() => setOpen(false), 80);
  };

  const offsetClass = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  const yFrom = side === 'top' ? 6 : -6;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            role="tooltip"
            className={`pointer-events-none absolute left-1/2 z-50 -translate-x-1/2 ${offsetClass}`}
            initial={{ opacity: 0, y: yFrom, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: yFrom, scale: 0.92 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div
              className="whitespace-nowrap rounded-lg px-3 py-2 text-xs text-white/80 font-medium"
              style={{
                background: 'rgba(15,15,25,0.92)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
              }}
            >
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
