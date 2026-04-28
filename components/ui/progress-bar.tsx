'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export function ProgressBar() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(100);
  const [visible, setVisible] = useState(false);
  const t1 = useRef<ReturnType<typeof setTimeout>>();
  const t2 = useRef<ReturnType<typeof setTimeout>>();
  const t3 = useRef<ReturnType<typeof setTimeout>>();
  const t4 = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    clearTimeout(t1.current);
    clearTimeout(t2.current);
    clearTimeout(t3.current);
    clearTimeout(t4.current);

    setProgress(0);
    setVisible(true);

    t1.current = setTimeout(() => setProgress(55), 30);
    t2.current = setTimeout(() => setProgress(78), 180);
    t3.current = setTimeout(() => setProgress(100), 420);
    t4.current = setTimeout(() => setVisible(false), 720);
  }, [pathname]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[9999] h-[2px] pointer-events-none"
      style={{
        opacity: visible ? 1 : 0,
        transition: visible ? 'opacity 0.1s' : 'opacity 0.3s 0.2s',
      }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          transition: progress === 0 ? 'none' : 'width 300ms ease',
          boxShadow: '0 0 8px #3b82f660',
        }}
      />
    </div>
  );
}
