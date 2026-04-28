'use client';

import { Planet3D } from './planet-3d';

export function HeroPlanet() {
  return (
    <div
      className="absolute pointer-events-none hidden sm:block"
      style={{
        right: '2%',
        top: '25%',
        width: 200,
        height: 200,
        opacity: 0.7,
        animation: 'floatDownUp 8s ease-in-out infinite',
      }}
    >
      <Planet3D
        color="#3b82f6"
        secondaryColor="#1d4ed8"
        isGasGiant={false}
        rotationSpeed={0.18}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
