'use client';

import {
  forwardRef, useImperativeHandle, useRef, useState, useEffect, useLayoutEffect, useMemo,
} from 'react';
import type { ThreeEvent } from '@react-three/fiber';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import {
  Body, updatePhysics, checkCollisions, createBody,
} from '@/lib/sandbox-physics';

// ─── Public handle ────────────────────────────────────────────────────────────
export interface SandboxSceneHandle {
  resetBodies: (bodies: Body[]) => void;
  deleteSelected: () => void;
  toggleSelectedStatic: () => void;
  renameSelected: (name: string) => void;
}

export interface BodyStats {
  count: number;
  collisionCount: number;
  largestName: string;
  simTime: number;
}

interface SceneProps {
  isPaused: boolean;
  speedMultiplier: number;
  G: number;
  showTrails: boolean;
  showVectors: boolean;
  showGrid: boolean;
  selectedSpawnTypeId: string;
  onStatsUpdate: (s: BodyStats) => void;
  onBodySelect: (body: Body | null) => void;
}

// ─── Trail line ───────────────────────────────────────────────────────────────
function TrailLine({ positions, color }: { positions: [number, number, number][]; color: string }) {
  const geoRef = useRef<THREE.BufferGeometry>(null!);

  useLayoutEffect(() => {
    if (!geoRef.current || positions.length < 2) return;
    geoRef.current.setFromPoints(positions.map(([x, y, z]) => new THREE.Vector3(x, y, z)));
  }, [positions]);

  if (positions.length < 2) return null;
  return (
    <line>
      <bufferGeometry ref={geoRef} />
      <lineBasicMaterial color={color} transparent opacity={0.35} />
    </line>
  );
}

// ─── Velocity vector ──────────────────────────────────────────────────────────
function VelocityVector({ position, velocity }: { position: [number, number, number]; velocity: [number, number, number] }) {
  const speed = Math.sqrt(velocity[0] ** 2 + velocity[1] ** 2 + velocity[2] ** 2);
  const length = Math.min(speed * 2, 6);
  const inv = speed > 0.01 ? 1 / speed : 0;
  const end: [number, number, number] = [
    position[0] + velocity[0] * inv * length,
    position[1] + velocity[1] * inv * length,
    position[2] + velocity[2] * inv * length,
  ];
  const pts = useMemo(
    () => [new THREE.Vector3(...position), new THREE.Vector3(...end)],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [position[0], position[1], position[2], velocity[0], velocity[1], velocity[2]],
  );
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(pts), [pts]);
  if (speed < 0.01) return null;
  return (
    <primitive object={new THREE.Line(geo, new THREE.LineBasicMaterial({ color: '#00ff88', transparent: true, opacity: 0.7 }))} />
  );
}

// ─── Single body mesh ─────────────────────────────────────────────────────────
function BodyMesh({
  body, selected, showVector, onClick,
}: {
  body: Body;
  selected: boolean;
  showVector: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const isStar = body.type === 'star' || body.type === 'blackhole';

  return (
    <group position={body.position}>
      {/* Main sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => { document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { document.body.style.cursor = 'auto'; }}
      >
        <sphereGeometry args={[body.radius, 20, 20]} />
        <meshStandardMaterial
          color={body.type === 'blackhole' ? '#000000' : body.color}
          emissive={body.type === 'blackhole' ? '#6600aa' : body.color}
          emissiveIntensity={body.type === 'blackhole' ? 0.6 : isStar ? 2.0 : 0.25}
        />
      </mesh>

      {/* Star point light */}
      {isStar && body.type !== 'blackhole' && (
        <pointLight color={body.color} intensity={Math.min(body.mass * 0.05, 3)} distance={20} />
      )}

      {/* Selection ring */}
      {selected && (
        <mesh>
          <sphereGeometry args={[body.radius * 1.25, 16, 16]} />
          <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.4} />
        </mesh>
      )}

      {/* Velocity vector (rendered in world space from group origin) */}
      {showVector && (
        <VelocityVector
          position={[0, 0, 0]}
          velocity={body.velocity}
        />
      )}
    </group>
  );
}

// ─── Drag preview line ────────────────────────────────────────────────────────
function DragPreview({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints([start, end]);
    return g;
  }, [start, end]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <primitive
      object={new THREE.Line(geo, new THREE.LineDashedMaterial({ color: '#ffffff', dashSize: 0.3, gapSize: 0.2, transparent: true, opacity: 0.5 }))}
    />
  );
}

// ─── Inner scene (has access to r3f context) ──────────────────────────────────
function SceneInner({
  physicsRef, bodiesRef, setBodies, selectedIdRef, selectedId, setSelectedId,
  isPaused, speedMultiplier, G, showTrails, showVectors, showGrid,
  selectedSpawnTypeId, onStatsUpdate, onBodySelect, statsRef,
}: SceneProps & {
  physicsRef: React.MutableRefObject<Body[]>;
  bodiesRef: React.MutableRefObject<Body[]>;
  setBodies: (b: Body[]) => void;
  selectedIdRef: React.MutableRefObject<string | null>;
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  statsRef: React.MutableRefObject<BodyStats>;
}) {
  useThree(); // initialises r3f context
  const controlsRef   = useRef<OrbitControlsImpl>(null);
  const frameCount    = useRef(0);
  const statsFrames   = useRef(0);
  const colTotal      = useRef(0);
  const simTime       = useRef(0);

  // Drag state
  const [dragStart,   setDragStart]   = useState<THREE.Vector3 | null>(null);
  const [dragCurrent, setDragCurrent] = useState<THREE.Vector3 | null>(null);
  const isDragging    = useRef(false);

  useFrame((_, delta) => {
    if (isPaused) return;
    frameCount.current++;

    const skipPhysics = physicsRef.current.length > 15 && frameCount.current % 2 !== 0;
    if (!skipPhysics) {
      const dt = delta * speedMultiplier;
      simTime.current += dt;
      let updated = updatePhysics(physicsRef.current, dt, G);
      const { survived, collisions } = checkCollisions(updated);
      colTotal.current += collisions.length;
      // remove bodies too far from origin
      updated = survived.filter((b) => {
        const [x, y, z] = b.position;
        return x * x + y * y + z * z < 10000;
      });
      physicsRef.current = updated;
      bodiesRef.current = updated;
    }

    // Sync render state every 2 frames
    if (frameCount.current % 2 === 0) {
      setBodies([...physicsRef.current]);
    }

    // Update stats every 60 frames
    statsFrames.current++;
    if (statsFrames.current >= 60) {
      statsFrames.current = 0;
      const bodies = physicsRef.current;
      const largest = bodies.reduce((a, b) => (b.mass > a.mass ? b : a), bodies[0] ?? { name: '—' });
      const stats: BodyStats = {
        count: bodies.length,
        collisionCount: colTotal.current,
        largestName: largest?.name ?? '—',
        simTime: simTime.current,
      };
      statsRef.current = stats;
      onStatsUpdate(stats);

      // Update selected body info
      const sel = bodies.find((b) => b.id === selectedIdRef.current);
      onBodySelect(sel ?? null);
    }
  });

  // Background plane for drag-to-spawn
  const handleBgDown = (e: ThreeEvent<PointerEvent>) => {
    if (isDragging.current) return;
    isDragging.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
    setDragStart(e.point.clone());
    setDragCurrent(e.point.clone());
  };

  const handleBgMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    setDragCurrent(e.point.clone());
  };

  const handleBgUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    if (controlsRef.current) controlsRef.current.enabled = true;

    if (dragStart && physicsRef.current.length < 20) {
      const end = e.point;
      const vel: [number, number, number] = [
        (end.x - dragStart.x) * 1.5,
        (end.y - dragStart.y) * 1.5,
        (end.z - dragStart.z) * 1.5,
      ];
      const newBody = createBody(selectedSpawnTypeId, [dragStart.x, dragStart.y, dragStart.z], vel);
      physicsRef.current = [...physicsRef.current, newBody];
    }
    setDragStart(null);
    setDragCurrent(null);
  };

  const bodies = bodiesRef.current;

  return (
    <>
      <ambientLight intensity={0.04} />
      <color attach="background" args={['#000008']} />

      {showGrid && <Grid args={[60, 60]} position={[0, -4, 0]} cellColor="#ffffff08" sectionColor="#ffffff12" />}

      {/* Background drag plane */}
      <mesh
        onPointerDown={handleBgDown}
        onPointerMove={handleBgMove}
        onPointerUp={handleBgUp}
        position={[0, 0, -0.5]}
      >
        <planeGeometry args={[400, 400]} />
        <meshBasicMaterial transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      {/* Trails */}
      {showTrails && bodies.map((body) => (
        <TrailLine key={`trail_${body.id}`} positions={body.trail} color={body.color} />
      ))}

      {/* Bodies */}
      {bodies.map((body) => (
        <BodyMesh
          key={body.id}
          body={body}
          selected={selectedId === body.id}
          showVector={showVectors}
          onClick={() => {
            const isSame = selectedIdRef.current === body.id;
            selectedIdRef.current = isSame ? null : body.id;
            setSelectedId(isSame ? null : body.id);
          }}
        />
      ))}

      {/* Drag preview */}
      {dragStart && dragCurrent && isDragging.current && (
        <DragPreview start={dragStart} end={dragCurrent} />
      )}

      <OrbitControls
        ref={controlsRef}
        makeDefault
        enableZoom
        enableRotate
        enablePan
        enableDamping
        dampingFactor={0.06}
        minDistance={5}
        maxDistance={120}
      />
    </>
  );
}

// ─── Exported component (forwardRef) ──────────────────────────────────────────
const SandboxScene = forwardRef<SandboxSceneHandle, SceneProps & { initialBodies: Body[] }>(
  ({ initialBodies, ...props }, ref) => {
    const physicsRef  = useRef<Body[]>(initialBodies);
    const bodiesRef   = useRef<Body[]>(initialBodies);
    const selectedIdRef = useRef<string | null>(null);
    const statsRef    = useRef<BodyStats>({ count: 0, collisionCount: 0, largestName: '—', simTime: 0 });
    const [bodies,     setBodies]     = useState<Body[]>(initialBodies);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    useImperativeHandle(ref, () => ({
      resetBodies(newBodies: Body[]) {
        physicsRef.current  = newBodies;
        bodiesRef.current   = newBodies;
        selectedIdRef.current = null;
        setSelectedId(null);
        setBodies([...newBodies]);
        props.onBodySelect(null);
      },
      deleteSelected() {
        const id = selectedIdRef.current;
        if (!id) return;
        physicsRef.current = physicsRef.current.filter((b) => b.id !== id);
        bodiesRef.current  = physicsRef.current;
        selectedIdRef.current = null;
        setSelectedId(null);
        setBodies([...physicsRef.current]);
        props.onBodySelect(null);
      },
      toggleSelectedStatic() {
        const id = selectedIdRef.current;
        if (!id) return;
        physicsRef.current = physicsRef.current.map((b) =>
          b.id === id ? { ...b, isStatic: !b.isStatic, velocity: [0, 0, 0] } : b,
        );
        bodiesRef.current = physicsRef.current;
        setBodies([...physicsRef.current]);
      },
      renameSelected(name: string) {
        const id = selectedIdRef.current;
        if (!id) return;
        physicsRef.current = physicsRef.current.map((b) => (b.id === id ? { ...b, name } : b));
        bodiesRef.current  = physicsRef.current;
        setBodies([...physicsRef.current]);
      },
    }));

    // Re-sync render state when bodies change
    useEffect(() => {
      bodiesRef.current = bodies;
    }, [bodies]);

    return (
      <Canvas
        camera={{ position: [0, 8, 38], fov: 60 }}
        gl={{ antialias: true }}
        style={{ position: 'absolute', inset: 0, background: '#000008' }}
      >
        <SceneInner
          {...props}
          physicsRef={physicsRef}
          bodiesRef={bodiesRef}
          setBodies={setBodies}
          selectedIdRef={selectedIdRef}
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          statsRef={statsRef}
        />
      </Canvas>
    );
  },
);

SandboxScene.displayName = 'SandboxScene';
export { SandboxScene };
