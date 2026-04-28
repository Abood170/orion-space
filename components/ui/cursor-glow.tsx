'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

export function CursorGlow() {
  const [visible, setVisible] = useState(false);
  const rawX = useMotionValue(-400);
  const rawY = useMotionValue(-400);

  const x = useSpring(rawX, { stiffness: 150, damping: 25 });
  const y = useSpring(rawY, { stiffness: 150, damping: 25 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Disable on touch devices
    if ('ontouchstart' in window || window.innerWidth < 768) return;

    const onMove = (e: MouseEvent) => {
      rawX.set(e.clientX - 140);
      rawY.set(e.clientY - 140);
      if (!visible) setVisible(true);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [visible, rawX, rawY]);

  if (!visible) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none mix-blend-screen"
      style={{
        x,
        y,
        width: 280,
        height: 280,
        background:
          'radial-gradient(circle, rgba(59,130,246,0.13) 0%, rgba(139,92,246,0.08) 45%, transparent 70%)',
        zIndex: 0,
      }}
    />
  );
}
