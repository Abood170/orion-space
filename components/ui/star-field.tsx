'use client';

import { useEffect, useState } from 'react';

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  delay: number;
  duration: number;
}

export function StarField() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated: Star[] = Array.from({ length: 220 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 1.8 + 0.4,
      opacity: Math.random() * 0.6 + 0.1,
      delay: Math.random() * 5,
      duration: Math.random() * 4 + 2,
    }));
    setStars(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: 'white',
            opacity: star.opacity,
            animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          }}
        />
      ))}
      {/* Nebula gradients */}
      <div
        className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-[0.03]"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(80px)' }}
      />
    </div>
  );
}
