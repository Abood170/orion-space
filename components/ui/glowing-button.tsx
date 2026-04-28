'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

interface GlowingButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
  className?: string;
}

export function GlowingButton({
  href,
  onClick,
  variant = 'primary',
  children,
  className = '',
}: GlowingButtonProps) {
  const isPrimary = variant === 'primary';

  const inner = (
    <motion.span
      className={[
        'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-colors duration-300 overflow-hidden',
        isPrimary
          ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
          : 'border border-white/10 text-white/60 hover:text-white hover:border-white/25',
        className,
      ].join(' ')}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      {isPrimary && (
        <>
          {/* Pulse ring 1 */}
          <motion.span
            className="absolute inset-0 rounded-full border border-blue-500/50"
            animate={{ scale: [1, 1.45], opacity: [0.6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
          />
          {/* Pulse ring 2 — offset */}
          <motion.span
            className="absolute inset-0 rounded-full border border-blue-400/30"
            animate={{ scale: [1, 1.7], opacity: [0.4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
          />
          {/* Inner shimmer */}
          <motion.span
            className="absolute inset-0 rounded-full bg-white/10"
            initial={{ opacity: 0, x: '-100%' }}
            whileHover={{ opacity: 1, x: '100%' }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
          />
        </>
      )}
      <span className="relative z-10">{children}</span>
    </motion.span>
  );

  if (href) {
    return <Link href={href}>{inner}</Link>;
  }

  return (
    <button type="button" onClick={onClick}>
      {inner}
    </button>
  );
}
