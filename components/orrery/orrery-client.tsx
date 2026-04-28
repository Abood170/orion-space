'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Pause, Play, RotateCcw } from 'lucide-react';

const SolarSystem = dynamic(
  () => import('@/components/orrery/solar-system').then((m) => m.SolarSystem),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center">
        <div
          className="w-12 h-12 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #FDB813, #f97316)',
            boxShadow: '0 0 40px #FDB81340',
            animation: 'pulse-slow 2s ease-in-out infinite',
          }}
        />
      </div>
    ),
  },
);

export function OrreryClient() {
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [resetTrigger, setResetTrigger] = useState(0);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0f] overflow-hidden">
      {/* Full-screen canvas */}
      <div className="absolute inset-0">
        <SolarSystem
          speedMultiplier={speedMultiplier}
          isPaused={isPaused}
          resetTrigger={resetTrigger}
        />
      </div>

      {/* ── Top-left: back link ── */}
      <div className="fixed top-20 left-4 z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm text-white/70 hover:text-white transition-colors"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

      {/* ── Top-center: title ── */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div
          className="px-5 py-2 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <h1 className="text-white text-sm font-semibold tracking-[0.18em] uppercase">
            Solar System Orrery
          </h1>
        </div>
      </div>

      {/* ── Bottom-center: controls ── */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div
          className="flex items-center gap-4 px-5 py-3 rounded-2xl"
          style={{
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <span className="text-white/45 text-xs font-medium">Speed</span>

          <input
            type="range"
            min={0.1}
            max={5}
            step={0.1}
            value={speedMultiplier}
            onChange={(e) => setSpeedMultiplier(parseFloat(e.target.value))}
            className="w-28 sm:w-36 accent-blue-500 cursor-pointer"
          />

          <span className="text-white text-xs font-mono w-9 text-right">
            {speedMultiplier.toFixed(1)}x
          </span>

          <div className="w-px h-5 bg-white/10" />

          <button
            onClick={() => setIsPaused((p) => !p)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white text-xs font-semibold transition-colors"
            style={{
              background: isPaused
                ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                : 'rgba(255,255,255,0.1)',
              boxShadow: isPaused ? '0 0 16px #3b82f630' : 'none',
            }}
          >
            {isPaused ? <Play size={11} /> : <Pause size={11} />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>

          <div className="w-px h-5 bg-white/10" />

          <button
            onClick={() => setResetTrigger((t) => t + 1)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-white/60 text-xs font-medium hover:text-white transition-colors"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <RotateCcw size={11} />
            Reset
          </button>
        </div>
      </div>

      {/* ── Hint ── */}
      <div className="fixed bottom-8 right-4 z-10 hidden sm:block pointer-events-none">
        <p
          className="text-white/20 text-xs tracking-wide"
          style={{
            background: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(8px)',
            padding: '6px 12px',
            borderRadius: '20px',
          }}
        >
          Drag to rotate · Scroll to zoom · Click planet to explore
        </p>
      </div>
    </div>
  );
}
