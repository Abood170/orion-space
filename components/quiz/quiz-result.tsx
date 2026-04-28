'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import type { Question } from '@/lib/quiz';

interface QuizResultProps {
  score: number;
  total: number;
  answers: number[];
  questions: Question[];
  onRetry: () => void;
}

const LABELS = ['A', 'B', 'C', 'D'];
const CATEGORIES = ['planets', 'history', 'stars', 'missions'] as const;
const CAT_LABELS: Record<string, string> = {
  planets: '🪐 Planets',
  history: '🚀 History',
  stars: '⭐ Stars',
  missions: '🛰 Missions',
};

function useAnimatedValue(target: number, duration = 1400) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number>(0);
  useEffect(() => {
    let start: number | null = null;
    const tick = (now: number) => {
      if (!start) start = now;
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);
  return value;
}

function Confetti() {
  const pieces = Array.from({ length: 36 }, (_, i) => ({
    x: Math.random() * 100,
    color: ['#3b82f6', '#8b5cf6', '#22c55e', '#eab308', '#ef4444', '#ec4899', '#06b6d4'][i % 7],
    delay: Math.random() * 1.5,
    duration: 2.2 + Math.random() * 1.8,
    size: 5 + Math.random() * 7,
    rotate: Math.random() * 360,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-50" aria-hidden>
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.55,
            background: p.color,
            rotate: p.rotate,
          }}
          initial={{ y: -20, opacity: 1 }}
          animate={{ y: '105vh', opacity: [1, 1, 0], rotate: p.rotate + 540 }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

export function QuizResult({ score, total, answers, questions, onRetry }: QuizResultProps) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const animatedPct = useAnimatedValue(pct);
  const showConfetti = pct > 80;

  const { color, label } =
    pct >= 91 ? { color: '#a855f7', label: 'Cosmic Genius! ✨' }
    : pct >= 71 ? { color: '#3b82f6', label: 'Space Expert! 🪐' }
    : pct >= 41 ? { color: '#eab308', label: 'Good Astronomer! 🌟' }
    : { color: '#ef4444', label: 'Keep Exploring! 🚀' };

  const r = 52;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (animatedPct / 100) * circumference;

  // Category breakdown
  const catStats = CATEGORIES.map((cat) => {
    const indices = questions.reduce<number[]>((acc, q, i) => {
      if (q.category === cat) acc.push(i);
      return acc;
    }, []);
    const catTotal = indices.length;
    const catCorrect = indices.filter((i) => answers[i] === questions[i].correct).length;
    return { cat, catTotal, catCorrect };
  }).filter((s) => s.catTotal > 0);

  // Wrong answers
  const wrongAnswers = questions.reduce<{ q: Question; userAnswer: number; idx: number }[]>(
    (acc, q, i) => {
      if (answers[i] !== q.correct) acc.push({ q, userAnswer: answers[i], idx: i });
      return acc;
    },
    [],
  );

  return (
    <>
      {showConfetti && <Confetti />}

      <div className="min-h-screen px-4 py-16 flex flex-col items-center">
        <div className="w-full max-w-2xl mx-auto">
          {/* Score circle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center mb-10"
          >
            <div className="relative w-36 h-36 mb-5">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                <circle
                  cx="60" cy="60" r={r} fill="none"
                  stroke={color} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                  style={{ transition: 'stroke-dashoffset 0.05s linear' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white tabular-nums">{animatedPct}%</span>
                <span className="text-xs text-white/40 mt-0.5">{score}/{total}</span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-xl font-semibold"
              style={{ color }}
            >
              {label}
            </motion.p>
          </motion.div>

          {/* Category breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 mb-6"
          >
            <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
              Category Breakdown
            </h3>
            <div className="space-y-3">
              {catStats.map(({ cat, catTotal, catCorrect }) => {
                const catPct = catTotal > 0 ? (catCorrect / catTotal) * 100 : 0;
                const barColor = catPct >= 70 ? '#22c55e' : catPct >= 40 ? '#eab308' : '#ef4444';
                return (
                  <div key={cat}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-sm text-white/60">{CAT_LABELS[cat]}</span>
                      <span className="text-xs text-white/40 tabular-nums">
                        {catCorrect}/{catTotal}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{ background: barColor }}
                        initial={{ width: 0 }}
                        animate={{ width: `${catPct}%` }}
                        transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Wrong answers */}
          {wrongAnswers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 mb-8"
            >
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/40 mb-4">
                Review — {wrongAnswers.length} Missed
              </h3>
              <div className="space-y-4">
                {wrongAnswers.map(({ q, userAnswer }) => (
                  <div key={q.id} className="text-sm">
                    <p className="text-white/70 mb-1.5 leading-snug">{q.question}</p>
                    <div className="flex flex-col gap-1">
                      {userAnswer >= 0 && (
                        <span className="text-red-400/80 text-xs">
                          Your answer: {LABELS[userAnswer]}. {q.options[userAnswer]}
                        </span>
                      )}
                      {userAnswer < 0 && (
                        <span className="text-red-400/80 text-xs">
                          Time expired
                        </span>
                      )}
                      <span className="text-green-400/80 text-xs">
                        Correct: {LABELS[q.correct]}. {q.options[q.correct]}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs mt-1.5 leading-relaxed">{q.explanation}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button
              onClick={onRetry}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-300 hover:shadow-[0_0_30px_#3b82f640]"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-sm font-medium transition-all duration-300"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
}
