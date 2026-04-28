'use client';

import { Planet3D } from './planet-3d';

export function HeroPlanet() {
  return (
    <div
      className="absolute right-[6%] top-1/2 -translate-y-1/2 w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 hidden sm:block pointer-events-none"
      style={{ animation: 'float 8s ease-in-out infinite' }}
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
