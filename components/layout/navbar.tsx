'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/planets', label: 'Planets' },
  { href: '/orrery', label: 'Orrery' },
  { href: '/timeline', label: 'Timeline' },
  { href: '/quiz', label: 'Quiz' },
];

function checkActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

// Magnetic nav link — no layoutId, no conditionally mounted underline
function MagLink({
  href,
  label,
  active,
  isHovered,
  onEnter,
  onLeave,
  linkRef,
}: {
  href: string;
  label: string;
  active: boolean;
  isHovered: boolean;
  onEnter: () => void;
  onLeave: () => void;
  linkRef: (el: HTMLAnchorElement | null) => void;
}) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 250, damping: 20 });
  const y = useSpring(my, { stiffness: 250, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.18);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };

  const handleLeave = () => {
    mx.set(0);
    my.set(0);
    onLeave();
  };

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseEnter={onEnter}
      onMouseLeave={handleLeave}
      className="relative"
    >
      <Link
        ref={linkRef}
        href={href}
        className="relative block px-4 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
        style={{ color: active || isHovered ? '#fff' : 'rgba(255,255,255,0.5)' }}
      >
        {label}

        {/* Hover dot — only shown on non-active links */}
        <AnimatePresence>
          {isHovered && !active && (
            <motion.span
              key="dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400/50"
            />
          )}
        </AnimatePresence>
      </Link>
    </motion.div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0, visible: false });

  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Measure the active link and position the single underline element
  useLayoutEffect(() => {
    const activeIndex = navLinks.findIndex((l) => checkActive(pathname, l.href));
    const el = linkRefs.current[activeIndex];
    const container = containerRef.current;

    if (el && container) {
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      const pad = eRect.width * 0.1; // 10% inset each side → 80% wide underline
      setUnderline({
        left: eRect.left - cRect.left + pad,
        width: eRect.width - pad * 2,
        visible: true,
      });
    } else {
      setUnderline((u) => ({ ...u, visible: false }));
    }
  }, [pathname]);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl transition-[padding] duration-300',
        scrolled ? 'py-2' : 'py-4',
      )}
      style={{
        animation: 'fadeDown 0.6s ease-out both',
        borderBottom: scrolled
          ? '1px solid transparent'
          : '1px solid rgba(255,255,255,0.06)',
        backgroundImage: scrolled
          ? 'linear-gradient(#0a0a0f, #0a0a0f), linear-gradient(90deg, transparent 0%, #3b82f6 30%, #8b5cf6 60%, transparent 100%)'
          : undefined,
        backgroundOrigin: scrolled ? 'border-box' : undefined,
        backgroundClip: scrolled ? 'padding-box, border-box' : undefined,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <motion.div
            whileHover={{ rotate: 20, scale: 1.2 }}
            transition={{ type: 'spring', stiffness: 400, damping: 14 }}
            className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
            style={{ boxShadow: '0 0 16px #3b82f655' }}
          >
            <span className="text-white font-bold text-xs select-none">O</span>
          </motion.div>
          <span className="text-white font-semibold text-base tracking-wide">
            Orion<span className="text-blue-400">Space</span>
          </span>
        </Link>

        {/* Nav links + CTA */}
        <div className="flex items-center gap-1">
          {/* Links container — relative so the underline can be absolutely positioned */}
          <div ref={containerRef} className="relative flex items-center gap-1">
            {/* Single persistent underline — slides between active links via CSS transition */}
            <div
              className="absolute bottom-0 h-px rounded-full bg-blue-400 pointer-events-none"
              style={{
                left: underline.left,
                width: underline.width,
                opacity: underline.visible ? 1 : 0,
                transition: 'left 0.28s cubic-bezier(0.34,1.56,0.64,1), width 0.28s ease, opacity 0.15s ease',
              }}
            />

            {navLinks.map((link, i) => (
              <MagLink
                key={link.href}
                href={link.href}
                label={link.label}
                active={checkActive(pathname, link.href)}
                isHovered={hovered === link.href}
                onEnter={() => setHovered(link.href)}
                onLeave={() => setHovered(null)}
                linkRef={(el) => { linkRefs.current[i] = el; }}
              />
            ))}
          </div>

          {/* Explore CTA */}
          <Link
            href="/planets"
            className="relative ml-3 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-white overflow-hidden group"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              boxShadow: '0 0 18px #3b82f622',
            }}
          >
            <motion.span
              className="absolute inset-0 bg-white/[0.12]"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.35 }}
            />
            <span className="relative">Explore</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
