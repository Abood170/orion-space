'use client';

import { useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'motion/react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import {
  timelineEvents,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  type Category,
  type TimelineEvent,
} from '@/lib/timeline';

const ALL_CATEGORIES: Category[] = [
  'satellite', 'human', 'station', 'telescope', 'rover', 'private',
];

interface EventCardProps {
  event: TimelineEvent;
  isLeft: boolean;
}

function EventCard({ event, isLeft }: EventCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 80, damping: 22 }}
      viewport={{ once: true, margin: '-80px' }}
      whileHover={{ y: -4 }}
      className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.03] cursor-default transition-shadow"
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 40px ${event.color}20`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
      }}
    >
      <p className="text-3xl font-black leading-none mb-3" style={{ color: event.color }}>
        {event.year}
      </p>
      <div className="flex flex-wrap gap-2 mb-3">
        <span
          className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `${event.color}20`,
            color: event.color,
            border: `1px solid ${event.color}40`,
          }}
        >
          {CATEGORY_LABELS[event.category]}
        </span>
        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide bg-white/[0.06] text-white/50 border border-white/[0.08]">
          {event.agency}
        </span>
      </div>
      <h3 className="text-base font-bold text-white leading-snug mb-2">{event.title}</h3>
      <p className="text-sm text-white/55 leading-relaxed">{event.description}</p>
    </motion.div>
  );
}

function DecadeMarker({ decade }: { decade: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.3 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      viewport={{ once: true }}
      className="relative flex items-center justify-center h-20 pointer-events-none select-none overflow-hidden -mx-4 mb-2"
    >
      <span className="text-[6rem] font-black text-white/[0.04] leading-none absolute">
        {decade}s
      </span>
    </motion.div>
  );
}

interface EventWithMeta extends TimelineEvent {
  showDecade: boolean;
  decade: number;
}

function withDecadeMarkers(events: TimelineEvent[]): EventWithMeta[] {
  return events.reduce<EventWithMeta[]>((acc, event) => {
    const decade = Math.floor(event.year / 10) * 10;
    const prev = acc[acc.length - 1];
    const showDecade = !prev || Math.floor(prev.year / 10) * 10 !== decade;
    return [...acc, { ...event, showDecade, decade }];
  }, []);
}

export function TimelineClient() {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const desktopRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      activeCategory === 'all'
        ? timelineEvents
        : timelineEvents.filter((e) => e.category === activeCategory),
    [activeCategory],
  );

  const eventsWithMeta = useMemo(() => withDecadeMarkers(filtered), [filtered]);

  const { scrollYProgress } = useScroll({
    target: desktopRef,
    offset: ['start end', 'end center'],
  });
  const lineScaleY = useSpring(scrollYProgress, { stiffness: 60, damping: 25 });

  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Back + header */}
        <div style={{ animation: 'fadeUp 0.5s ease-out both' }}>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back
          </Link>
          <p className="text-blue-400 text-xs font-semibold tracking-[0.25em] uppercase mb-3">
            History
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-4">
            Space Exploration
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
              Timeline
            </span>
          </h1>
          <p className="text-white/45 max-w-xl leading-relaxed mb-12">
            From Sputnik to Starship — every milestone that took humanity from the ground to the
            stars.
          </p>
        </div>

        {/* Filter bar */}
        <div
          className="flex flex-wrap gap-2 mb-16"
          style={{ animation: 'fadeUp 0.6s ease-out 0.1s both' }}
        >
          <button
            onClick={() => setActiveCategory('all')}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={{
              background: activeCategory === 'all' ? '#3b82f6' : 'rgba(255,255,255,0.06)',
              color: activeCategory === 'all' ? '#fff' : 'rgba(255,255,255,0.5)',
              border: `1px solid ${activeCategory === 'all' ? '#3b82f660' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            All
          </button>
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
              style={{
                background:
                  activeCategory === cat ? `${CATEGORY_COLORS[cat]}22` : 'rgba(255,255,255,0.06)',
                color: activeCategory === cat ? CATEGORY_COLORS[cat] : 'rgba(255,255,255,0.5)',
                border: `1px solid ${activeCategory === cat ? `${CATEGORY_COLORS[cat]}50` : 'rgba(255,255,255,0.08)'}`,
              }}
            >
              {CATEGORY_LABELS[cat]}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {/* Desktop: two-column with scroll-driven center line */}
            <div ref={desktopRef} className="relative hidden lg:block">
              <motion.div
                className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-blue-500/40 via-purple-500/30 to-blue-500/20"
                style={{ scaleY: lineScaleY, transformOrigin: 'top' }}
              />
              <div className="space-y-8">
                {eventsWithMeta.map((event, i) => {
                  const isLeft = i % 2 === 0;
                  return (
                    <div key={event.year + event.title + event.agency}>
                      {event.showDecade && <DecadeMarker decade={event.decade} />}
                      <div className="relative flex items-start">
                        <div
                          className="w-[calc(50%-2rem)]"
                          style={{ marginLeft: isLeft ? 0 : 'auto', marginRight: isLeft ? 'auto' : 0 }}
                        >
                          <EventCard event={event} isLeft={isLeft} />
                        </div>
                        <motion.div
                          className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
                          animate={{ scale: [1, 2.8], opacity: [0.45, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: (i % 6) * 0.35,
                          }}
                          style={{
                            width: 16,
                            height: 16,
                            backgroundColor: event.color,
                            top: '1.5rem',
                            zIndex: 9,
                          }}
                        />
                        <div
                          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full z-10 flex-shrink-0"
                          style={{
                            backgroundColor: event.color,
                            boxShadow: `0 0 14px ${event.color}70`,
                            border: '3px solid #0a0a0f',
                            top: '1.5rem',
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Mobile: single column */}
            <div className="lg:hidden space-y-5">
              {eventsWithMeta.map((event, i) => (
                <div key={event.year + event.title + event.agency}>
                  {event.showDecade && <DecadeMarker decade={event.decade} />}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center flex-shrink-0 pt-6">
                      <div className="relative">
                        <motion.div
                          className="absolute rounded-full pointer-events-none"
                          animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeOut',
                            delay: (i % 5) * 0.3,
                          }}
                          style={{
                            width: 12,
                            height: 12,
                            backgroundColor: event.color,
                            top: 0,
                            left: 0,
                          }}
                        />
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0 relative z-10"
                          style={{
                            backgroundColor: event.color,
                            boxShadow: `0 0 8px ${event.color}60`,
                          }}
                        />
                      </div>
                      {i < eventsWithMeta.length - 1 && (
                        <div className="w-px flex-1 mt-1 bg-white/[0.07]" />
                      )}
                    </div>
                    <div className="flex-1 pb-2">
                      <EventCard event={event} isLeft={true} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Footer coda */}
        <div className="text-center pt-20 pb-8">
          <div className="w-px h-16 bg-gradient-to-b from-purple-500/40 to-transparent mx-auto mb-8" />
          <p className="text-2xl sm:text-3xl font-bold text-white/60 mb-2">
            The future is unwritten
            <motion.span
              animate={{ opacity: [1, 1, 0, 0] }}
              transition={{ duration: 1, repeat: Infinity, times: [0, 0.45, 0.5, 0.95] }}
              className="ml-0.5 text-blue-400"
            >
              |
            </motion.span>
          </p>
          <p className="text-white/30 text-sm tracking-wide">Next chapter coming soon</p>
        </div>
      </div>
    </div>
  );
}
