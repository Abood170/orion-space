'use client';

import dynamic from 'next/dynamic';
import { useRef, useState, useCallback, useEffect } from 'react';
import { SandboxControls } from '@/components/sandbox/sandbox-controls';
import {
  generateSolarSystem, PRESETS, type Body,
} from '@/lib/sandbox-physics';
import type { SandboxSceneHandle, BodyStats } from '@/components/sandbox/sandbox-scene';

const SandboxScene = dynamic(
  () => import('@/components/sandbox/sandbox-scene').then((m) => m.SandboxScene),
  { ssr: false },
);

const DEFAULT_STATS: BodyStats = { count: 5, collisionCount: 0, largestName: 'Sun', simTime: 0 };

export function SandboxClient() {
  const sceneRef = useRef<SandboxSceneHandle>(null);

  const [isPaused,            setIsPaused]            = useState(false);
  const [speedMultiplier,     setSpeedMultiplier]     = useState(1.0);
  const [G,                   setG]                   = useState(1.0);
  const [showTrails,          setShowTrails]          = useState(true);
  const [showVectors,         setShowVectors]         = useState(false);
  const [showGrid,            setShowGrid]            = useState(false);
  const [selectedSpawnTypeId, setSelectedSpawnTypeId] = useState('planet');
  const [selectedBody,        setSelectedBody]        = useState<Body | null>(null);
  const [stats,               setStats]               = useState<BodyStats>(DEFAULT_STATS);
  const [bodyCount,           setBodyCount]           = useState(5);
  const [initialBodies]                               = useState<Body[]>(() => generateSolarSystem());

  // Keep bodyCount in sync with stats
  useEffect(() => { setBodyCount(stats.count); }, [stats.count]);

  const handleStatsUpdate = useCallback((s: BodyStats) => {
    setStats(s);
  }, []);

  const handleBodySelect = useCallback((body: Body | null) => {
    setSelectedBody(body);
  }, []);

  const handlePresetLoad = useCallback((id: string) => {
    const preset = PRESETS.find((p) => p.id === id);
    if (!preset) return;
    sceneRef.current?.resetBodies(preset.generate());
    setSelectedBody(null);
  }, []);

  const handleDeleteSelected = useCallback(() => {
    sceneRef.current?.deleteSelected();
    setSelectedBody(null);
  }, []);

  const handleToggleStatic = useCallback(() => {
    sceneRef.current?.toggleSelectedStatic();
  }, []);

  const handleRenameSelected = useCallback((name: string) => {
    sceneRef.current?.renameSelected(name);
    setSelectedBody((prev) => prev ? { ...prev, name } : null);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ backgroundColor: '#000008' }}>
      {/* 3D canvas */}
      <div className="absolute inset-0">
        <SandboxScene
          ref={sceneRef}
          initialBodies={initialBodies}
          isPaused={isPaused}
          speedMultiplier={speedMultiplier}
          G={G}
          showTrails={showTrails}
          showVectors={showVectors}
          showGrid={showGrid}
          selectedSpawnTypeId={selectedSpawnTypeId}
          onStatsUpdate={handleStatsUpdate}
          onBodySelect={handleBodySelect}
        />
      </div>

      {/* UI overlay */}
      <SandboxControls
        isPaused={isPaused}
        speedMultiplier={speedMultiplier}
        G={G}
        showTrails={showTrails}
        showVectors={showVectors}
        showGrid={showGrid}
        selectedSpawnTypeId={selectedSpawnTypeId}
        selectedBody={selectedBody}
        stats={stats}
        bodyCount={bodyCount}
        onPauseToggle={() => setIsPaused((v) => !v)}
        onSpeedChange={setSpeedMultiplier}
        onGChange={setG}
        onTrailsToggle={() => setShowTrails((v) => !v)}
        onVectorsToggle={() => setShowVectors((v) => !v)}
        onGridToggle={() => setShowGrid((v) => !v)}
        onSpawnTypeSelect={setSelectedSpawnTypeId}
        onPresetLoad={handlePresetLoad}
        onDeleteSelected={handleDeleteSelected}
        onToggleStatic={handleToggleStatic}
        onRenameSelected={handleRenameSelected}
      />
    </div>
  );
}
