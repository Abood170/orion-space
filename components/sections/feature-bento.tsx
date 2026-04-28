'use client';

import { motion } from 'motion/react';
import Link from 'next/link';

interface BentoCard {
  icon: string;
  title: string;
  description: string;
  href: string;
  accent: string;
  span?: 'wide' | 'tall' | 'normal';
}

const CARDS: BentoCard[] = [
  {
    icon: '🪐',
    title: '8 Planets',
    description:
      'Explore every planet in our solar system with detailed 3D models, atmospheric data, and rich scientific profiles.',
    href: '/planets',
    accent: 'rgba(59,130,246,0.12)',
    span: 'wide',
  },
  {
    icon: '🔭',
    title: 'Live Orrery',
    description:
      'Watch the solar system move in real time — accurate orbital mechanics rendered in WebGL.',
    href: '/orrery',
    accent: 'rgba(139,92,246,0.12)',
    span: 'normal',
  },
  {
    icon: '📜',
    title: 'Space Timeline',
    description:
      'From Sputnik to Starship — a visual history of humanity\'s greatest journey beyond Earth.',
    href: '/timeline',
    accent: 'rgba(16,185,129,0.12)',
    span: 'normal',
  },
  {
    icon: '🌟',
    title: '3D Interactive',
    description:
      'Every planet is a fully interactive 3D scene. Rotate, zoom, and discover surface details.',
    href: '/planets',
    accent: 'rgba(245,158,11,0.12)',
    span: 'wide',
  },
];

function BentoCard({ card, index }: { card: BentoCard; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay: index * 0.09, ease: 'easeOut' }}
      className={card.span === 'wide' ? 'sm:col-span-2' : 'col-span-1'}
    >
      <Link href={card.href} className="group block h-full">
        <motion.div
          whileHover={{ y: -4, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
          className="relative h-full min-h-[160px] rounded-2xl p-6 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${card.accent} 0%, rgba(255,255,255,0.02) 100%)`,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Hover glow */}
          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(400px circle at 50% 0%, ${card.accent} 0%, transparent 70%)`,
            }}
          />
          {/* Top border shimmer on hover */}
          <div
            className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${card.accent.replace('0.12', '0.6')}, transparent)`,
            }}
          />

          <div className="relative z-10">
            <span className="text-3xl mb-4 block">{card.icon}</span>
            <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-white transition-colors">
              {card.title}
            </h3>
            <p className="text-white/45 text-sm leading-relaxed group-hover:text-white/60 transition-colors">
              {card.description}
            </p>
          </div>

          {/* Arrow indicator */}
          <motion.div
            className="absolute bottom-5 right-5 text-white/20 group-hover:text-white/50 transition-colors duration-300 text-lg"
            animate={{ x: 0 }}
            whileHover={{ x: 3 }}
          >
            →
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export function FeatureBento() {
  return (
    <section className="w-full py-16 px-4">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-blue-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            Why Orion Space
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything you need to explore
          </h2>
          <p className="text-white/40 mt-3 text-base max-w-md mx-auto">
            A complete interactive astronomy experience built for curious minds.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CARDS.map((card, i) => (
            <BentoCard key={card.title} card={card} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
