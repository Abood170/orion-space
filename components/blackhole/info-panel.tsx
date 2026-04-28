'use client';

import { motion } from 'motion/react';

const STATS = [
  { label: 'Event Horizon Radius', unit: 'km', base: 12000000, scale: (g: number) => g },
  { label: 'Gravitational Pull',   unit: 'g',  base: 100000,   scale: (g: number) => g ** 2 },
  { label: 'Time Dilation',        unit: 'x',  base: 1000,     scale: (g: number) => g ** 1.5 },
  { label: 'Escape Velocity',      unit: 'c',  base: 0.87,     scale: (g: number) => Math.min(g * 0.4, 1) },
];

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'k';
  return n.toFixed(2);
}

export function InfoPanel({ gravityStrength }: { gravityStrength: number }) {
  return (
    <div className="flex flex-col gap-2 min-w-[180px]">
      {STATS.map(({ label, unit, base, scale }) => {
        const value = base * scale(gravityStrength);
        return (
          <div key={label} className="flex flex-col gap-0.5">
            <span className="text-white/35 text-[10px] tracking-wider uppercase">{label}</span>
            <motion.span
              key={`${label}-${Math.round(gravityStrength * 10)}`}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="text-white/80 text-sm font-mono"
            >
              {formatNum(value)}{' '}
              <span className="text-white/30 text-[10px]">{unit}</span>
            </motion.span>
          </div>
        );
      })}
    </div>
  );
}
