'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export interface LogEntry {
  id: number;
  ts: string;
  symbol: string;
  name: string;
  massLabel: string;
}

interface Props {
  entries: LogEntry[];
  totalSolarMasses: number;
  onReset: () => void;
}

function formatSolarMasses(n: number): string {
  if (n === 0) return '0';
  if (n < 1e-6) return n.toExponential(1);
  if (n < 0.01) return n.toExponential(2);
  return n.toFixed(3);
}

export function DestructionLog({ entries, totalSolarMasses, onReset }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  return (
    <div className="flex flex-col gap-2 w-64">
      <div className="flex items-center justify-between">
        <span className="text-white/30 text-[10px] tracking-[0.2em] uppercase">Destruction Log</span>
        {entries.length > 0 && (
          <button
            onClick={onReset}
            className="text-white/20 hover:text-white/40 text-[10px] tracking-wider uppercase transition-colors"
          >
            Reset BH
          </button>
        )}
      </div>

      {totalSolarMasses > 0 && (
        <div className="flex items-center justify-between border border-orange-500/10 rounded-lg px-2.5 py-1.5 bg-orange-500/5">
          <span className="text-white/30 text-[10px]">Total consumed</span>
          <span className="text-orange-400/70 text-[10px] font-mono">
            {formatSolarMasses(totalSolarMasses)} M☉
          </span>
        </div>
      )}

      <div
        ref={scrollRef}
        className="flex flex-col gap-1.5 max-h-52 overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
      >
        <AnimatePresence initial={false}>
          {entries.map((e) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.28 }}
              className="flex items-start gap-2"
            >
              <span className="text-white/20 font-mono text-[9px] mt-0.5 shrink-0">{e.ts}</span>
              <div className="text-[11px] leading-snug">
                <span className="text-white/55">{e.symbol} {e.name}</span>
                <span className="text-white/25"> consumed</span>
                <div className="text-white/20 text-[9px] font-mono">{e.massLabel} added</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {entries.length === 0 && (
          <p className="text-white/12 text-[10px] italic">No destructions yet...</p>
        )}
      </div>
    </div>
  );
}
