'use client';

import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import type { Planet } from '@/lib/planets';
import { Planet3D } from './planet-3d';
import { Tooltip } from './tooltip';

interface PlanetCardProps {
  planet: Planet;
  index: number;
}

export function PlanetCard({ planet, index }: PlanetCardProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 280, damping: 28 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 280, damping: 28 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => { mx.set(0); my.set(0); };

  const tooltipContent = (
    <span>
      <span className="text-white/60">⌀ </span>{planet.diameter}
      <span className="mx-1.5 text-white/20">·</span>
      <span className="text-white/60">☀ </span>{planet.distanceFromSun}
    </span>
  );

  return (
    <Tooltip content={tooltipContent} side="top">
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: 'easeOut' }}
      viewport={{ once: true, margin: '-60px' }}
    >
      {/* Idle float animation */}
      <motion.div
        animate={{ y: [-6, 0, -6] }}
        transition={{
          duration: 3 + index * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.15,
        }}
        style={{ perspective: 900 }}
      >
        {/* 3-D tilt + tap */}
        <motion.div
          style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          whileTap={{ scale: 0.97 }}
          whileHover={{
            scale: 1.03,
            boxShadow: `0 0 35px ${planet.color}70, 0 20px 60px ${planet.color}25`,
          }}
          transition={{ duration: 0.2 }}
          className="h-full rounded-2xl"
        >
          <Link href={`/planets/${planet.slug}`} className="block group h-full">
            <div className="relative p-6 rounded-2xl border border-white/[0.08] bg-white/[0.03] overflow-hidden cursor-pointer h-full">

              {/* Hover gradient glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(ellipse at 50% 0%, ${planet.color}20 0%, transparent 70%)`,
                }}
              />
              {/* Inset border glow on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{ boxShadow: `inset 0 0 0 1px ${planet.color}44` }}
              />

              {/* Card content */}
              <div className="relative z-10 flex flex-col items-center text-center gap-4">
                <div className="w-24 h-24 flex-shrink-0">
                  <Planet3D
                    color={planet.color}
                    secondaryColor={planet.secondaryColor}
                    hasRings={planet.hasRings}
                    isGasGiant={planet.type === 'gas'}
                    rotationSpeed={0.28}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white tracking-wide">{planet.name}</h3>
                  <p className="text-xs text-white/40 mt-1 uppercase tracking-widest">
                    {planet.type === 'rocky' ? 'Rocky Planet' : 'Gas Giant'}
                  </p>
                </div>

                <p className="text-sm text-white/55 leading-relaxed">{planet.keyFact}</p>
              </div>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-3/5 transition-all duration-500"
                style={{ backgroundColor: planet.color }}
              />
            </div>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
    </Tooltip>
  );
}
