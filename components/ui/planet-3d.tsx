'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface Planet3DProps {
  color: string;
  secondaryColor?: string;
  size?: number;
  rotationSpeed?: number;
  hasRings?: boolean;
  isGasGiant?: boolean;
  interactive?: boolean;
  bloom?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

function makeBandTexture(primary: THREE.Color, secondary: THREE.Color): THREE.DataTexture {
  const h = 256;
  const data = new Uint8Array(h * 4);
  for (let i = 0; i < h; i++) {
    const t = i / h;
    const w = (Math.sin(t * Math.PI * 10) * 0.5 + 0.5) * 0.65
            + (Math.sin(t * Math.PI * 6.4 + 1.2) * 0.5 + 0.5) * 0.35;
    const mix = Math.max(0, Math.min(1, w));
    data[i * 4 + 0] = Math.round((primary.r * mix + secondary.r * (1 - mix)) * 255);
    data[i * 4 + 1] = Math.round((primary.g * mix + secondary.g * (1 - mix)) * 255);
    data[i * 4 + 2] = Math.round((primary.b * mix + secondary.b * (1 - mix)) * 255);
    data[i * 4 + 3] = 255;
  }
  const tex = new THREE.DataTexture(data, 1, h, THREE.RGBAFormat);
  tex.needsUpdate = true;
  return tex;
}

// ── Equatorial particle ring ─────────────────────────────────────────────────

function EquatorialParticles({ size, color }: { size: number; color: string }) {
  const geoRef = useRef<THREE.BufferGeometry>(null!);

  const positions = useMemo(() => {
    const pts = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      const angle = (i / 100) * Math.PI * 2;
      const r = size * (1.15 + Math.random() * 0.1);
      pts[i * 3]     = Math.cos(angle) * r;
      pts[i * 3 + 1] = (Math.random() - 0.5) * size * 0.15;
      pts[i * 3 + 2] = Math.sin(angle) * r;
    }
    return pts;
  }, [size]);

  useEffect(() => {
    if (geoRef.current) {
      geoRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    }
  }, [positions]);

  return (
    <points>
      <bufferGeometry ref={geoRef} />
      <pointsMaterial
        color={color}
        size={0.035}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ── Scene ────────────────────────────────────────────────────────────────────

interface SceneProps {
  color: string;
  secondaryColor: string;
  size: number;
  rotationSpeed: number;
  hasRings: boolean;
  isGasGiant: boolean;
  interactive: boolean;
}

function PlanetScene({
  color, secondaryColor, size, rotationSpeed,
  hasRings, isGasGiant, interactive,
}: SceneProps) {
  const planetRef = useRef<THREE.Mesh>(null!);

  const primaryColor = useMemo(() => new THREE.Color(color), [color]);
  const secColor    = useMemo(() => new THREE.Color(secondaryColor), [secondaryColor]);
  const emissive    = useMemo(() => new THREE.Color(color).multiplyScalar(0.12), [color]);

  const bandTexture = useMemo(
    () => (isGasGiant ? makeBandTexture(primaryColor, secColor) : null),
    [isGasGiant, primaryColor, secColor],
  );

  useFrame((_, delta) => {
    planetRef.current.rotation.y += rotationSpeed * delta;
  });

  return (
    <>
      {/* Main planet sphere */}
      <mesh ref={planetRef}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={isGasGiant ? '#ffffff' : primaryColor}
          map={bandTexture ?? undefined}
          emissive={emissive}
          emissiveIntensity={1}
          roughness={isGasGiant ? 0.28 : 0.82}
          metalness={0.04}
        />
      </mesh>

      {/* Atmospheric limb glow */}
      <mesh>
        <sphereGeometry args={[size * 1.07, 32, 32]} />
        <meshStandardMaterial
          color={primaryColor}
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>

      {/* Equatorial particle ring */}
      <EquatorialParticles size={size} color={color} />

      {/* Saturn ring system */}
      {hasRings && (
        <group rotation={[Math.PI * 0.38, 0, Math.PI * 0.07]}>
          <mesh>
            <ringGeometry args={[size * 1.32, size * 1.78, 128]} />
            <meshBasicMaterial color="#d4aa6a" transparent opacity={0.82} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[size * 1.87, size * 2.24, 128]} />
            <meshBasicMaterial color="#c89050" transparent opacity={0.65} side={THREE.DoubleSide} />
          </mesh>
          <mesh>
            <ringGeometry args={[size * 2.3, size * 2.6, 128]} />
            <meshBasicMaterial color="#b87840" transparent opacity={0.35} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {interactive && (
        <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.55} />
      )}
    </>
  );
}

// ── Public component ─────────────────────────────────────────────────────────

export function Planet3D({
  color,
  secondaryColor,
  size = 1,
  rotationSpeed = 0.3,
  hasRings = false,
  isGasGiant = false,
  interactive = false,
  bloom = false,
  className,
  style,
}: Planet3DProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const sec  = secondaryColor ?? color;
  const camZ = hasRings ? size * 7.5 : size * 3.5;

  if (!mounted) {
    return (
      <div
        className={className}
        style={{
          ...style,
          borderRadius: '50%',
          background: `radial-gradient(circle at 32% 30%, ${color}ee, ${color}99 40%, ${sec}dd)`,
          boxShadow: `0 0 40px ${color}40, 0 0 80px ${color}18`,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        ...style,
        ...(bloom ? { filter: `drop-shadow(0 0 18px ${color}80) drop-shadow(0 0 6px ${color}40)` } : {}),
      }}
    >
      <Canvas
        camera={{ position: [0, 0, camZ], fov: 40 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.22} />
        <directionalLight position={[5, 3, 5]} intensity={2.6} color="#fff8f0" />
        <pointLight position={[-6, -4, -4]} intensity={0.55} color={color} />

        <PlanetScene
          color={color}
          secondaryColor={sec}
          size={size}
          rotationSpeed={rotationSpeed}
          hasRings={hasRings}
          isGasGiant={isGasGiant}
          interactive={interactive}
        />
      </Canvas>
    </div>
  );
}
