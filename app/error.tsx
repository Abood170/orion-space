'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div
          className="w-24 h-24 rounded-full mx-auto mb-8"
          style={{
            background: 'radial-gradient(circle at 32% 30%, #ef4444, #7f1d1d)',
            boxShadow: '0 0 60px #ef444430',
            opacity: 0.6,
          }}
        />
        <p className="text-red-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
          System Error
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">
          Cosmic Anomaly
        </h1>
        <p className="text-white/45 text-lg mb-10 max-w-sm mx-auto">
          Something unexpected disrupted this mission. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all duration-300 hover:shadow-[0_0_30px_#3b82f640]"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/25 text-sm font-medium transition-all duration-300"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
