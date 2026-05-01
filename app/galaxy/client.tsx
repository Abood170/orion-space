'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InfoPanel } from '@/components/galaxy/star-info-panel';
import { GALAXY_STARS, type GalaxyStar } from '@/lib/galaxy-stars';
import { GALAXIES, NEBULAE, DEEP_SPACE_OBJECTS, type UniverseGalaxy, type UniverseNebula, type DeepSpaceObject } from '@/lib/universe-objects';
import type { CameraAnim, SelectedObject, ZoomLevel, FilterFlags } from '@/components/galaxy/galaxy-scene';

const GalaxyScene = dynamic(
  () => import('@/components/galaxy/galaxy-scene').then((m) => m.GalaxyScene),
  { ssr: false },
);

// ─── Camera preset views ───────────────────────────────────────────────────────
// Positions chosen to land squarely inside each zoom tier:
//   Level 1 (dist < 50):   Milky Way & Galaxy Core
//   Level 2 (dist 50-200): Local Group
//   Level 3 (dist > 200):  Universe
const CAMERA_VIEWS: { label: string; anim: CameraAnim }[] = [
  { label: 'Milky Way',   anim: { position: [0, 15, 30],    lookAt: [0, 0, 0]   } },
  { label: 'Local Group', anim: { position: [0, 40, 80],    lookAt: [0, 0, 0]   } },
  { label: 'Universe',    anim: { position: [0, 150, 300],  lookAt: [0, 0, 0]   } },
  { label: 'Galaxy Core', anim: { position: [0, 5, -18],    lookAt: [0, 0, -25] } },
];

// ─── Zoom level display metadata ──────────────────────────────────────────────
const ZOOM_META: Record<ZoomLevel, { icon: string; label: string; sub: string }> = {
  1: { icon: '📍', label: 'Milky Way',       sub: 'You are here · 100,000 light years across' },
  2: { icon: '🌌', label: 'Local Group',     sub: '~3 million light years · 54 galaxies'       },
  3: { icon: '🔭', label: 'Observable Universe', sub: '~93 billion light years · 2 trillion galaxies' },
};

// ─── Universe stats by zoom level ─────────────────────────────────────────────
const UNIVERSE_STATS: Record<ZoomLevel, { label: string; value: string }[]> = {
  1: [
    { label: 'Galaxy Type',   value: 'Barred Spiral'         },
    { label: 'Diameter',      value: '100,000 ly'            },
    { label: 'Stars',         value: '~300 billion'          },
    { label: 'Age',           value: '13.6 billion years'    },
    { label: 'Center',        value: 'Sagittarius A* (BH)'   },
  ],
  2: [
    { label: 'Group Name',    value: 'Local Group'           },
    { label: 'Diameter',      value: '~10 million ly'        },
    { label: 'Galaxies',      value: '~54 confirmed'         },
    { label: 'Dominant',      value: 'Milky Way & Andromeda' },
    { label: 'Fate',          value: 'Merge in ~4.5 Gyr'     },
  ],
  3: [
    { label: 'Scale',         value: 'Observable Universe'   },
    { label: 'Diameter',      value: '93 billion ly'         },
    { label: 'Galaxies',      value: '~2 trillion'           },
    { label: 'Age',           value: '13.8 billion years'    },
    { label: 'Contents',      value: '30 galaxies shown'     },
  ],
};

// ─── Filter icon/label pairs ───────────────────────────────────────────────────
const FILTER_DEFS: { key: keyof FilterFlags; icon: string; label: string; count: number }[] = [
  { key: 'stars',    icon: '⭐', label: 'Stars',      count: GALAXY_STARS.length },
  { key: 'galaxies', icon: '🌌', label: 'Galaxies',   count: GALAXIES.length - 1 }, // minus Milky Way
  { key: 'nebulae',  icon: '🌫️', label: 'Nebulae',    count: NEBULAE.length },
  { key: 'deep',     icon: '🔭', label: 'Deep Space', count: DEEP_SPACE_OBJECTS.length },
];

// ─── Legend ───────────────────────────────────────────────────────────────────
const LEGEND = [
  { color: '#aabbff', icon: '🔵', label: 'Blue Supergiant',  desc: 'very hot, 10–80× Sun'      },
  { color: '#ffffff', icon: '⚪', label: 'White/Blue Star',  desc: '1–10× Sun'                  },
  { color: '#ffee88', icon: '🟡', label: 'Yellow Dwarf',     desc: '~1× Sun (our Sun)'          },
  { color: '#ffaa44', icon: '🟠', label: 'Orange Giant',     desc: '10–50× Sun'                 },
  { color: '#ff4400', icon: '🔴', label: 'Red Supergiant',   desc: 'up to 1000× Sun'            },
  { color: '#ff3311', icon: '🔴', label: 'Red Dwarf',        desc: '0.1–0.5× Sun'               },
];

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

// ─── Client component ─────────────────────────────────────────────────────────
export function GalaxyClient() {
  const [selectedObj,  setSelectedObj]  = useState<SelectedObject | null>(null);
  const [cameraAnim,   setCameraAnim]   = useState<CameraAnim | null>(null);
  const [searchQuery,  setSearchQuery]  = useState('');
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [zoomLevel,    setZoomLevel]    = useState<ZoomLevel>(1);
  const [showHint,     setShowHint]     = useState(true);
  const [filters, setFilters] = useState<FilterFlags>({
    stars: true, galaxies: true, nebulae: true, deep: true,
  });

  const searchRef = useRef<HTMLDivElement>(null);

  // Hide zoom hint after 4 seconds
  useEffect(() => {
    const t = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(t);
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Combined search across all object types
  const lq = searchQuery.toLowerCase();
  const searchResults = searchQuery.length >= 2 ? [
    ...GALAXY_STARS.filter((s) => s.name.toLowerCase().includes(lq) || s.type.toLowerCase().includes(lq) || s.constellation.toLowerCase().includes(lq)).slice(0, 3).map((s) => ({ kind: 'star'   as const, icon: '⭐', label: s.name, sub: s.type,    color: s.color === '#000000' ? '#ff8800' : s.color, data: s })),
    ...GALAXIES.filter((g)    => g.name.toLowerCase().includes(lq) || g.type.toLowerCase().includes(lq)).slice(0, 3).map((g) => ({ kind: 'galaxy' as const, icon: '🌌', label: g.name, sub: g.type,    color: '#aabbff',  data: g })),
    ...NEBULAE.filter((n)     => n.name.toLowerCase().includes(lq) || n.type.toLowerCase().includes(lq)).slice(0, 2).map((n) => ({ kind: 'nebula' as const, icon: '🌫️', label: n.name, sub: n.type,    color: n.color,    data: n })),
    ...DEEP_SPACE_OBJECTS.filter((o) => o.name.toLowerCase().includes(lq) || o.type.toLowerCase().includes(lq)).slice(0, 2).map((o) => ({ kind: 'deep'   as const, icon: '🔭', label: o.name, sub: o.type,    color: o.color,    data: o })),
  ].slice(0, 10) : [];

  const handleStarClick = useCallback((star: GalaxyStar) => {
    setSelectedObj({ kind: 'star', data: star });
    setSearchQuery(''); setSearchOpen(false);
    const [x, y, z] = star.position;
    const dist = Math.sqrt(x*x + y*y + z*z);
    const zoom = Math.max(3, dist * 0.4 + 5);
    setCameraAnim({ position: [x + zoom * 0.5, y + zoom * 0.3, z + zoom], lookAt: [x, y, z] });
  }, []);

  const handleGalaxyClick = useCallback((galaxy: UniverseGalaxy) => {
    setSelectedObj({ kind: 'galaxy', data: galaxy });
    const [x, y, z] = galaxy.position;
    // View offset scales with galaxy diameter, capped so IC 1101 doesn't go crazy
    const viewDist = Math.max(15, Math.min(60, galaxy.diameterKly * 0.08));
    const camX = x + viewDist * 0.4;
    const camY = y + viewDist * 0.35;
    const camZ = z + viewDist;
    // Ensure camera origin-distance crosses the correct zoom threshold so galaxy blobs appear.
    // Local-group galaxies (dist < 5 Mly) need at least Level 2 (origin dist > 55).
    // Mid-range and distant galaxies are already far enough.
    const camOriginDist = Math.sqrt(camX * camX + camY * camY + camZ * camZ);
    const minDist = galaxy.distanceMly > 10 ? 0 : 58; // only enforce for local-group
    const scale = camOriginDist < minDist ? minDist / camOriginDist : 1;
    setCameraAnim({ position: [camX * scale, camY * scale, camZ * scale], lookAt: [x, y, z] });
  }, []);

  const handleNebulaClick = useCallback((nebula: UniverseNebula) => {
    setSelectedObj({ kind: 'nebula', data: nebula });
    const [x, y, z] = nebula.position;
    setCameraAnim({ position: [x + 2, y + 1.5, z + 3], lookAt: [x, y, z] });
  }, []);

  const handleDeepClick = useCallback((obj: DeepSpaceObject) => {
    setSelectedObj({ kind: 'deep', data: obj });
    const [x, y, z] = obj.position;
    setCameraAnim({ position: [x + 15, y + 10, z + 20], lookAt: [x, y, z] });
  }, []);

  const handleCameraView = useCallback((anim: CameraAnim) => {
    setCameraAnim(null);
    requestAnimationFrame(() => setCameraAnim(anim));
  }, []);

  const handleSearchSelect = useCallback((result: typeof searchResults[0]) => {
    setSearchQuery(''); setSearchOpen(false);
    if (result.kind === 'star')   handleStarClick(result.data as GalaxyStar);
    if (result.kind === 'galaxy') handleGalaxyClick(result.data as UniverseGalaxy);
    if (result.kind === 'nebula') handleNebulaClick(result.data as UniverseNebula);
    if (result.kind === 'deep')   handleDeepClick(result.data as DeepSpaceObject);
  }, [handleStarClick, handleGalaxyClick, handleNebulaClick, handleDeepClick]);

  const toggleFilter = useCallback((key: keyof FilterFlags) => {
    setFilters((f) => ({ ...f, [key]: !f[key] }));
  }, []);

  const zoomMeta = ZOOM_META[zoomLevel];

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#000005' }}>

      {/* 3D canvas */}
      <div className="absolute inset-0 z-0">
        <GalaxyScene
          selectedObj={selectedObj}
          onStarClick={handleStarClick}
          onGalaxyClick={handleGalaxyClick}
          onNebulaClick={handleNebulaClick}
          onDeepClick={handleDeepClick}
          cameraAnim={cameraAnim}
          searchQuery={searchQuery}
          zoomLevel={zoomLevel}
          onZoomChange={setZoomLevel}
          filters={filters}
        />
      </div>

      {/* ── UI overlay ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        {/* Top-left — back + title */}
        <motion.div
          className="absolute top-0 left-0 p-6 pointer-events-auto"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors mb-4">
            <BackIcon /> Back
          </Link>
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">Universe Explorer</h1>
          <p className="text-white/35 text-sm mt-1">30 galaxies · 15 nebulae · 40 stars · 10 deep-space objects</p>
        </motion.div>

        {/* Top-center — zoom level indicator */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 pt-6 pointer-events-none"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={zoomLevel}
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-center gap-0.5"
            >
              <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span className="text-sm">{zoomMeta.icon}</span>
                <span className="text-white/80 text-xs font-semibold tracking-wide">{zoomMeta.label}</span>
              </div>
              <span className="text-white/30 text-[10px] tracking-wide">{zoomMeta.sub}</span>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Top-right — search */}
        <motion.div
          className="absolute top-0 right-0 p-6 pointer-events-auto flex flex-col items-end gap-3"
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Filter toggles */}
          <div className="flex gap-1.5">
            {FILTER_DEFS.map(({ key, icon, label, count }) => (
              <button
                key={key}
                onClick={() => toggleFilter(key)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] transition-all"
                style={{
                  background: filters[key] ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${filters[key] ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.06)'}`,
                  color: filters[key] ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.25)',
                }}
                title={label}
              >
                <span>{icon}</span>
                <span className="hidden sm:inline">{count}</span>
              </button>
            ))}
          </div>

          {/* Search */}
          <div ref={searchRef} className="relative">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-white/30 text-sm">🔍</span>
              <input
                type="text" placeholder="Search universe…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchOpen(true); }}
                onFocus={() => setSearchOpen(true)}
                className="bg-transparent text-white/70 text-sm placeholder-white/20 outline-none w-44"
              />
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setSearchOpen(false); }} className="text-white/25 hover:text-white/50 text-xs transition-colors">×</button>
              )}
            </div>
            <AnimatePresence>
              {searchOpen && searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-1 right-0 w-full min-w-[200px] rounded-xl overflow-hidden z-40"
                  style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {searchResults.map((result, i) => (
                    <button key={i} onClick={() => handleSearchSelect(result)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-white/5 transition-colors text-left">
                      <span className="text-sm shrink-0 leading-none">{result.icon}</span>
                      <span className="text-white/70 text-xs flex-1 truncate">{result.label}</span>
                      <span className="text-white/25 text-[10px] ml-2 shrink-0 capitalize">{result.sub}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom-left — stats */}
        <motion.div
          className="absolute bottom-0 left-0 p-6 pointer-events-auto"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="rounded-2xl px-4 py-4 min-w-[200px]"
            style={{ background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={zoomLevel}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase mb-3">
                  {zoomLevel === 1 ? 'Milky Way Stats' : zoomLevel === 2 ? 'Local Group Stats' : 'Universe Stats'}
                </p>
                <div className="flex flex-col gap-2">
                  {UNIVERSE_STATS[zoomLevel].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <span className="text-white/25 text-[9px] uppercase tracking-wider">{label}</span>
                      <span className="text-white/70 text-xs">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Bottom-center — camera views + back to origin */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 p-6 pointer-events-auto flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className="text-white/20 text-[9px] tracking-[0.2em] uppercase">Camera Views</p>
          <div className="flex gap-2 flex-wrap justify-center">
            {CAMERA_VIEWS.map(({ label, anim }) => (
              <button key={label} onClick={() => handleCameraView(anim)}
                className="px-3 py-1.5 rounded-full text-[11px] tracking-wide text-white/40 border border-white/10 hover:text-white/70 hover:border-white/25 transition-all"
                style={{ backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.5)' }}>
                {label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Bottom-right — legend (only Level 1) */}
        <AnimatePresence>
          {zoomLevel === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-0 right-0 p-6 pointer-events-auto"
            >
              <div className="rounded-2xl px-4 py-4"
                style={{ background: 'rgba(0,0,0,0.68)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase mb-3">Star Types</p>
                <div className="flex flex-col gap-2.5">
                  {LEGEND.map(({ color, icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-2">
                      <span className="text-xs shrink-0 mt-0.5">{icon}</span>
                      <div>
                        <span className="text-white/55 text-[11px] font-medium">{label}</span>
                        <span className="text-white/25 text-[10px] ml-1">— {desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom hint overlay */}
        <AnimatePresence>
          {showHint && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-none"
            >
              <div className="px-5 py-2.5 rounded-full text-white/45 text-sm tracking-wide"
                style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Scroll to zoom out and explore the universe
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info panel (outside pointer-events-none wrapper) */}
      <InfoPanel selected={selectedObj} onClose={() => setSelectedObj(null)} />
    </div>
  );
}
