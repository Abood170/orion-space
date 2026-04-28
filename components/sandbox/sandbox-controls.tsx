'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SPAWN_TYPES, PRESETS, type Body } from '@/lib/sandbox-physics';
import type { BodyStats } from './sandbox-scene';

interface Props {
  // State
  isPaused:           boolean;
  speedMultiplier:    number;
  G:                  number;
  showTrails:         boolean;
  showVectors:        boolean;
  showGrid:           boolean;
  selectedSpawnTypeId:string;
  selectedBody:       Body | null;
  stats:              BodyStats;
  bodyCount:          number;
  // Callbacks
  onPauseToggle:      () => void;
  onSpeedChange:      (v: number) => void;
  onGChange:          (v: number) => void;
  onTrailsToggle:     () => void;
  onVectorsToggle:    () => void;
  onGridToggle:       () => void;
  onSpawnTypeSelect:  (id: string) => void;
  onPresetLoad:       (id: string) => void;
  onDeleteSelected:   () => void;
  onToggleStatic:     () => void;
  onRenameSelected:   (name: string) => void;
}

function glassCard(extra = '') {
  return `rounded-2xl px-4 py-4 pointer-events-auto ${extra}`;
}
const GLASS_STYLE = {
  background: 'rgba(0,0,0,0.72)',
  backdropFilter: 'blur(14px)',
  border: '1px solid rgba(255,255,255,0.08)',
};

function BackIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

function PillToggle({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1 rounded-full text-[11px] font-medium tracking-wide transition-all"
      style={{
        background: active ? 'rgba(59,130,246,0.25)' : 'rgba(255,255,255,0.05)',
        border: `1px solid ${active ? 'rgba(59,130,246,0.5)' : 'rgba(255,255,255,0.10)'}`,
        color: active ? '#93c5fd' : 'rgba(255,255,255,0.4)',
      }}
    >
      {label}
    </button>
  );
}

function formatTime(s: number) {
  if (s < 60) return `${s.toFixed(1)}s`;
  if (s < 3600) return `${(s / 60).toFixed(1)}m`;
  return `${(s / 3600).toFixed(1)}h`;
}

export function SandboxControls({
  isPaused, speedMultiplier, G, showTrails, showVectors, showGrid,
  selectedSpawnTypeId, selectedBody, stats, bodyCount,
  onPauseToggle, onSpeedChange, onGChange,
  onTrailsToggle, onVectorsToggle, onGridToggle,
  onSpawnTypeSelect, onPresetLoad,
  onDeleteSelected, onToggleStatic, onRenameSelected,
}: Props) {
  const [editingName, setEditingName] = useState(false);
  const [nameInput,   setNameInput]   = useState('');

  const startRename = () => {
    setNameInput(selectedBody?.name ?? '');
    setEditingName(true);
  };

  const commitRename = () => {
    if (nameInput.trim()) onRenameSelected(nameInput.trim());
    setEditingName(false);
  };

  const velMag = selectedBody
    ? Math.sqrt(selectedBody.velocity.reduce((s, v) => s + v * v, 0)).toFixed(2)
    : '—';

  return (
    <div className="absolute inset-0 pointer-events-none z-10">

      {/* ── TOP LEFT: title + back ─────────────────────────────────── */}
      <motion.div
        className="absolute top-0 left-0 p-5 pointer-events-auto"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/55 text-[11px] tracking-widest uppercase transition-colors mb-3"
        >
          <BackIcon /> Back
        </Link>
        <h1 className="text-white text-xl font-bold tracking-tight">Gravity Sandbox</h1>
        <p className="text-white/30 text-xs mt-0.5">Click to select · Drag to throw · Watch orbits form</p>
      </motion.div>

      {/* ── TOP RIGHT: sim controls ────────────────────────────────── */}
      <motion.div
        className="absolute top-0 right-0 p-5"
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className={glassCard('flex flex-col gap-3 min-w-[200px]')} style={GLASS_STYLE}>
          {/* Pause + toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={onPauseToggle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                background: isPaused ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.75)',
              }}
            >
              <span>{isPaused ? '▶' : '⏸'}</span>
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <PillToggle label="Trails"  active={showTrails}  onClick={onTrailsToggle}  />
            <PillToggle label="Vectors" active={showVectors} onClick={onVectorsToggle} />
            <PillToggle label="Grid"    active={showGrid}    onClick={onGridToggle}    />
          </div>

          {/* Speed */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-white/35 text-[10px] uppercase tracking-wider">Speed</span>
              <span className="text-white/55 text-[10px]">{speedMultiplier.toFixed(1)}×</span>
            </div>
            <input type="range" min="0.1" max="5" step="0.1" value={speedMultiplier}
              onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
              className="w-full cursor-pointer" style={{ accentColor: '#3b82f6' }} />
          </div>

          {/* G */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="text-white/35 text-[10px] uppercase tracking-wider">Gravity (G)</span>
              <span className="text-white/55 text-[10px]">{G.toFixed(1)}</span>
            </div>
            <input type="range" min="0.1" max="5" step="0.1" value={G}
              onChange={(e) => onGChange(parseFloat(e.target.value))}
              className="w-full cursor-pointer" style={{ accentColor: '#8b5cf6' }} />
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM LEFT: body spawner ──────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-0 p-5"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className={glassCard()} style={GLASS_STYLE}>
          <p className="text-white/30 text-[9px] tracking-[0.22em] uppercase mb-3">Add Object</p>
          {bodyCount >= 20 && (
            <p className="text-yellow-400/70 text-[10px] mb-2">⚠ Max 20 bodies reached</p>
          )}
          <div className="grid grid-cols-3 gap-1.5">
            {SPAWN_TYPES.map((def) => {
              const active = selectedSpawnTypeId === def.id;
              return (
                <button
                  key={def.id}
                  onClick={() => onSpawnTypeSelect(def.id)}
                  className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all"
                  style={{
                    background: active ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.07)'}`,
                    boxShadow: active ? `0 0 8px rgba(59,130,246,0.2)` : undefined,
                  }}
                >
                  <span className="text-lg leading-none">{def.icon}</span>
                  <span className="text-[9px] text-white/45 leading-tight text-center">{def.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ── BOTTOM CENTER: stats ───────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 p-5 pointer-events-none"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <div
          className="flex items-center gap-5 px-5 py-2.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {[
            { label: 'Bodies',     value: stats.count },
            { label: 'Collisions', value: stats.collisionCount },
            { label: 'Largest',    value: stats.largestName },
            { label: 'Sim Time',   value: formatTime(stats.simTime) },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col items-center gap-0.5">
              <span className="text-white/25 text-[8px] uppercase tracking-widest">{label}</span>
              <span className="text-white/70 text-xs font-medium">{value}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── BOTTOM RIGHT: presets ──────────────────────────────────── */}
      <motion.div
        className="absolute bottom-0 right-0 p-5"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className={glassCard()} style={GLASS_STYLE}>
          <p className="text-white/30 text-[9px] tracking-[0.22em] uppercase mb-3">Presets</p>
          <div className="flex flex-col gap-1.5">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onPresetLoad(preset.id)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-white/55 hover:text-white/80 hover:bg-white/[0.06] transition-all text-left"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-sm">{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── RIGHT: selected body panel ─────────────────────────────── */}
      <AnimatePresence>
        {selectedBody && (
          <motion.div
            key={selectedBody.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            className="absolute right-5 pointer-events-auto"
            style={{ top: '50%', transform: 'translateY(-50%)' }}
          >
            <div className="rounded-2xl overflow-hidden" style={{ ...GLASS_STYLE, minWidth: 200 }}>
              {/* Header */}
              <div className="px-4 pt-4 pb-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {editingName ? (
                  <input
                    autoFocus
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onBlur={commitRename}
                    onKeyDown={(e) => { if (e.key === 'Enter') commitRename(); if (e.key === 'Escape') setEditingName(false); }}
                    className="bg-white/10 text-white text-sm font-semibold rounded px-2 py-0.5 w-full outline-none border border-white/20"
                  />
                ) : (
                  <button
                    onClick={startRename}
                    className="text-white text-sm font-semibold hover:text-blue-300 transition-colors text-left w-full"
                    title="Click to rename"
                  >
                    {selectedBody.name}
                  </button>
                )}
                <span
                  className="inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider"
                  style={{ background: `${selectedBody.color}22`, color: selectedBody.color, border: `1px solid ${selectedBody.color}44` }}
                >
                  {selectedBody.type}
                </span>
              </div>

              {/* Stats */}
              <div className="px-4 py-3 flex flex-col gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  { label: 'Mass',     value: `${selectedBody.mass.toFixed(2)} M⊕` },
                  { label: 'Velocity', value: `${velMag} u/s` },
                  { label: 'Position', value: selectedBody.position.map((v) => v.toFixed(1)).join(', ') },
                  { label: 'Static',   value: selectedBody.isStatic ? 'Yes' : 'No' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-white/30 text-[9px] uppercase tracking-wider">{label}</p>
                    <p className="text-white/70 text-xs font-medium">{value}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="px-4 py-3 flex flex-col gap-2">
                <button
                  onClick={onToggleStatic}
                  className="w-full py-1.5 rounded-lg text-[11px] text-white/55 hover:text-white/80 hover:bg-white/[0.07] transition-all border border-white/08"
                >
                  {selectedBody.isStatic ? '▶ Unpin' : '📌 Pin in place'}
                </button>
                <button
                  onClick={onDeleteSelected}
                  className="w-full py-1.5 rounded-lg text-[11px] text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all border border-red-500/15"
                >
                  🗑 Delete body
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
