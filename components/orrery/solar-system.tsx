'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// ── Planet data ──────────────────────────────────────────────────────────────

interface PlanetDef {
  name: string;
  slug: string;
  radius: number;
  color: string;
  orbitRadius: number;
  speed: number;
  hasRings?: boolean;
  initialAngle: number;
}

const PLANETS: PlanetDef[] = [
  { name: 'Mercury', slug: 'mercury', radius: 0.3,  color: '#b5b5b5', orbitRadius: 5,  speed: 1.607, initialAngle: 0.4 },
  { name: 'Venus',   slug: 'venus',   radius: 0.5,  color: '#e8cda0', orbitRadius: 7,  speed: 1.174, initialAngle: 1.3 },
  { name: 'Earth',   slug: 'earth',   radius: 0.5,  color: '#3b82f6', orbitRadius: 9,  speed: 1.000, initialAngle: 2.5 },
  { name: 'Mars',    slug: 'mars',    radius: 0.4,  color: '#c1440e', orbitRadius: 11, speed: 0.802, initialAngle: 4.0 },
  { name: 'Jupiter', slug: 'jupiter', radius: 1.4,  color: '#c88b3a', orbitRadius: 16, speed: 0.434, initialAngle: 0.9 },
  { name: 'Saturn',  slug: 'saturn',  radius: 1.1,  color: '#e4d191', orbitRadius: 20, speed: 0.323, hasRings: true, initialAngle: 3.2 },
  { name: 'Uranus',  slug: 'uranus',  radius: 0.8,  color: '#7de8e8', orbitRadius: 25, speed: 0.228, initialAngle: 5.1 },
  { name: 'Neptune', slug: 'neptune', radius: 0.7,  color: '#5b5ddf', orbitRadius: 30, speed: 0.182, initialAngle: 1.7 },
];

// ── Moon data ────────────────────────────────────────────────────────────────

const MOONS: Record<string, { orbitRadius: number; speed: number }[]> = {
  earth:   [{ orbitRadius: 1.1, speed: 3.5 }],
  jupiter: [
    { orbitRadius: 2.0, speed: 5.2 },
    { orbitRadius: 2.8, speed: 4.4 },
    { orbitRadius: 3.8, speed: 3.6 },
    { orbitRadius: 5.0, speed: 2.7 },
  ],
  saturn:  [{ orbitRadius: 2.5, speed: 3.2 }],
};

// ── Sun ──────────────────────────────────────────────────────────────────────

function Sun() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const s = 1 + Math.sin(clock.getElapsedTime() * 1.4) * 0.025;
    meshRef.current.scale.setScalar(s);
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial
        color="#FDB813"
        emissive="#FDB813"
        emissiveIntensity={2}
        roughness={0.4}
      />
    </mesh>
  );
}

// ── Orbit ring ───────────────────────────────────────────────────────────────

function OrbitPath({ orbitRadius }: { orbitRadius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <torusGeometry args={[orbitRadius, 0.03, 2, 64]} />
      <meshBasicMaterial color="white" transparent opacity={0.12} />
    </mesh>
  );
}

// ── Asteroid belt (400 instances) ────────────────────────────────────────────

function AsteroidBelt() {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef  = useRef<THREE.InstancedMesh>(null!);
  const COUNT = 150;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 12.5 + Math.random() * 2.0;
      dummy.position.set(
        Math.cos(angle) * r,
        (Math.random() - 0.5) * 0.55,
        Math.sin(angle) * r,
      );
      dummy.scale.setScalar(0.04 + Math.random() * 0.07);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [dummy]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.015;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
        <sphereGeometry args={[1, 4, 4]} />
        <meshStandardMaterial color="#7a7a7a" roughness={0.9} />
      </instancedMesh>
    </group>
  );
}

// ── Planet moon ──────────────────────────────────────────────────────────────

function PlanetMoon({ orbitRadius, speed }: { orbitRadius: number; speed: number }) {
  const meshRef  = useRef<THREE.Mesh>(null!);
  const angleRef = useRef(Math.random() * Math.PI * 2);

  useFrame((_, delta) => {
    angleRef.current += speed * delta * 0.08;
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angleRef.current) * orbitRadius;
      meshRef.current.position.z = Math.sin(angleRef.current) * orbitRadius;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.07, 6, 6]} />
      <meshStandardMaterial color="#aaaaaa" roughness={0.9} />
    </mesh>
  );
}

// ── Planet ───────────────────────────────────────────────────────────────────

interface PlanetMeshProps extends PlanetDef {
  speedMultiplier: number;
  isPaused: boolean;
}

function PlanetMesh({
  name, slug, radius, color, orbitRadius, speed, hasRings,
  initialAngle, speedMultiplier, isPaused,
}: PlanetMeshProps) {
  const groupRef  = useRef<THREE.Group>(null!);
  const angleRef  = useRef(initialAngle);
  const speedRef  = useRef(speedMultiplier);
  const pausedRef = useRef(isPaused);
  const [hovered, setHovered] = useState(false);

  // Trail state
  const trailAttr = useMemo(() => {
    const attr = new THREE.BufferAttribute(new Float32Array(8 * 3), 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    return attr;
  }, []);
  const trailGeoRef = useRef<THREE.BufferGeometry>(null!);
  const trailPts = useMemo(() => trailAttr.array as Float32Array, [trailAttr]);

  useEffect(() => {
    if (trailGeoRef.current) {
      trailGeoRef.current.setAttribute('position', trailAttr);
    }
  }, [trailAttr]);

  // Keep refs in sync with props
  speedRef.current  = speedMultiplier;
  pausedRef.current = isPaused;

  useFrame((_, delta) => {
    if (!pausedRef.current) {
      angleRef.current += speed * speedRef.current * delta * 0.08;
    }
    const x = Math.cos(angleRef.current) * orbitRadius;
    const z = Math.sin(angleRef.current) * orbitRadius;

    if (groupRef.current) {
      groupRef.current.position.x = x;
      groupRef.current.position.z = z;
    }

    // Shift trail buffer right by one position, insert current at front
    trailPts.copyWithin(3, 0, 21);
    trailPts[0] = x;
    trailPts[1] = 0;
    trailPts[2] = z;
    trailAttr.needsUpdate = true;
  });

  const moons = MOONS[slug] ?? [];

  return (
    <>
      {/* Trail points (world space) */}
      <points>
        <bufferGeometry ref={trailGeoRef} />
        <pointsMaterial
          color={color}
          size={0.1}
          transparent
          opacity={0.28}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* Planet group (moves with orbit) */}
      <group ref={groupRef}>
        <mesh
          onPointerOver={(e) => {
            e.stopPropagation();
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
          onClick={() => { window.location.href = `/planets/${slug}`; }}
        >
          <sphereGeometry args={[radius, 16, 16]} />
          <meshStandardMaterial color={color} roughness={0.75} metalness={0.05} />
        </mesh>

        {/* Saturn rings */}
        {hasRings && (
          <mesh rotation={[-Math.PI / 3, 0, 0]}>
            <ringGeometry args={[radius * 1.4, radius * 2.2, 64]} />
            <meshBasicMaterial color="#c2a14b" transparent opacity={0.7} side={THREE.DoubleSide} />
          </mesh>
        )}

        {/* Moons */}
        {moons.map((moon, i) => (
          <PlanetMoon key={i} orbitRadius={moon.orbitRadius} speed={moon.speed} />
        ))}

        {/* Hover label */}
        {hovered && (
          <Html center position={[0, radius + 0.8, 0]} distanceFactor={10}>
            <div
              style={{
                background: 'rgba(0,0,0,0.82)',
                color: '#fff',
                padding: '3px 10px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
                backdropFilter: 'blur(6px)',
                letterSpacing: '0.04em',
              }}
            >
              {name}
            </div>
          </Html>
        )}
      </group>
    </>
  );
}

// ── Camera reset helper ──────────────────────────────────────────────────────

function CameraReset({ trigger }: { trigger: number }) {
  const { camera } = useThree();
  useEffect(() => {
    if (!trigger) return;
    camera.position.set(0, 35, 70);
    camera.lookAt(0, 0, 0);
  }, [trigger, camera]);
  return null;
}

// ── Scene root ───────────────────────────────────────────────────────────────

interface SceneProps {
  speedMultiplier: number;
  isPaused: boolean;
  resetTrigger: number;
}

function Scene({ speedMultiplier, isPaused, resetTrigger }: SceneProps) {
  return (
    <>
      <color attach="background" args={['#0a0a0f']} />
      <ambientLight intensity={0.3} />
      <pointLight position={[0, 0, 0]} intensity={2} color="#fff8e8" decay={0.4} />

      <OrbitControls enableZoom={true} autoRotate={false} dampingFactor={0.08} enableDamping />
      <CameraReset trigger={resetTrigger} />

      <Sun />
      <AsteroidBelt />

      {PLANETS.map((planet) => (
        <group key={planet.slug}>
          <OrbitPath orbitRadius={planet.orbitRadius} />
          <PlanetMesh {...planet} speedMultiplier={speedMultiplier} isPaused={isPaused} />
        </group>
      ))}
    </>
  );
}

// ── Public component ─────────────────────────────────────────────────────────

export interface SolarSystemProps {
  speedMultiplier: number;
  isPaused: boolean;
  resetTrigger?: number;
}

export function SolarSystem({ speedMultiplier, isPaused, resetTrigger = 0 }: SolarSystemProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        filter: 'drop-shadow(0 0 16px rgba(253,184,19,0.22))',
      }}
    >
      <Canvas
        camera={{ position: [0, 35, 70], fov: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene speedMultiplier={speedMultiplier} isPaused={isPaused} resetTrigger={resetTrigger} />
      </Canvas>
    </div>
  );
}
