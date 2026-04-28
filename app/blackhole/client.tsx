'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { InfoPanel } from '@/components/blackhole/info-panel';
import { DestructionLog, type LogEntry } from '@/components/blackhole/destruction-log';
import { BH_PLANETS, PLANET_ORDER, type PlanetKey, type BHPlanetDef } from '@/lib/blackhole-planets';
import type { CameraPreset } from '@/components/blackhole/black-hole-scene';
import { blackHoleAudio } from '@/lib/blackhole-audio';

const BlackHoleScene = dynamic(
  () => import('@/components/blackhole/black-hole-scene').then((m) => m.BlackHoleScene),
  { ssr: false },
);

// ─── Constants ─────────────────────────────────────────────────────────────────
const FUN_FACTS = [
  'Sagittarius A* is 4 million times more massive than our Sun.',
  'Time near a black hole passes slower — at the event horizon it nearly stops.',
  'The first image of a black hole (M87*) was captured in 2019 by the Event Horizon Telescope.',
  'Nothing — not even light — can escape beyond the event horizon.',
  "Black holes don't \"suck\" — they curve spacetime, and matter spirals in naturally.",
  'Stephen Hawking theorized black holes slowly evaporate by emitting Hawking radiation.',
];

const STAGE_MESSAGES: Record<string, { text: string; cls: string }> = {
  tidal:   { text: '⚠️ Tidal forces detected — structural integrity failing', cls: 'text-yellow-400/80' },
  spaghet: { text: '💀 SPAGHETTIFICATION — Matter stretched to atomic level',  cls: 'text-red-400/90' },
};

const CAMERA_PRESETS: { key: CameraPreset; label: string }[] = [
  { key: 'front', label: 'Front' },
  { key: 'top',   label: 'Top'   },
  { key: 'side',  label: 'Side'  },
];

function gravityLabel(g: number) {
  if (g < 0.5) return 'Calm — distant orbit';
  if (g < 1.2) return 'Moderate — inner disk';
  if (g < 2.0) return 'Intense — near horizon';
  return 'Critical — event horizon';
}

function BackIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 5l-7 7 7 7" />
    </svg>
  );
}

// ─── Planet selector button ─────────────────────────────────────────────────────
function PlanetButton({
  def, active, disabled, onClick,
}: {
  def: BHPlanetDef;
  active: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex flex-col items-center gap-1 px-2 py-2 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-white/5"
      style={active ? { outline: `1.5px solid ${def.color}`, outlineOffset: '2px', boxShadow: `0 0 10px ${def.color}40` } : {}}
    >
      <span
        className="w-4 h-4 rounded-full flex-shrink-0"
        style={{ background: def.color, boxShadow: active ? `0 0 8px ${def.color}` : undefined }}
      />
      <span className="text-white/50 text-[9px] tracking-wide whitespace-nowrap">{def.name}</span>
    </button>
  );
}

// ─── Main client ───────────────────────────────────────────────────────────────
export function BlackHoleClient() {
  const [gravity,          setGravity]         = useState(1.0);
  const [spaghettify,      setSpaghettify]      = useState(false);
  const [crossedHorizon,   setCrossedHorizon]   = useState(false);
  const [showHorizonMsg,   setShowHorizonMsg]   = useState(false);
  const [factIndex,        setFactIndex]        = useState(0);
  const [spawnedPlanet,    setSpawnedPlanet]    = useState<{ key: PlanetKey; def: BHPlanetDef } | null>(null);
  const [isDestroying,     setIsDestroying]     = useState(false);
  const [destructionStage, setDestructionStage] = useState('');
  const [destructionMsg,   setDestructionMsg]   = useState('');
  const [showExplosion,    setShowExplosion]     = useState(false);
  const [cameraShake,      setCameraShake]      = useState(false);
  const [cameraPreset,     setCameraPreset]     = useState<CameraPreset | null>(null);
  const [starFlash,        setStarFlash]        = useState(false);
  const [log,              setLog]              = useState<LogEntry[]>([]);
  const [totalSolarMasses, setTotalSolarMasses] = useState(0);
  const [bhGrowthFactor,   setBhGrowthFactor]   = useState(1.0);
  const [soundEnabled,     setSoundEnabled]     = useState(true);

  // Pending planet ref so callbacks can access current spawned planet
  const pendingPlanet  = useRef<{ key: PlanetKey; def: BHPlanetDef } | null>(null);
  const tidalPlayed    = useRef(false);
  const prevGravity    = useRef(1.0);
  const gravityDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Audio init — requires a user gesture before AudioContext can start
  useEffect(() => {
    blackHoleAudio.init();
    const handleFirstClick = () => {
      blackHoleAudio.resume();
      blackHoleAudio.startAmbient(gravity);
      window.removeEventListener('click', handleFirstClick);
    };
    window.addEventListener('click', handleFirstClick);
    return () => {
      window.removeEventListener('click', handleFirstClick);
      blackHoleAudio.destroy();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-cycle facts
  useEffect(() => {
    const id = setInterval(() => setFactIndex((i) => (i + 1) % FUN_FACTS.length), 5000);
    return () => clearInterval(id);
  }, []);

  // ── Gravity slider ────────────────────────────────────────────────────────────
  const handleGravityChange = useCallback((val: number) => {
    const increased = val > prevGravity.current;
    prevGravity.current = val;
    setGravity(val);
    blackHoleAudio.updateAmbient(val);
    if (increased) {
      if (gravityDebounce.current) clearTimeout(gravityDebounce.current);
      gravityDebounce.current = setTimeout(() => blackHoleAudio.playGravityIncrease(), 60);
    }
  }, []);

  // ── Spawn a planet ────────────────────────────────────────────────────────────
  const spawnPlanet = useCallback((key: PlanetKey) => {
    if (isDestroying) return;
    const def = BH_PLANETS[key];
    pendingPlanet.current = { key, def };
    tidalPlayed.current = false;
    setSpawnedPlanet({ key, def });
    setIsDestroying(true);
    setDestructionStage('approach');
    setDestructionMsg('');
    blackHoleAudio.playLaunch();
  }, [isDestroying]);

  // ── Stage change callback (from scene) ────────────────────────────────────────
  const handleStageChange = useCallback((stage: string) => {
    setDestructionStage(stage);
    if (stage === 'tidal' && !tidalPlayed.current) {
      tidalPlayed.current = true;
      blackHoleAudio.playTidalForces();
    }
  }, []);

  // ── Planet destroyed callback (from scene) ────────────────────────────────────
  const handlePlanetDestroyed = useCallback(() => {
    const planet = pendingPlanet.current;
    if (!planet) return;

    setSpawnedPlanet(null);
    setShowExplosion(true);
    setDestructionStage('');
    blackHoleAudio.playAbsorption();
    if (planet.def.specialEffect === 'star-flash') {
      setStarFlash(true);
      setTimeout(() => setStarFlash(false), 900);
    }

    // Camera shake
    setCameraShake(true);
    setTimeout(() => setCameraShake(false), 550);

    // Dramatic text sequence
    setDestructionMsg(`💥 ${planet.def.name} has been consumed`);
    setTimeout(() => setDestructionMsg('Mass added to Sagittarius A*'), 900);
    setTimeout(() => {
      const isStarFlash = planet.def.specialEffect === 'star-flash';
      setDestructionMsg(isStarFlash ? '🌟 Stellar mass acquired — black hole mass doubled' : 'The black hole grows stronger');

      // Add to log
      const now = new Date();
      const ts = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
      setLog((prev) => [...prev, {
        id: Date.now(),
        ts,
        symbol: planet.def.symbol,
        name:   planet.def.name,
        massLabel: planet.def.massLabel,
      }]);
      setTotalSolarMasses((prev) => {
        const next = prev + planet.def.solarMassFraction;
        setBhGrowthFactor(Math.min(1 + next / 5, 2.0));
        return next;
      });
    }, 1800);

    setTimeout(() => {
      setDestructionMsg('');
      setIsDestroying(false);
      pendingPlanet.current = null;
    }, 3200);
  }, []);

  // ── "Get Close" spaghettification ─────────────────────────────────────────────
  const handleEventHorizon = useCallback(() => {
    setCrossedHorizon(true);
    setShowHorizonMsg(true);
  }, []);

  const handleGetClose = useCallback(() => {
    setSpaghettify(true);
    blackHoleAudio.playEventHorizon();
  }, []);

  const handleReset = useCallback(() => {
    setSpaghettify(false);
    setCrossedHorizon(false);
    setShowHorizonMsg(false);
    setGravity(1.0);
  }, []);

  // ── Reset black hole mass ─────────────────────────────────────────────────────
  const handleBHReset = useCallback(() => {
    setLog([]);
    setTotalSolarMasses(0);
    setBhGrowthFactor(1.0);
  }, []);

  // ── Camera preset (re-trigger on same preset by using an object) ───────────────
  const handleCameraPreset = useCallback((preset: CameraPreset) => {
    setCameraPreset(null);
    requestAnimationFrame(() => setCameraPreset(preset));
  }, []);

  const activeStageMsg = STAGE_MESSAGES[destructionStage];

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#000000' }}>

      {/* 3D canvas */}
      <div className="absolute inset-0 z-0">
        <BlackHoleScene
          gravityStrength={gravity}
          spaghettify={spaghettify}
          onEventHorizon={handleEventHorizon}
          spawnedPlanet={spawnedPlanet}
          onPlanetStageChange={handleStageChange}
          onPlanetDestroyed={handlePlanetDestroyed}
          showExplosion={showExplosion}
          onExplosionDone={() => setShowExplosion(false)}
          cameraPreset={cameraPreset}
          cameraShake={cameraShake}
          growthFactor={bhGrowthFactor}
        />
      </div>

      {/* Red vignette during spaghettification */}
      <AnimatePresence>
        {spaghettify && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: crossedHorizon ? 1 : 0.55 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ background: 'radial-gradient(ellipse at center, transparent 30%, #cc000080 100%)' }}
          />
        )}
      </AnimatePresence>

      {/* Tidal/spaghettification destruction vignette */}
      <AnimatePresence>
        {(destructionStage === 'tidal' || destructionStage === 'spaghet') && (
          <motion.div
            className="absolute inset-0 z-10 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: destructionStage === 'spaghet' ? 0.5 : 0.2 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            style={{ background: 'radial-gradient(ellipse at center, transparent 40%, #ff330050 100%)' }}
          />
        )}
      </AnimatePresence>

      {/* White flash at event horizon */}
      <AnimatePresence>
        {crossedHorizon && (
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.9, 0] }}
            transition={{ duration: 0.6, times: [0, 0.3, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Star flash */}
      <AnimatePresence>
        {starFlash && (
          <motion.div
            key="star-flash"
            className="absolute inset-0 z-20 pointer-events-none bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, times: [0, 0.2, 1] }}
          />
        )}
      </AnimatePresence>

      {/* Event horizon message */}
      <AnimatePresence>
        {showHorizonMsg && (
          <motion.div
            className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <div className="text-center px-6">
              <p className="text-red-400/80 text-xs tracking-[0.4em] uppercase mb-3">Warning</p>
              <p className="text-white text-xl sm:text-2xl font-light tracking-wide">You have crossed the event horizon</p>
              <p className="text-white/30 text-sm mt-2">No information can escape</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── UI overlay ── */}
      <div className="absolute inset-0 z-10 pointer-events-none">

        {/* Top-left — back + title + BH mass */}
        <div className="absolute top-0 left-0 p-6 pointer-events-auto">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs tracking-widest uppercase transition-colors mb-4">
            <BackIcon /> Back
          </Link>
          <h1 className="text-white text-2xl sm:text-3xl font-bold tracking-tight">Black Hole</h1>
          <p className="text-white/35 text-sm mt-1">Sagittarius A* — 4 million solar masses</p>
          {bhGrowthFactor > 1.001 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-orange-400/60 text-xs mt-1 font-mono"
            >
              Current mass: {(4 + totalSolarMasses).toFixed(totalSolarMasses < 0.01 ? 4 : 2)}M M☉
            </motion.p>
          )}
        </div>

        {/* Top-right — fun facts + camera presets */}
        <div className="absolute top-0 right-0 p-6 flex flex-col items-end gap-4 pointer-events-auto">
          {/* Camera presets */}
          <div className="flex gap-1.5">
            {CAMERA_PRESETS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => handleCameraPreset(key)}
                className="px-3 py-1 rounded-full text-[10px] tracking-wider uppercase text-white/30 border border-white/10 hover:text-white/60 hover:border-white/20 transition-all"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Fun facts */}
          <div className="max-w-xs">
            <p className="text-white/25 text-[10px] tracking-[0.25em] uppercase mb-2 text-right">Fun Facts</p>
            <div className="relative h-16 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={factIndex}
                  className="absolute text-white/45 text-xs leading-relaxed text-right"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                >
                  {FUN_FACTS[factIndex]}
                </motion.p>
              </AnimatePresence>
            </div>
            <div className="flex gap-1.5 justify-end mt-2">
              {FUN_FACTS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFactIndex(i)}
                  className="w-1 h-1 rounded-full transition-all duration-300"
                  style={{ background: i === factIndex ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)' }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Middle — stage message */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center px-4">
          <AnimatePresence mode="wait">
            {activeStageMsg && (
              <motion.p
                key={destructionStage}
                className={`text-sm font-medium tracking-wide ${activeStageMsg.cls}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3 }}
              >
                {activeStageMsg.text}
              </motion.p>
            )}
            {destructionMsg && !activeStageMsg && (
              <motion.div
                key={destructionMsg}
                className="text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.35 }}
              >
                <p className="text-white text-lg font-semibold">{destructionMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom-left — info panel */}
        <div className="absolute bottom-0 left-0 p-6 pointer-events-auto">
          <InfoPanel gravityStrength={gravity} />
        </div>

        {/* Bottom-center — planet selector + gravity slider */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-4 pointer-events-auto flex flex-col items-center gap-3 max-w-xl w-full">

          {/* Planet selector */}
          <div
            className="w-full rounded-2xl px-4 py-3"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-white/25 text-[9px] tracking-[0.25em] uppercase mb-2 text-center">
              {isDestroying ? 'Destruction in progress…' : 'Choose an object to destroy'}
            </p>
            <div className="flex items-center justify-center flex-wrap gap-0.5">
              {PLANET_ORDER.map((key) => {
                const def = BH_PLANETS[key];
                return (
                  <PlanetButton
                    key={key}
                    def={def}
                    active={spawnedPlanet?.key === key}
                    disabled={isDestroying}
                    onClick={() => spawnPlanet(key)}
                  />
                );
              })}
            </div>
          </div>

          {/* Gravity slider */}
          <div className="flex flex-col items-center gap-1.5 w-64">
            <div className="flex items-center justify-between w-full">
              <span className="text-white/25 text-[10px] tracking-wider uppercase">Gravity</span>
              <span className="text-white/45 text-xs font-mono">{gravity.toFixed(1)}x</span>
            </div>
            <input
              type="range" min="0.1" max="3.0" step="0.1" value={gravity}
              onChange={(e) => handleGravityChange(parseFloat(e.target.value))}
              className="w-full cursor-pointer"
              style={{ accentColor: '#ff6000' }}
            />
            <span className="text-white/25 text-[10px] tracking-wider">{gravityLabel(gravity)}</span>
          </div>
        </div>

        {/* Sound toggle — bottom-right corner */}
        <div className="absolute pointer-events-auto" style={{ bottom: 24, right: 24 }}>
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              blackHoleAudio.setEnabled(next);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white/40 hover:text-white/70 transition-colors"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.08)' }}
            aria-label={soundEnabled ? 'Mute' : 'Unmute'}
          >
            <span>{soundEnabled ? '🔊' : '🔇'}</span>
            <span className="tracking-wider uppercase text-[9px]">{soundEnabled ? 'Sound' : 'Muted'}</span>
          </button>
        </div>

        {/* Bottom-right — action buttons + destruction log (sits above sound toggle) */}
        <div className="absolute right-0 p-6 pointer-events-auto flex flex-col items-end gap-4" style={{ bottom: 70 }}>

          {/* Destruction log */}
          <DestructionLog entries={log} totalSolarMasses={totalSolarMasses} onReset={handleBHReset} />

          {/* Spaghettify / Reset */}
          {!spaghettify ? (
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={handleGetClose}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #cc0000 0%, #ff4400 100%)', boxShadow: '0 0 24px #cc000060' }}
            >
              Get Close
            </motion.button>
          ) : (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}
              onClick={handleReset}
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white/60 border border-white/15 hover:text-white hover:border-white/30 transition-colors"
            >
              Reset View
            </motion.button>
          )}
        </div>
      </div>
    </div>
  );
}
