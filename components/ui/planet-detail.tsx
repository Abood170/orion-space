'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Planet } from '@/lib/planets';
import { Planet3D } from './planet-3d';

interface PlanetDetailProps {
  planet: Planet;
}

// Atmosphere density relative to Earth (0–100 scale)
const ATMO: Record<string, number> = {
  mercury: 4, venus: 96, earth: 85, mars: 11,
  jupiter: 92, saturn: 88, uranus: 70, neptune: 76,
};

// Diameter in km for size comparison
const DIAMETER_KM: Record<string, number> = {
  mercury: 4879, venus: 12104, earth: 12742, mars: 6779,
  jupiter: 139820, saturn: 116460, uranus: 50724, neptune: 49244,
};

// Notable moons per planet
const MAJOR_MOONS: Record<string, string[]> = {
  earth:   ['Moon'],
  mars:    ['Phobos', 'Deimos'],
  jupiter: ['Io', 'Europa', 'Ganymede', 'Callisto', 'Amalthea'],
  saturn:  ['Titan', 'Enceladus', 'Mimas', 'Rhea', 'Tethys'],
  uranus:  ['Titania', 'Oberon', 'Umbriel', 'Ariel', 'Miranda'],
  neptune: ['Triton', 'Nereid', 'Proteus'],
};

const stats = [
  { label: 'Diameter',          key: 'diameter'        as keyof Planet },
  { label: 'Mass',              key: 'mass'            as keyof Planet },
  { label: 'Distance from Sun', key: 'distanceFromSun' as keyof Planet },
  { label: 'Moons',             key: 'moons'           as keyof Planet },
  { label: 'Orbital Period',    key: 'orbitalPeriod'   as keyof Planet },
];

// ── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [value, setValue] = useState(0);
  const start = useRef<number | null>(null);
  const raf = useRef<number>(0);

  useEffect(() => {
    if (!active) return;
    start.current = null;
    setValue(0);

    const tick = (ts: number) => {
      if (start.current === null) start.current = ts;
      const elapsed = ts - start.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf.current = requestAnimationFrame(tick);
    };

    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, active, duration]);

  return value;
}

// ── Moons stat with count-up ─────────────────────────────────────────────────

function MoonsStat({ count }: { count: number }) {
  const [active, setActive] = useState(false);
  const value = useCountUp(count, active);
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      onViewportEnter={() => setActive(true)}
      transition={{ duration: 0.45, delay: 3 * 0.07 }}
      viewport={{ once: true }}
      className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] text-center"
    >
      <p className="text-xl font-bold text-white mb-1.5 leading-tight">{value}</p>
      <p className="text-xs text-white/40 tracking-wide">Moons</p>
    </motion.div>
  );
}

// ── Moon dot with hover glow ─────────────────────────────────────────────────

function MoonDot({ name, color, index }: { name: string; color: string; index: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3, type: 'spring', stiffness: 200 }}
      viewport={{ once: true }}
    >
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex items-center gap-2 px-4 py-2 rounded-full border cursor-default transition-all duration-200"
        style={{
          borderColor: hovered ? `${color}50` : 'rgba(255,255,255,0.06)',
          background: hovered ? `${color}12` : 'rgba(255,255,255,0.02)',
          boxShadow: hovered ? `0 0 16px ${color}20` : 'none',
        }}
      >
        <div
          className="w-2 h-2 rounded-full flex-shrink-0"
          style={{
            backgroundColor: color,
            boxShadow: hovered ? `0 0 8px ${color}` : `0 0 4px ${color}60`,
          }}
        />
        <span className="text-sm text-white/60">{name}</span>
      </div>
    </motion.div>
  );
}

// ── Particle burst on load ───────────────────────────────────────────────────

function ParticleBurst({ color }: { color: string }) {
  const [fired, setFired] = useState(false);

  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const dist = 70 + Math.random() * 90;
        const size = 3 + Math.random() * 4;
        return { tx: Math.cos(angle) * dist, ty: Math.sin(angle) * dist, size };
      }),
    [],
  );

  useEffect(() => {
    const t = setTimeout(() => setFired(true), 420);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ zIndex: 20 }}
    >
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ width: p.size, height: p.size, backgroundColor: color }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={fired ? { x: p.tx, y: p.ty, opacity: 0, scale: 0 } : {}}
          transition={{ duration: 0.65 + Math.random() * 0.4, ease: [0.16, 1, 0.3, 1], delay: i * 0.015 }}
        />
      ))}
    </div>
  );
}

// ── Planet detail ─────────────────────────────────────────────────────────────

export function PlanetDetail({ planet }: PlanetDetailProps) {
  const [factIdx, setFactIdx] = useState(0);
  const density = ATMO[planet.slug] ?? 50;
  const majorMoons = MAJOR_MOONS[planet.slug] ?? [];

  // Size comparison
  const EARTH_REF_PX = 60;
  const planetDiamKm = DIAMETER_KM[planet.slug] ?? 12742;
  const ratio = planetDiamKm / 12742;
  const clampedRatio = Math.min(Math.max(ratio, 0.1), 4);
  const planetCirclePx = Math.round(EARTH_REF_PX * clampedRatio);

  // Auto-cycle fun facts
  useEffect(() => {
    const id = setInterval(() => {
      setFactIdx((i) => (i + 1) % planet.funFacts.length);
    }, 4200);
    return () => clearInterval(id);
  }, [planet.funFacts.length]);

  // Confetti burst on load
  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      if (cancelled) return;
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 55,
          spread: 80,
          origin: { y: 0.55 },
          colors: [planet.color, '#ffffff', '#8b5cf6'],
          gravity: 0.9,
          scalar: 0.9,
        });
      } catch {
        // confetti is decorative — silently skip
      }
    }, 700);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [planet.color]);

  return (
    <div className="min-h-screen">

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div
          className="absolute top-0 right-0 w-[55vw] h-[65vh] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 70% 20%, ${planet.color}14, transparent 65%)`,
          }}
        />

        <div className="max-w-7xl mx-auto">
          {/* Back */}
          <div className="mb-10" style={{ animation: 'fadeUp 0.5s ease-out both' }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group"
            >
              <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
              Back to Solar System
            </Link>
          </div>

          {/* Two-column hero */}
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* Text */}
            <div className="flex-1 min-w-0" style={{ animation: 'fadeUp 0.7s ease-out 0.1s both' }}>
              <span
                className="inline-block text-xs font-semibold tracking-[0.2em] uppercase mb-4 px-3 py-1 rounded-full border"
                style={{ color: planet.color, borderColor: `${planet.color}40` }}
              >
                {planet.type === 'rocky' ? 'Rocky Planet' : 'Gas Giant'}
              </span>
              <h1 className="text-6xl sm:text-8xl lg:text-9xl font-bold text-white leading-none tracking-tight mb-6">
                {planet.name}
              </h1>
              <p className="text-lg text-white/55 leading-relaxed max-w-lg">{planet.description}</p>
              <p className="mt-6 text-sm text-white/30 italic hidden lg:block">
                Drag the planet to rotate it freely
              </p>
            </div>

            {/* 3D planet with particle burst */}
            <div
              className="relative flex-shrink-0 w-56 h-56 sm:w-72 sm:h-72 lg:w-96 lg:h-96"
              style={{ animation: 'fadeIn 0.9s ease-out 0.15s both' }}
            >
              <ParticleBurst color={planet.color} />
              <Planet3D
                color={planet.color}
                secondaryColor={planet.secondaryColor}
                hasRings={planet.hasRings}
                isGasGiant={planet.type === 'gas'}
                interactive
                bloom
                rotationSpeed={0.14}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Key statistics ── */}
      <section className="py-14 px-4 border-y border-white/[0.06]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/35 mb-7 text-center">
            Key Statistics
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.map(({ label, key }, i) =>
              key === 'moons' ? (
                <MoonsStat key="moons" count={planet.moons} />
              ) : (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: i * 0.07 }}
                  viewport={{ once: true }}
                  className="p-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] text-center"
                >
                  <p className="text-xl font-bold text-white mb-1.5 leading-tight">
                    {String(planet[key])}
                  </p>
                  <p className="text-xs text-white/40 tracking-wide">{label}</p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* ── Atmosphere density ── */}
      <section className="py-12 px-4 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/35 mb-5">
            Atmosphere Density
          </h2>
          <div className="relative h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${density}%` }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              viewport={{ once: true }}
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                background: `linear-gradient(to right, ${planet.color}70, ${planet.color})`,
                boxShadow: `0 0 12px ${planet.color}50`,
              }}
            />
          </div>
          <p className="text-xs text-white/30 mt-2.5">
            {density}% relative to Earth&apos;s standard atmosphere
          </p>
        </div>
      </section>

      {/* ── Size comparison ── */}
      <section className="py-12 px-4 border-b border-white/[0.06]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/35 mb-8">
            Size Comparison
          </h2>
          <div className="flex items-end justify-center gap-12 sm:gap-20">
            {/* Earth reference */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.1 }}
                viewport={{ once: true }}
                className="rounded-full"
                style={{
                  width: EARTH_REF_PX,
                  height: EARTH_REF_PX,
                  background: 'radial-gradient(circle at 35% 32%, #60a5fa, #1d4ed8)',
                  boxShadow: '0 0 20px #3b82f640',
                  flexShrink: 0,
                }}
              />
              <span className="text-xs text-white/40">Earth</span>
              <span className="text-[11px] text-white/25">12,742 km</span>
            </div>

            {/* Current planet */}
            <div className="flex flex-col items-center gap-3">
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.2 }}
                viewport={{ once: true }}
                className="rounded-full"
                style={{
                  width: planetCirclePx,
                  height: planetCirclePx,
                  background: `radial-gradient(circle at 35% 32%, ${planet.color}, ${planet.secondaryColor})`,
                  boxShadow: `0 0 20px ${planet.color}40`,
                  flexShrink: 0,
                }}
              />
              <span className="text-xs text-white/40">{planet.name}</span>
              <span className="text-[11px] text-white/25">{planet.diameter}</span>
            </div>
          </div>
          <p className="text-xs text-white/25 text-center mt-6">
            {ratio >= 1
              ? `${planet.name} is ${ratio.toFixed(1)}× larger than Earth`
              : `${planet.name} is ${(ratio * 100).toFixed(0)}% the size of Earth`}
          </p>
        </div>
      </section>

      {/* ── Notable moons ── */}
      {majorMoons.length > 0 && (
        <section className="py-12 px-4 border-b border-white/[0.06]">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/35">
                Notable Moons
              </h2>
              {planet.moons > majorMoons.length && (
                <span className="text-xs text-white/25">
                  +{planet.moons - majorMoons.length} more
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              {majorMoons.map((moon, i) => (
                <MoonDot key={moon} name={moon} color={planet.color} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Fun facts rotator ── */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-7">
            <h2 className="text-2xl font-bold text-white">Fun Facts</h2>
            <div className="flex gap-1.5">
              {planet.funFacts.map((_, i) => (
                <button key={i} onClick={() => setFactIdx(i)} className="transition-all duration-200">
                  <div
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === factIdx ? 18 : 6,
                      height: 6,
                      backgroundColor: i === factIdx ? planet.color : 'rgba(255,255,255,0.2)',
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="relative min-h-[96px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={factIdx}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.32, ease: 'easeOut' }}
                className="flex gap-4 items-start p-5 rounded-xl border border-white/[0.07] bg-white/[0.03]"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0"
                  style={{ backgroundColor: planet.color }}
                />
                <p className="text-white/65 leading-relaxed">{planet.funFacts[factIdx]}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex gap-2 mt-4 justify-end">
            <button
              onClick={() =>
                setFactIdx((i) => (i - 1 + planet.funFacts.length) % planet.funFacts.length)
              }
              className="p-2 rounded-full border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setFactIdx((i) => (i + 1) % planet.funFacts.length)}
              className="p-2 rounded-full border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 transition-all"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ── Browse all ── */}
      <section className="py-8 px-4 mb-14">
        <div className="max-w-7xl mx-auto text-center">
          <Link
            href="/planets"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 transition-all duration-300 text-sm"
          >
            Browse all planets
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </div>
  );
}
