'use client';

import { memo, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function getStarCount() {
  if (typeof window === 'undefined') return 600;
  return window.innerWidth < 768 ? 300 : 600;
}

function StarField() {
  const ref = useRef<THREE.Points>(null!);

  const geometry = useMemo(() => {
    const count = getStarCount();
    const g = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 80 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame(() => {
    if (ref.current) ref.current.rotation.y += 0.00008;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial size={0.18} color="white" sizeAttenuation transparent opacity={0.75} />
    </points>
  );
}

const StarsBgCanvas = memo(function StarsBgCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 1], fov: 75 }}
      gl={{ antialias: false, powerPreference: 'low-power', alpha: true }}
      dpr={1}
    >
      <StarField />
    </Canvas>
  );
});

export const StarsBg = memo(function StarsBg() {
  if (typeof window !== 'undefined' && window.innerWidth < 768) return null;
  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <StarsBgCanvas />
    </div>
  );
});
