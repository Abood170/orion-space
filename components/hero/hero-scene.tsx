'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const count = typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 800;

  const geometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [count]);

  useFrame(() => { ref.current.rotation.y += 0.00015; });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.15} color="white" sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}

function HeroEarth() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(() => { ref.current.rotation.y += 0.003; });

  return (
    <mesh ref={ref} position={[8, -1, 0]}>
      <sphereGeometry args={[4, 64, 64]} />
      <meshStandardMaterial
        color="#3b82f6"
        emissive="#3b82f6"
        emissiveIntensity={0.25}
        roughness={0.7}
        metalness={0.1}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#fff8f0" />
      <Stars />
      <HeroEarth />
    </>
  );
}

export function HeroScene() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        filter: 'drop-shadow(0 0 24px rgba(59,130,246,0.35))',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        style={{ width: '100%', height: '100%' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
