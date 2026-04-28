'use client';

import { ChevronDown } from 'lucide-react';

export function ScrollButton() {
  return (
    <button
      onClick={() => document.getElementById('planets')?.scrollIntoView({ behavior: 'smooth' })}
      className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-base transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_35px_#3b82f640]"
    >
      Begin Exploration
      <ChevronDown size={18} />
    </button>
  );
}
