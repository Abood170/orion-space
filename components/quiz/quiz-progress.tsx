'use client';

import { motion } from 'motion/react';

interface QuizProgressProps {
  current: number;
  total: number;
  timeLeft: number;
}

export function QuizProgress({ current, total, timeLeft }: QuizProgressProps) {
  const barPct = ((current - 1) / total) * 100;
  const timerPct = (timeLeft / 30) * 100;
  const timerColor =
    timeLeft > 20 ? '#22c55e' : timeLeft > 10 ? '#eab308' : '#ef4444';

  const isUrgent = timeLeft <= 10;

  return (
    <div className="w-full flex items-center gap-4 mb-8">
      {/* Progress bar + label */}
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-1.5">
          <span className="text-xs text-white/40 font-medium tracking-wide uppercase">
            Question
          </span>
          <span className="text-sm text-white/70 font-semibold tabular-nums">
            {current} / {total}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${barPct}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Circular timer */}
      <div className="relative flex-shrink-0 w-12 h-12">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
          {/* Track */}
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="3"
          />
          {/* Progress arc */}
          <motion.circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke={timerColor}
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 20}`}
            strokeDashoffset={`${2 * Math.PI * 20 * (1 - timerPct / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s ease' }}
          />
        </svg>
        {/* Number */}
        <motion.span
          className="absolute inset-0 flex items-center justify-center text-sm font-bold tabular-nums"
          style={{ color: timerColor }}
          animate={isUrgent ? { opacity: [1, 0.4, 1] } : { opacity: 1 }}
          transition={isUrgent ? { duration: 0.7, repeat: Infinity } : {}}
        >
          {timeLeft}
        </motion.span>
      </div>
    </div>
  );
}
