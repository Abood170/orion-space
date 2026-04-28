'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { StarInfoPanel } from '@/components/galaxy/star-info-panel';
import { GALAXY_STARS, type GalaxyStar } from '@/lib/galaxy-stars';
import type { CameraAnim } from '@/components/galaxy/galaxy-scene';

const GalaxyScene = dynamic(
  () => import('@/components/galaxy/galaxy-scene').then((m) => m.GalaxyScene),
  { ssr: false },
);

// ─── View presets ──────────────────────────────────────────────────────────────
const CAMERA_VIEWS: { label: string; anim: CameraAnim }[] = [
  { label: 'Top View',  anim: { position: [0, 50, 1],    lookAt: [0, 0, 0]    } },
  { label: 'Side View', anim: { position: [0, 5, 50],    lookAt: [0, 0, 0]    } },
  { label: 'Core View', anim: { position: [0, 4, -15],   lookAt: [0, 0, -25]  } },
];

// ─── Star type legend ─────────────────────────────────────────────────────────
const LEGEND = [
  { color: '#aabbff', label: 'Blue Supergiant' },
  { color: '#ffffff', label: 'White Star'       },
  { color: '#ffee88', label: 'Yellow Dwarf (like our Sun)' },
  { color: '#ffaa44', label: 'Orange Giant'    },
  { color: '#ff4422', label: 'Red Supergiant'  },
  { color: '#ff6644', label: 'Red Dwarf'       },
];

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

// ─── Stats card ───────────────────────────────────────────────────────────────
const GALAXY_STATS = [
  { label: 'Galaxy Type',  value: 'Barred Spiral' },
  { label: 'Diameter',     value: '100,000 ly'    },
  { label: 'Stars',        value: '~300 billion'  },
  { label: 'Age',          value: '13.6 billion years' },
  { label: 'Center',       value: 'Sagittarius A* (black hole)' },
];

// ─── Client component ─────────────────────────────────────────────────────────
export function GalaxyClient() {
  const [selectedStar,  setSelectedStar]  = useState<GalaxyStar | null>(null);
  const [cameraAnim,    setCameraAnim]    = useState<CameraAnim | null>(null);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchOpen,    setSearchOpen]    = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const searchResults = searchQuery.length >= 2
    ? GALAXY_STARS.filter((s) => s.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 6)
    : [];

  const handleStarClick = useCallback((star: GalaxyStar) => {
    setSelectedStar(star);
    setSearchQuery('');
    setSearchOpen(false);
    // Fly camera toward the star
    const [x, y, z] = star.position;
    const dist = Math.sqrt(x*x + y*y + z*z);
    const zoom = Math.max(3, dist * 0.4 + 5);
    // Offset the camera to look at the star from a slight angle
    setCameraAnim({
      position: [x + zoom * 0.5, y + zoom * 0.3, z + zoom],
      lookAt:   [x, y, z],
    });
  }, []);

  const handleCameraView = useCallback((anim: CameraAnim) => {
    setCameraAnim(null);
    requestAnimationFrame(() => setCameraAnim(anim));
  }, []);

  const handleSearchSelect = useCallback((star: GalaxyStar) => {
    handleStarClick(star);
  }, [handleStarClick]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#000005' }}>

      {/* 3D canvas */}
      <div className="absolute inset-0 z-0">
        <GalaxyScene
          selectedStar={selectedStar}
          onStarClick={handleStarClick}
          cameraAnim={cameraAnim}
          searchQuery={searchQuery}
        />
      </div>

      {/* ── UI overlay ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        {/* Top-left — back + title */}
        <motion.div
          className="absolute top-0 left-0 p-6 pointer-events-auto"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors mb-4"
          >
            <BackIcon /> Back
          </Link>
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">Milky Way Galaxy</h1>
          <p className="text-white/35 text-sm mt-1">~100,000 light years across · 200–400 billion stars</p>
        </motion.div>

        {/* Top-right — search */}
        <motion.div
          className="absolute top-0 right-0 p-6 pointer-events-auto"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div ref={searchRef} className="relative">
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{
                background: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span className="text-white/30 text-sm">🔍</span>
              <input
                type="text"
                placeholder="Search stars…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                className="bg-transparent text-white/70 text-sm placeholder-white/20 outline-none w-40"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchOpen(false); }}
                  className="text-white/25 hover:text-white/50 text-xs transition-colors"
                >
                  ×
                </button>
              )}
            </div>

            {/* Search dropdown */}
            <AnimatePresence>
              {searchOpen && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1 right-0 w-full min-w-[180px] rounded-xl overflow-hidden z-40"
                  style={{
                    background: 'rgba(0,0,0,0.88)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  {searchResults.map((star) => (
                    <button
                      key={star.id}
                      onClick={() => handleSearchSelect(star)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left"
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: star.color }} />
                      <span className="text-white/70 text-xs">{star.name}</span>
                      <span className="text-white/25 text-[10px] ml-auto">{star.type}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom-left — galaxy stats */}
        <motion.div
          className="absolute bottom-0 left-0 p-6 pointer-events-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div
            className="rounded-2xl px-4 py-4 min-w-[200px]"
            style={{
              background: 'rgba(0,0,0,0.68)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase mb-3">Galaxy Stats</p>
            <div className="flex flex-col gap-2">
              {GALAXY_STATS.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-white/25 text-[9px] uppercase tracking-wider">{label}</span>
                  <span className="text-white/70 text-xs">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom-center — camera view controls */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 p-6 pointer-events-auto flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase">Camera Views</p>
          <div className="flex gap-2">
            {CAMERA_VIEWS.map(({ label, anim }) => (
              <button
                key={label}
                onClick={() => handleCameraView(anim)}
                className="px-3 py-1.5 rounded-full text-[11px] tracking-wide text-white/40 border border-white/10 hover:text-white/70 hover:border-white/25 transition-all"
                style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.5)' }}
              >
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bottom-right — star type legend */}
        <motion.div
          className="absolute bottom-0 right-0 p-6 pointer-events-auto"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div
            className="rounded-2xl px-4 py-4"
            style={{
              background: 'rgba(0,0,0,0.68)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase mb-3">Star Types</p>
            <div className="flex flex-col gap-2">
              {LEGEND.map(({ color, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
                  <span className="text-white/45 text-[11px]">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Star info panel (outside pointer-events-none div) */}
      <StarInfoPanel
        star={selectedStar}
        onClose={() => setSelectedStar(null)}
      />
    </div>
  );
}
