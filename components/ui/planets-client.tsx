'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search } from 'lucide-react';
import { planets } from '@/lib/planets';
import { PlanetCard } from '@/components/ui/planet-card';

type Filter = 'all' | 'rocky' | 'gas';

const filters: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All Planets' },
  { value: 'rocky', label: 'Rocky' },
  { value: 'gas', label: 'Gas Giants' },
];

export function PlanetsClient() {
  const [active, setActive] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = planets
    .filter((p) => active === 'all' || p.type === active)
    .filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="min-h-screen pt-24 pb-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div
          className="text-center mb-10"
          style={{ animation: 'fadeUp 0.6s ease-out 0.05s both' }}
        >
          <p className="text-blue-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            Our Solar System
          </p>
          <h1 className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-5">
            All Planets
          </h1>
          <p className="text-white/45 text-lg max-w-xl mx-auto leading-relaxed">
            Explore every world orbiting our Sun — from the rocky inner planets to
            the vast gas giants of the outer Solar System.
          </p>
        </div>

        {/* Search */}
        <div
          className="flex justify-center mb-6"
          style={{ animation: 'fadeUp 0.6s ease-out 0.1s both' }}
        >
          <div
            className="relative w-full max-w-xs rounded-full transition-all duration-300"
            style={{
              boxShadow: searchFocused
                ? '0 0 0 1px rgba(59,130,246,0.5), 0 0 20px rgba(59,130,246,0.12)'
                : 'none',
            }}
          >
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search planets…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full pl-9 pr-4 py-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] text-white text-sm placeholder-white/30 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.06] transition-all"
            />
          </div>
        </div>

        {/* Filter bar */}
        <div
          className="flex justify-center mb-12"
          style={{ animation: 'fadeUp 0.6s ease-out 0.15s both' }}
        >
          <div className="flex gap-1 p-1 rounded-full border border-white/[0.08] bg-white/[0.03]">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setActive(f.value)}
                className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors duration-200 z-10"
                style={{ color: active === f.value ? '#fff' : 'rgba(255,255,255,0.45)' }}
              >
                {active === f.value && (
                  <motion.div
                    layoutId="planets-filter-indicator"
                    className="absolute inset-0 rounded-full bg-blue-600"
                    style={{ zIndex: -1 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <AnimatePresence mode="wait">
          {filtered.length > 0 ? (
            <motion.div
              key={`${active}-${query}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -20 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            >
              {filtered.map((planet, i) => (
                <PlanetCard key={planet.slug} planet={planet} index={i} />
              ))}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center text-white/30 text-sm py-20"
            >
              No planets match &ldquo;{query}&rdquo;
            </motion.p>
          )}
        </AnimatePresence>

        {/* Count */}
        <p className="text-center text-white/25 text-sm mt-10">
          Showing {filtered.length} of {planets.length} planets
        </p>
      </div>
    </div>
  );
}
