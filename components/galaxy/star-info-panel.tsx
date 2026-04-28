'use client';

import { motion, AnimatePresence } from 'motion/react';
import type { GalaxyStar } from '@/lib/galaxy-stars';

interface Props {
  star: GalaxyStar | null;
  onClose: () => void;
}

function formatDistance(ly: number): string {
  if (ly === 0) return '0 (our star)';
  if (ly < 100)  return `${ly.toFixed(2)} ly`;
  if (ly < 1000) return `${ly.toFixed(0)} ly`;
  return `${(ly / 1000).toFixed(2)}k ly`;
}

function magnitudeLabel(mag: number): string {
  if (mag < -5)   return 'Extraordinarily bright (above apparent scale)';
  if (mag < 0)    return 'Extremely bright';
  if (mag < 2)    return 'Visible to the naked eye';
  if (mag < 6)    return 'Barely visible to the naked eye';
  if (mag < 10)   return 'Requires binoculars';
  return 'Requires a telescope';
}

export function StarInfoPanel({ star, onClose }: Props) {
  return (
    <AnimatePresence>
      {star && (
        <motion.div
          key={star.id}
          initial={{ x: 340, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 340, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 34 }}
          className="fixed top-20 right-4 w-80 z-30 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(0,0,0,0.78)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {/* Header */}
          <div
            className="px-5 pt-5 pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold leading-tight" style={{ color: star.color }}>
                  {star.name}
                </h2>
                <span
                  className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase"
                  style={{
                    background: `${star.color}18`,
                    border: `1px solid ${star.color}40`,
                    color: star.color,
                  }}
                >
                  {star.type}
                </span>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/8 transition-colors text-lg leading-none"
              >
                ×
              </button>
            </div>
            <p className="text-white/35 text-xs mt-2">Constellation: {star.constellation}</p>
          </div>

          {/* Stats */}
          <div className="px-5 py-4 flex flex-col gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Distance</p>
              <p className="text-white/80 text-sm font-medium">{formatDistance(star.distanceLY)}</p>
              {star.distanceLY > 0 && (
                <p className="text-white/25 text-[10px] mt-0.5">
                  {star.distanceLY.toFixed(0)} years of travel at light speed
                </p>
              )}
            </div>
            <div>
              <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Apparent Magnitude</p>
              <p className="text-white/80 text-sm font-medium">{star.magnitude}</p>
              <p className="text-white/25 text-[10px] mt-0.5">{magnitudeLabel(star.magnitude)}</p>
            </div>
          </div>

          {/* Facts */}
          <div className="px-5 py-4">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">Facts</p>
            <ul className="flex flex-col gap-2.5">
              {star.facts.map((fact, i) => (
                <li key={i} className="flex gap-2.5 text-xs text-white/55 leading-relaxed">
                  <span className="shrink-0 mt-0.5 w-1 h-1 rounded-full bg-current opacity-50" />
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
