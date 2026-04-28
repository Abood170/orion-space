'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';

interface Stat {
  value: number;
  suffix: string;
  label: string;
  prefix?: string;
  decimals?: number;
}

const STATS: Stat[] = [
  { value: 8, suffix: '', label: 'Planets' },
  { value: 50, suffix: '+', label: 'Space Milestones' },
  { value: 4.6, suffix: 'B', label: 'Years Old', decimals: 1 },
  { value: 1392700, suffix: ' km', label: 'Sun Diameter', prefix: '' },
];

function useCounter(target: number, duration: number, decimals = 0, active: boolean) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, target, duration, decimals]);

  return count;
}

function StatItem({ stat, active }: { stat: Stat; active: boolean }) {
  const raw = useCounter(stat.value, 1800, stat.decimals ?? 0, active);
  const formatted =
    stat.value >= 1000
      ? Math.round(raw).toLocaleString()
      : stat.decimals
      ? raw.toFixed(stat.decimals)
      : String(Math.round(raw));

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={active ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="flex flex-col items-center gap-1 px-6 py-4"
    >
      <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white tabular-nums">
        {stat.prefix ?? ''}
        {formatted}
        <span className="text-blue-400">{stat.suffix}</span>
      </span>
      <span className="text-xs sm:text-sm text-white/40 font-medium tracking-wide uppercase">
        {stat.label}
      </span>
    </motion.div>
  );
}

export function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="relative w-full py-6">
      <div
        className="mx-auto max-w-4xl rounded-2xl border border-white/[0.06] px-4"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(59,130,246,0.04) 100%)',
          backdropFilter: 'blur(12px)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/[0.06] divide-y sm:divide-y-0">
          {STATS.map((stat) => (
            <StatItem key={stat.label} stat={stat} active={inView} />
          ))}
        </div>
      </div>
    </div>
  );
}
