'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { GALAXY_STARS, type GalaxyStar } from '@/lib/galaxy-stars';

export interface CameraAnim {
  position: [number, number, number];
  lookAt:   [number, number, number];
}

// ─── Galaxy spiral particles ───────────────────────────────────────────────────
function createGalaxy(count: number) {
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const armIndex  = i % 4;
    const t         = (i / count) * Math.PI * 6;
    const radius    = Math.random() * 25 + 1;
    const armAngle  = (armIndex / 4) * Math.PI * 2;
    const spinAngle = t * 0.4;

    const randomX = (Math.random() - 0.5) * 2 * Math.exp(-radius * 0.05);
    const randomY = (Math.random() - 0.5) * 0.8;
    const randomZ = (Math.random() - 0.5) * 2 * Math.exp(-radius * 0.05);

    positions[i*3]   = Math.cos(armAngle + spinAngle) * radius + randomX;
    positions[i*3+1] = randomY;
    positions[i*3+2] = Math.sin(armAngle + spinAngle) * radius + randomZ;

    const d = radius / 25;
    colors[i*3]   = 0.8 + d * 0.2;
    colors[i*3+1] = 0.7 + d * 0.1;
    colors[i*3+2] = Math.min(0.9 + (1 - d), 1);
  }
  return { positions, colors };
}

function GalaxyPoints() {
  const ref   = useRef<THREE.Points>(null);
  const count = useMemo(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 30000 : 80000), []);
  const { positions, colors } = useMemo(() => createGalaxy(count), [count]);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.0003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} sizeAttenuation vertexColors transparent opacity={0.85} />
    </points>
  );
}

// ─── Galactic center glow ─────────────────────────────────────────────────────
function GalacticCenter() {
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (coreRef.current?.material instanceof THREE.MeshStandardMaterial) {
      coreRef.current.material.emissiveIntensity = 3 + Math.sin(clock.getElapsedTime() * 1.5) * 0.6;
    }
  });

  return (
    <group position={[0, 0, -25]}>
      {/* Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={3} />
      </mesh>
      {/* Halos */}
      {[{ r: 1.2, op: 0.18 }, { r: 1.8, op: 0.10 }, { r: 2.5, op: 0.05 }].map(({ r, op }, i) => (
        <mesh key={i}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshBasicMaterial color="#ffaa44" wireframe transparent opacity={op} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Sun glow + YOU ARE HERE label ────────────────────────────────────────────
function SunEffect() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 1.8) * 0.06);
  });
  return (
    <group position={[0, 0, 0]}>
      <pointLight color="#ffee88" intensity={1.5} distance={15} />
      <mesh ref={ref}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#ffee88" emissive="#ffcc44" emissiveIntensity={3} />
      </mesh>
      <Html center position={[0, 0.55, 0]} zIndexRange={[10, 0]}>
        <div style={{
          color: 'rgba(255,238,100,0.65)',
          fontSize: '8px',
          letterSpacing: '0.16em',
          whiteSpace: 'nowrap',
          userSelect: 'none',
          pointerEvents: 'none',
          textShadow: '0 0 8px rgba(255,238,100,0.4)',
        }}>
          ▲ YOU ARE HERE
        </div>
      </Html>
    </group>
  );
}

// ─── Individual notable star ──────────────────────────────────────────────────
function NotableStar({
  star, selected, highlighted, index, onStarClick,
}: {
  star: GalaxyStar;
  selected: boolean;
  highlighted: boolean;
  index: number;
  onStarClick: (s: GalaxyStar) => void;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const phase = index * 0.31;
  const isSagA  = star.name === 'Sagittarius A*';
  const isSun   = star.name === 'Sun';

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    const speed = highlighted ? 4.5 : selected ? 3 : 1.4;
    const pulse = 1 + Math.sin(t * speed + phase) * (selected || highlighted ? 0.25 : 0.12);
    meshRef.current.scale.setScalar(pulse);
  });

  // Sun and Sag A* are handled by dedicated components — render a transparent clickable sphere
  if (isSun) return null;

  const r = isSagA ? 1.4 : Math.max(0.12, star.size * 0.22);

  return (
    <mesh
      ref={meshRef}
      position={star.position}
      onClick={(e) => { e.stopPropagation(); onStarClick(star); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[r, 12, 12]} />
      <meshStandardMaterial
        color={isSagA ? '#000000' : star.color}
        emissive={star.color}
        emissiveIntensity={isSagA ? 0 : (selected || highlighted ? 2.5 : 0.8)}
        transparent={isSagA}
        opacity={isSagA ? 0.01 : 1}
      />
      {(hovered || selected) && (
        <Html center position={[0, r + 0.4, 0]} zIndexRange={[20, 0]}>
          <div style={{
            color: star.color,
            fontSize: '9px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            background: 'rgba(0,0,0,0.65)',
            padding: '2px 6px',
            borderRadius: '4px',
            userSelect: 'none',
            pointerEvents: 'none',
            border: `1px solid ${star.color}40`,
          }}>
            {star.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ─── Distance line from Sun to selected star ──────────────────────────────────
function DistanceLine({ target }: { target: [number, number, number] }) {
  const progress = useRef(0);

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }), []);
  const obj = useMemo(() => new THREE.Line(geo, mat), [geo, mat]);

  useEffect(() => {
    progress.current = 0;
    return () => { geo.dispose(); mat.dispose(); };
  }, [target, geo, mat]);

  useFrame((_, delta) => {
    progress.current = Math.min(progress.current + delta * 2, 1);
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;
    arr[3] = target[0] * progress.current;
    arr[4] = target[1] * progress.current;
    arr[5] = target[2] * progress.current;
    attr.needsUpdate = true;
  });

  return <primitive object={obj} />;
}

// ─── Camera rig with OrbitControls + preset animation ─────────────────────────
function CameraRig({ cameraAnim }: { cameraAnim: CameraAnim | null }) {
  const { camera } = useThree();
  const controlsRef  = useRef<OrbitControlsImpl>(null);
  const targetPos    = useRef(new THREE.Vector3(0, 15, 30));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const animating    = useRef(false);

  useEffect(() => {
    if (!cameraAnim) return;
    targetPos.current.set(...cameraAnim.position);
    targetLookAt.current.set(...cameraAnim.lookAt);
    animating.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [cameraAnim]);

  useFrame(() => {
    if (!animating.current) return;
    camera.position.lerp(targetPos.current, 0.04);
    camera.lookAt(targetLookAt.current);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.06);
      controlsRef.current.update();
    }
    if (camera.position.distanceTo(targetPos.current) < 0.4) {
      animating.current = false;
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableZoom
      enablePan
      enableRotate
      enableDamping
      dampingFactor={0.05}
      minDistance={5}
      maxDistance={80}
    />
  );
}

// ─── Inner scene ──────────────────────────────────────────────────────────────
interface SceneProps {
  selectedStar:  GalaxyStar | null;
  onStarClick:   (s: GalaxyStar) => void;
  cameraAnim:    CameraAnim | null;
  searchQuery:   string;
}

function SceneContents({ selectedStar, onStarClick, cameraAnim, searchQuery }: SceneProps) {
  const lowerQ = searchQuery.toLowerCase();

  return (
    <>
      <ambientLight intensity={0.03} />

      <GalaxyPoints />
      <GalacticCenter />
      <SunEffect />

      {GALAXY_STARS.map((star, i) => (
        <NotableStar
          key={star.id}
          star={star}
          index={i}
          selected={selectedStar?.id === star.id}
          highlighted={lowerQ.length >= 2 && star.name.toLowerCase().includes(lowerQ)}
          onStarClick={onStarClick}
        />
      ))}

      {selectedStar && selectedStar.name !== 'Sun' && (
        <DistanceLine key={selectedStar.id} target={selectedStar.position} />
      )}

      <CameraRig cameraAnim={cameraAnim} />
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export interface GalaxySceneProps {
  selectedStar:  GalaxyStar | null;
  onStarClick:   (s: GalaxyStar) => void;
  cameraAnim:    CameraAnim | null;
  searchQuery:   string;
}

export function GalaxyScene(props: GalaxySceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 15, 30], fov: 60 }}
      style={{ background: '#000005' }}
      gl={{ antialias: true }}
    >
      <SceneContents {...props} />
    </Canvas>
  );
}
