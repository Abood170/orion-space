'use client';

import { motion } from 'motion/react';

let isFirstLoad = true;

export default function Template({ children }: { children: React.ReactNode }) {
  const animate = !isFirstLoad;
  if (typeof window !== 'undefined') isFirstLoad = false;

  return (
    <motion.div
      initial={animate ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      style={{ backgroundColor: '#0a0a0f', minHeight: '100vh' }}
    >
      {children}
    </motion.div>
  );
}
