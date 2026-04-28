'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { questions } from '@/lib/quiz';
import type { Question } from '@/lib/quiz';
import { QuizProgress } from './quiz-progress';
import { QuizCard } from './quiz-card';
import { QuizResult } from './quiz-result';

type Screen = 'start' | 'question' | 'result';
type Difficulty = 'all' | 'easy' | 'medium' | 'hard';

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const DIFFICULTY_OPTIONS: { value: Difficulty; label: string }[] = [
  { value: 'all', label: 'Mixed' },
  { value: 'easy', label: 'Easy only' },
  { value: 'medium', label: 'Medium only' },
  { value: 'hard', label: 'Hard only' },
];

const SESSION_SIZE = 20;

const DIFF_COLORS: Record<string, string> = {
  easy: '#22c55e',
  medium: '#eab308',
  hard: '#ef4444',
};

export function QuizGame() {
  const [screen, setScreen] = useState<Screen>('start');
  const [difficulty, setDifficulty] = useState<Difficulty>('all');
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [showExplanation, setShowExplanation] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (screen !== 'question' || selectedAnswer !== null) return;
    if (timeLeft <= 0) {
      setSelectedAnswer(-1);
      setShowExplanation(true);
      setAnswers((prev) => [...prev, -1]);
      return;
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [screen, timeLeft, selectedAnswer]);

  function startQuiz() {
    const pool =
      difficulty === 'all'
        ? questions
        : questions.filter((q) => q.difficulty === difficulty);
    const shuffled = fisherYates(pool);
    setFilteredQuestions(shuffled.slice(0, SESSION_SIZE));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers([]);
    setScore(0);
    setTimeLeft(30);
    setShowExplanation(false);
    setScreen('question');
  }

  function handleAnswer(idx: number) {
    if (selectedAnswer !== null) return;
    const isCorrect = idx === filteredQuestions[currentQuestion].correct;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    setAnswers((prev) => [...prev, idx]);
    if (isCorrect) setScore((s) => s + 1);
  }

  function nextQuestion() {
    if (currentQuestion + 1 >= filteredQuestions.length) {
      setScreen('result');
    } else {
      setCurrentQuestion((c) => c + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setTimeLeft(30);
    }
  }

  function getCardState(optionIdx: number): 'idle' | 'correct' | 'wrong' | 'dim' {
    if (selectedAnswer === null) return 'idle';
    const correct = filteredQuestions[currentQuestion].correct;
    if (optionIdx === correct) return 'correct';
    if (optionIdx === selectedAnswer) return 'wrong';
    return 'dim';
  }

  const previewPool =
    difficulty === 'all'
      ? questions
      : questions.filter((q) => q.difficulty === difficulty);
  const bankSize = previewPool.length;
  const sessionCount = Math.min(SESSION_SIZE, bankSize);
  const estimatedMin = Math.ceil((sessionCount * 30) / 60);

  // ── RESULT SCREEN ──────────────────────────────────────────────
  if (screen === 'result') {
    return (
      <QuizResult
        score={score}
        total={filteredQuestions.length}
        answers={answers}
        questions={filteredQuestions}
        onRetry={startQuiz}
      />
    );
  }

  // ── START SCREEN ───────────────────────────────────────────────
  if (screen === 'start') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg mx-auto text-center">
          {/* Badge */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="text-blue-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4"
          >
            Orion Space
          </motion.p>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-3"
          >
            Space Quiz
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="text-white/45 text-lg mb-10 leading-relaxed"
          >
            Test your knowledge of the cosmos
          </motion.p>

          {/* Difficulty filter */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32 }}
            className="mb-3"
          >
            <p className="text-xs text-white/30 uppercase tracking-widest font-medium mb-3">
              Difficulty
            </p>
            <div className="inline-flex gap-2 p-1 rounded-xl bg-white/[0.04] border border-white/[0.06]">
              {DIFFICULTY_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setDifficulty(value)}
                  className={[
                    'px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200',
                    difficulty === value
                      ? 'bg-white/10 text-white shadow-sm'
                      : 'text-white/40 hover:text-white/70',
                  ].join(' ')}
                  style={
                    difficulty === value && value !== 'all'
                      ? { color: DIFF_COLORS[value] }
                      : {}
                  }
                >
                  {label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Count + time */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="text-white/30 text-sm mb-8 tabular-nums"
          >
            {sessionCount} questions from a bank of {bankSize} · ~{estimatedMin} min
          </motion.p>

          {/* Start button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.46 }}
          >
            <motion.button
              onClick={startQuiz}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 380, damping: 20 }}
              className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-semibold text-sm overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                boxShadow: '0 0 28px #3b82f630',
              }}
            >
              {/* Pulse rings */}
              <motion.span
                className="absolute inset-0 rounded-full border border-blue-500/50"
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
              <motion.span
                className="absolute inset-0 rounded-full border border-blue-400/30"
                animate={{ scale: [1, 1.8], opacity: [0.35, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
              />
              <span className="relative">Start Quiz →</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── QUESTION SCREEN ────────────────────────────────────────────
  const q = filteredQuestions[currentQuestion];
  const isAnswered = selectedAnswer !== null;

  return (
    <div className="min-h-screen px-4 py-16 flex flex-col items-center">
      <div className="w-full max-w-xl mx-auto">
        <QuizProgress
          current={currentQuestion + 1}
          total={filteredQuestions.length}
          timeLeft={timeLeft}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
          >
            {/* Difficulty + category badge */}
            <div className="flex items-center gap-2 mb-5">
              <span
                className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{
                  background: `${DIFF_COLORS[q.difficulty]}18`,
                  color: DIFF_COLORS[q.difficulty],
                  border: `1px solid ${DIFF_COLORS[q.difficulty]}30`,
                }}
              >
                {q.difficulty}
              </span>
              <span className="text-xs text-white/30 capitalize">{q.category}</span>
            </div>

            {/* Question text */}
            <h2 className="text-xl sm:text-2xl font-semibold text-white leading-snug mb-6">
              {q.question}
            </h2>

            {/* Answer options */}
            <div className="space-y-2.5 mb-5">
              {q.options.map((opt, i) => (
                <QuizCard
                  key={i}
                  index={i}
                  text={opt}
                  state={getCardState(i)}
                  onClick={() => handleAnswer(i)}
                />
              ))}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3.5 mb-5"
                >
                  <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1">
                    Explanation
                  </p>
                  <p className="text-sm text-white/65 leading-relaxed">{q.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                  className="flex justify-end"
                >
                  <motion.button
                    onClick={nextQuestion}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors duration-200"
                  >
                    {currentQuestion + 1 >= filteredQuestions.length
                      ? 'See Results'
                      : 'Next Question'}{' '}
                    →
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
