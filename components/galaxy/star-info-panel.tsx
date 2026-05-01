'use client';

import { motion, AnimatePresence } from 'motion/react';
import type { GalaxyStar } from '@/lib/galaxy-stars';
import type { UniverseGalaxy, UniverseNebula, DeepSpaceObject } from '@/lib/universe-objects';
import type { SelectedObject } from './galaxy-scene';

interface Props {
  selected: SelectedObject | null;
  onClose: () => void;
}

// ─── Formatters ───────────────────────────────────────────────────────────────
function formatDistance(ly: number): string {
  if (ly === 0) return '0 (our star)';
  if (ly < 100)  return `${ly.toFixed(2)} ly`;
  if (ly < 1000) return `${ly.toFixed(0)} ly`;
  return `${(ly / 1000).toFixed(2)}k ly`;
}
function magnitudeLabel(mag: number): string {
  if (mag < -5) return 'Extraordinarily bright';
  if (mag < 0)  return 'Extremely bright';
  if (mag < 2)  return 'Visible to the naked eye';
  if (mag < 6)  return 'Barely visible naked eye';
  if (mag < 10) return 'Requires binoculars';
  return 'Requires a telescope';
}
function formatLuminosity(lum: number): string {
  if (lum >= 1_000_000) return `${(lum / 1_000_000).toFixed(2)}M × Sun`;
  if (lum >= 1_000)     return `${(lum / 1_000).toFixed(1)}k × Sun`;
  if (lum >= 1)         return `${lum.toFixed(2)} × Sun`;
  return `${lum.toFixed(3)} × Sun`;
}
function formatRadius(r: number): string {
  if (r >= 1_000_000) return `${(r / 1_000_000).toFixed(2)}M × Sun`;
  if (r >= 1_000)     return `${(r / 1_000).toFixed(1)}k × Sun`;
  return `${r.toFixed(2)} × Sun`;
}
function starCircleSize(radiusSolar: number): number {
  return Math.max(6, Math.min(80, 20 * Math.pow(radiusSolar, 0.4)));
}

// ─── Shared panel wrapper ──────────────────────────────────────────────────────
function PanelShell({
  id, onClose, headerColor, headerContent, children,
}: {
  id: string; onClose: () => void; headerColor: string;
  headerContent: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <motion.div
      key={id}
      initial={{ x: 340, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 340, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
      className="fixed top-20 right-4 w-80 z-30 rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(0,0,0,0.82)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.08)',
        maxHeight: 'calc(100vh - 100px)',
        overflowY: 'auto',
      }}
    >
      <div className="px-5 pt-5 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">{headerContent}</div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white/30 hover:text-white/70 transition-colors text-lg leading-none"
            style={{ color: headerColor }}
          >
            ×
          </button>
        </div>
      </div>
      {children}
    </motion.div>
  );
}

function TypeBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium tracking-wider uppercase"
      style={{ background: `${color}18`, border: `1px solid ${color}40`, color }}
    >
      {label}
    </span>
  );
}

function FactsList({ facts }: { facts: string[] }) {
  return (
    <div className="px-5 py-4">
      <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">Facts</p>
      <ul className="flex flex-col gap-2.5">
        {facts.map((fact, i) => (
          <li key={i} className="flex gap-2.5 text-xs text-white/55 leading-relaxed">
            <span className="shrink-0 mt-0.5 w-1 h-1 rounded-full bg-current opacity-50" />
            {fact}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Star panel ───────────────────────────────────────────────────────────────
function StarPanel({ star, onClose }: { star: GalaxyStar; onClose: () => void }) {
  const displayColor = star.color === '#000000' ? '#ff8800' : star.color;
  const starSize     = starCircleSize(star.radiusSolar);
  const sizeLabel    =
    star.radiusSolar >= 2
      ? `${star.radiusSolar >= 1000 ? (star.radiusSolar / 1000).toFixed(1) + 'k' : star.radiusSolar.toFixed(0)}× the size of our Sun`
      : star.radiusSolar < 1
        ? `${(star.radiusSolar * 100).toFixed(0)}% the size of our Sun`
        : `~${star.radiusSolar.toFixed(2)}× the size of our Sun`;

  return (
    <PanelShell
      id={`star-${star.id}`} onClose={onClose} headerColor={displayColor}
      headerContent={
        <>
          <h2 className="text-xl font-bold leading-tight" style={{ color: displayColor }}>{star.name}</h2>
          <TypeBadge label={star.type} color={displayColor} />
          <p className="text-white/35 text-xs mt-2">Constellation: {star.constellation}</p>
        </>
      }
    >
      {/* Size comparison */}
      <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white/30 text-[10px] uppercase tracking-wider mb-3">Size Comparison</p>
        <div className="flex items-end gap-4 mb-2">
          <div className="flex flex-col items-center gap-1">
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #ffee88, #ffcc44)', boxShadow: '0 0 8px #ffee8880', flexShrink: 0 }} />
            <span className="text-white/25 text-[9px]">Sun</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <div style={{ width: starSize, height: starSize, borderRadius: '50%', background: `radial-gradient(circle at 35% 35%, ${displayColor}cc, ${displayColor}66)`, boxShadow: `0 0 ${Math.round(starSize * 0.4)}px ${displayColor}50`, flexShrink: 0 }} />
            <span className="text-white/25 text-[9px] truncate max-w-[80px] text-center">{star.name}</span>
          </div>
        </div>
        <p className="text-white/40 text-[11px]">{sizeLabel}</p>
      </div>
      {/* Stats */}
      <div className="px-5 py-4 flex flex-col gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Distance</p>
          <p className="text-white/80 text-sm font-medium">{formatDistance(star.distanceLY)}</p>
          {star.distanceLY > 0 && <p className="text-white/25 text-[10px] mt-0.5">{star.distanceLY.toFixed(0)} years at light speed</p>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Temperature</p>
            <p className="text-white/80 text-sm font-medium">{star.tempK.toLocaleString()} K</p>
          </div>
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Luminosity</p>
            <p className="text-white/80 text-sm font-medium">{formatLuminosity(star.luminosity)}</p>
          </div>
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Radius</p>
            <p className="text-white/80 text-sm font-medium">{formatRadius(star.radiusSolar)}</p>
          </div>
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Magnitude</p>
            <p className="text-white/80 text-sm font-medium">{star.magnitude}</p>
            <p className="text-white/25 text-[10px] mt-0.5">{magnitudeLabel(star.magnitude)}</p>
          </div>
        </div>
      </div>
      <FactsList facts={star.facts} />
    </PanelShell>
  );
}

// ─── Galaxy panel ─────────────────────────────────────────────────────────────
const MILKY_WAY_DIAMETER_KLY = 100;
const TYPE_COLORS: Record<UniverseGalaxy['type'], string> = {
  spiral:     '#ccddff',
  elliptical: '#ffeecc',
  irregular:  '#ffccee',
  lenticular: '#ddeedd',
  dwarf:      '#ffddcc',
};

function GalaxyPanel({ galaxy, onClose }: { galaxy: UniverseGalaxy; onClose: () => void }) {
  const color = TYPE_COLORS[galaxy.type] ?? '#ffffff';
  const sizeRatio = (galaxy.diameterKly / MILKY_WAY_DIAMETER_KLY).toFixed(2);

  return (
    <PanelShell
      id={`galaxy-${galaxy.id}`} onClose={onClose} headerColor={color}
      headerContent={
        <>
          <h2 className="text-xl font-bold leading-tight text-white">{galaxy.name}</h2>
          <TypeBadge label={galaxy.type} color={color} />
        </>
      }
    >
      <div className="px-5 py-4 flex flex-col gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white/50 text-xs leading-relaxed">{galaxy.description}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Distance</p>
            <p className="text-white/80 text-sm font-medium">
              {galaxy.distanceMly === 0 ? 'Here' : `${galaxy.distanceMly.toLocaleString()} Mly`}
            </p>
          </div>
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Diameter</p>
            <p className="text-white/80 text-sm font-medium">{galaxy.diameterKly.toLocaleString()} kly</p>
            <p className="text-white/25 text-[10px] mt-0.5">{sizeRatio}× Milky Way</p>
          </div>
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Stars</p>
            <p className="text-white/80 text-sm font-medium">{galaxy.stars}</p>
          </div>
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Discovered</p>
            <p className="text-white/80 text-sm font-medium">
              {galaxy.discoveredYear === 0 ? 'Antiquity' : galaxy.discoveredYear}
            </p>
            <p className="text-white/25 text-[10px] mt-0.5 truncate">{galaxy.discoveredBy}</p>
          </div>
        </div>
      </div>
      <FactsList facts={galaxy.facts} />
    </PanelShell>
  );
}

// ─── Nebula panel ─────────────────────────────────────────────────────────────
function NebulaPanel({ nebula, onClose }: { nebula: UniverseNebula; onClose: () => void }) {
  return (
    <PanelShell
      id={`nebula-${nebula.id}`} onClose={onClose} headerColor={nebula.color}
      headerContent={
        <>
          <h2 className="text-xl font-bold leading-tight text-white">{nebula.name}</h2>
          <TypeBadge label={nebula.type} color={nebula.color} />
        </>
      }
    >
      <div className="px-5 py-4 flex flex-col gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white/50 text-xs leading-relaxed">{nebula.description}</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Distance</p>
            <p className="text-white/80 text-sm font-medium">{nebula.distanceLy.toLocaleString()} ly</p>
          </div>
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Discovered</p>
            <p className="text-white/80 text-sm font-medium">{nebula.discoveredYear}</p>
          </div>
        </div>
      </div>
      <FactsList facts={nebula.facts} />
    </PanelShell>
  );
}

// ─── Deep space panel ─────────────────────────────────────────────────────────
function DeepPanel({ obj, onClose }: { obj: DeepSpaceObject; onClose: () => void }) {
  return (
    <PanelShell
      id={`deep-${obj.id}`} onClose={onClose} headerColor={obj.color}
      headerContent={
        <>
          <h2 className="text-xl font-bold leading-tight text-white">{obj.name}</h2>
          <TypeBadge label={obj.type} color={obj.color} />
        </>
      }
    >
      <div className="px-5 py-4 flex flex-col gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <p className="text-white/50 text-xs leading-relaxed">{obj.description}</p>
        <div>
          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-0.5">Distance</p>
          <p className="text-white/80 text-sm font-medium">{obj.distanceMly.toLocaleString()} Mly</p>
        </div>
      </div>
      <FactsList facts={obj.facts} />
    </PanelShell>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────
export function InfoPanel({ selected, onClose }: Props) {
  return (
    <AnimatePresence mode="wait">
      {selected?.kind === 'star'   && <StarPanel   key={`star-${selected.data.id}`}   star={selected.data}   onClose={onClose} />}
      {selected?.kind === 'galaxy' && <GalaxyPanel key={`galaxy-${selected.data.id}`} galaxy={selected.data} onClose={onClose} />}
      {selected?.kind === 'nebula' && <NebulaPanel key={`nebula-${selected.data.id}`} nebula={selected.data} onClose={onClose} />}
      {selected?.kind === 'deep'   && <DeepPanel   key={`deep-${selected.data.id}`}   obj={selected.data}    onClose={onClose} />}
    </AnimatePresence>
  );
}

// Keep old export name as alias so any remaining imports don't break
export { InfoPanel as StarInfoPanel };
