'use client';

import { motion } from 'motion/react';

type CardState = 'idle' | 'correct' | 'wrong' | 'dim';

interface QuizCardProps {
  index: number;
  text: string;
  state: CardState;
  onClick: () => void;
}

const LABELS = ['A', 'B', 'C', 'D'];

const stateStyles: Record<CardState, string> = {
  idle: 'border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06] cursor-pointer',
  correct: 'border-green-500/60 bg-green-500/10 cursor-default',
  wrong: 'border-red-500/60 bg-red-500/10 cursor-default',
  dim: 'border-white/[0.04] bg-white/[0.01] opacity-40 cursor-default',
};

const labelStyles: Record<CardState, string> = {
  idle: 'bg-white/[0.06] text-white/50',
  correct: 'bg-green-500/20 text-green-400',
  wrong: 'bg-red-500/20 text-red-400',
  dim: 'bg-white/[0.04] text-white/30',
};

export function QuizCard({ index, text, state, onClick }: QuizCardProps) {
  const animate =
    state === 'wrong'
      ? { opacity: 1, x: [0, -8, 8, -6, 6, -4, 4, 0] as number[] }
      : { opacity: state === 'dim' ? 0.4 : 1, x: 0 };

  const animateTransition =
    state === 'wrong'
      ? ({ duration: 0.45, ease: 'easeInOut' } as const)
      : ({ duration: 0.28, delay: index * 0.05, ease: 'easeOut' } as const);

  return (
    <motion.button
      type="button"
      onClick={state === 'idle' ? onClick : undefined}
      disabled={state !== 'idle'}
      initial={{ opacity: 0, x: 20 }}
      animate={animate}
      transition={animateTransition}
      whileHover={state === 'idle' ? { scale: 1.01 } : {}}
      whileTap={state === 'idle' ? { scale: 0.99 } : {}}
      className={[
        'w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left transition-colors duration-200',
        stateStyles[state],
      ].join(' ')}
    >
      {/* Label badge */}
      <span
        className={[
          'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-colors duration-200',
          labelStyles[state],
        ].join(' ')}
      >
        {LABELS[index]}
      </span>

      {/* Option text */}
      <span
        className={[
          'text-sm font-medium leading-snug transition-colors duration-200',
          state === 'correct' ? 'text-green-300' : state === 'wrong' ? 'text-red-300' : state === 'dim' ? 'text-white/30' : 'text-white/80',
        ].join(' ')}
      >
        {text}
      </span>

      {/* State icon */}
      {state === 'correct' && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="ml-auto text-green-400 text-base flex-shrink-0"
        >
          ✓
        </motion.span>
      )}
      {state === 'wrong' && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 22 }}
          className="ml-auto text-red-400 text-base flex-shrink-0"
        >
          ✗
        </motion.span>
      )}
    </motion.button>
  );
}
