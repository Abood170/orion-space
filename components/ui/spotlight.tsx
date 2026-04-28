'use client';

import { useEffect, useRef, useState } from 'react';

interface SpotlightProps {
  className?: string;
}

export function Spotlight({ className = '' }: SpotlightProps) {
  const [pos, setPos] = useState({ x: 50, y: 38 });
  const [mounted, setMounted] = useState(false);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    setMounted(true);

    const onMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => {
        setPos({
          x: (e.clientX / window.innerWidth) * 100,
          y: (e.clientY / window.innerHeight) * 100,
        });
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Mouse-tracking radial glow */}
      <div
        className={`pointer-events-none absolute inset-0 ${className}`}
        style={{
          background: `radial-gradient(700px circle at ${pos.x}% ${pos.y}%, rgba(59,130,246,0.09) 0%, transparent 60%)`,
        }}
      />
      {/* Static ambient spotlight — top center */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(59,130,246,0.12) 0%, transparent 70%)',
        }}
      />
    </>
  );
}
