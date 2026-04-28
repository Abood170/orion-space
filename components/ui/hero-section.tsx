'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { HeroPlanet } from './hero-planet';
import { Spotlight } from './spotlight';
import { GlowingButton } from './glowing-button';

const WORDS = ['Explore', 'the', 'Solar', 'System'];
const GRADIENT_START = 2; // "Solar" and "System" get the gradient

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.3 + 0.2,
      opacity: Math.random() * 0.65 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.018 + 0.006,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const t = performance.now() / 1000;
      for (const s of stars) {
        const opacity = s.opacity * (0.55 + 0.45 * Math.sin(s.phase + t * s.speed));
        ctx.beginPath();
        ctx.arc(s.x * canvas.width, s.y * canvas.height, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity.toFixed(3)})`;
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center px-6 pt-16 overflow-hidden"
      style={{ textAlign: 'center' }}
    >
      {/* Mouse-tracking spotlight */}
      <Spotlight />

      {/* Animated canvas star field */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: -1 }}
        aria-hidden
      />

      {/* Purple glow behind hero text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, #1a1040 0%, transparent 70%)' }}
      />

      {/* Ambient centre blue glow */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #3b82f60a 0%, transparent 65%)', filter: 'blur(40px)' }}
      />

      {/* Blue planet — right side */}
      <HeroPlanet />

      {/* Left decorative planet — purple */}
      <div
        className="absolute rounded-full pointer-events-none hidden lg:block"
        style={{
          left: '4%', top: '40%',
          width: 120, height: 120,
          opacity: 0.6,
          background: 'radial-gradient(circle at 32% 30%, #8b5cf6bb, #4c1d95)',
          boxShadow: '0 0 40px #8b5cf625',
          animation: 'floatUpDown 6s ease-in-out infinite',
        }}
      />

      {/* Third decorative planet — Mars-orange, bottom-left */}
      <div
        className="absolute rounded-full pointer-events-none hidden lg:block"
        style={{
          left: '15%', bottom: '15%',
          width: 80, height: 80,
          opacity: 0.5,
          background: 'radial-gradient(circle at 35% 35%, #ff8866, #cc4422)',
          boxShadow: '0 0 30px #ff664420',
          animation: 'float 7s ease-in-out 3s infinite',
        }}
      />

      {/* ── Hero text ── */}
      <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center px-3 py-1 rounded-full border border-white/20 mb-6"
        >
          <span className="text-white/60 text-xs uppercase tracking-widest">Solar System Explorer</span>
        </motion.div>

        {/* Headline */}
        <h1
          className="font-bold text-white tracking-tight mb-6"
          style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1.05 }}
        >
          {mounted ? (
            WORDS.map((word, i) => {
              const isGradient = i >= GRADIENT_START;
              return (
                <motion.span
                  key={word}
                  initial={{ opacity: 0, y: 28 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.25 + i * 0.09, ease: 'easeOut' }}
                  className={
                    isGradient
                      ? 'inline-block mr-[0.22em] bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent'
                      : 'inline-block mr-[0.22em]'
                  }
                >
                  {word}
                </motion.span>
              );
            })
          ) : (
            <>
              Explore the{' '}
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 bg-clip-text text-transparent">
                Solar System
              </span>
            </>
          )}
        </h1>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.62 }}
          className="text-lg sm:text-xl text-white/50 max-w-lg mx-auto mb-12 leading-relaxed"
        >
          Journey through the cosmic neighborhood of our Sun — eight worlds,
          billions of kilometers, and countless wonders awaiting discovery.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.78 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center"
        >
          <GlowingButton
            onClick={() => document.getElementById('planets')?.scrollIntoView({ behavior: 'smooth' })}
            variant="primary"
          >
            Start Exploring
          </GlowingButton>

          <GlowingButton
            onClick={() => document.getElementById('planets')?.scrollIntoView({ behavior: 'smooth' })}
            variant="ghost"
          >
            View all planets
          </GlowingButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/25 pointer-events-none"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
