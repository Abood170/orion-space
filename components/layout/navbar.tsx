'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

const directLinks = [
  { href: '/',        label: 'Home'    },
  { href: '/planets', label: 'Planets' },
];

const dropdownLinks = [
  { href: '/orrery',    label: 'Orrery',     icon: '🪐' },
  { href: '/timeline',  label: 'Timeline',   icon: '📜' },
  { href: '/quiz',      label: 'Quiz',       icon: '🧠' },
  { href: '/blackhole', label: 'Black Hole', icon: '🕳️' },
  { href: '/galaxy',    label: 'Galaxy',     icon: '🌌' },
  { href: '/sandbox',   label: 'Sandbox',    icon: '⚛️' },
];

function checkActive(pathname: string, href: string): boolean {
  return href === '/' ? pathname === '/' : pathname.startsWith(href);
}

// ─── Magnetic nav link ────────────────────────────────────────────────────────
function MagLink({
  href, label, active, isHovered, onEnter, onLeave, linkRef,
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
  const x  = useSpring(mx, { stiffness: 250, damping: 20 });
  const y  = useSpring(my, { stiffness: 250, damping: 20 });

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width  / 2) * 0.18);
    my.set((e.clientY - rect.top  - rect.height / 2) * 0.35);
  };

  const handleLeave = () => { mx.set(0); my.set(0); onLeave(); };

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
        className="relative block px-4 py-1.5 rounded-lg font-medium transition-colors duration-200"
        style={{ fontSize: 14, color: active || isHovered ? '#fff' : 'rgba(255,255,255,0.5)' }}
      >
        {label}
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

// ─── Explore dropdown ─────────────────────────────────────────────────────────
function ExploreDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isAnyActive = dropdownLinks.some((l) => checkActive(pathname, l.href));

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-4 py-1.5 rounded-lg font-medium transition-colors duration-200"
        style={{ fontSize: 14, color: isAnyActive || open ? '#fff' : 'rgba(255,255,255,0.5)' }}
      >
        Explore
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] opacity-60 mt-px"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-2 min-w-[180px] rounded-xl overflow-hidden z-50 py-1"
            style={{
              background: 'rgba(0,0,0,0.88)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.10)',
            }}
          >
            {dropdownLinks.map((link) => {
              const active = checkActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/[0.06] transition-colors"
                  style={{ color: active ? '#fff' : 'rgba(255,255,255,0.55)' }}
                >
                  <span className="text-base leading-none">{link.icon}</span>
                  <span className={cn('text-[13px]', active && 'font-semibold')}>{link.label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                  )}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
export function Navbar() {
  const pathname = usePathname();
  const [scrolled,  setScrolled]  = useState(false);
  const [hovered,   setHovered]   = useState<string | null>(null);
  const [underline, setUnderline] = useState({ left: 0, width: 0, visible: false });

  const linkRefs    = useRef<(HTMLAnchorElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    const activeIndex = directLinks.findIndex((l) => checkActive(pathname, l.href));
    const el        = linkRefs.current[activeIndex];
    const container = containerRef.current;

    if (el && container) {
      const cRect = container.getBoundingClientRect();
      const eRect = el.getBoundingClientRect();
      const pad   = eRect.width * 0.1;
      setUnderline({ left: eRect.left - cRect.left + pad, width: eRect.width - pad * 2, visible: true });
    } else {
      setUnderline((u) => ({ ...u, visible: false }));
    }
  }, [pathname]);

  if (pathname === '/blackhole' || pathname === '/galaxy' || pathname === '/sandbox') return null;

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl transition-[padding] duration-300',
        scrolled ? 'py-2' : 'py-4',
      )}
      style={{
        animation: 'fadeDown 0.6s ease-out both',
        borderBottom: scrolled ? '1px solid transparent' : '1px solid rgba(255,255,255,0.06)',
        backgroundImage: scrolled
          ? 'linear-gradient(#0a0a0f, #0a0a0f), linear-gradient(90deg, transparent 0%, #3b82f6 30%, #8b5cf6 60%, transparent 100%)'
          : undefined,
        backgroundOrigin: scrolled ? 'border-box' : undefined,
        backgroundClip:   scrolled ? 'padding-box, border-box' : undefined,
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
          {/* Links container */}
          <div ref={containerRef} className="relative flex items-center gap-6">
            {/* Sliding underline — only for direct links */}
            <div
              className="absolute bottom-0 h-px rounded-full bg-blue-400 pointer-events-none"
              style={{
                left: underline.left,
                width: underline.width,
                opacity: underline.visible ? 1 : 0,
                transition: 'left 0.28s cubic-bezier(0.34,1.56,0.64,1), width 0.28s ease, opacity 0.15s ease',
              }}
            />

            {directLinks.map((link, i) => (
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

            <ExploreDropdown pathname={pathname} />
          </div>

          {/* Launch App CTA */}
          <Link
            href="/planets"
            className="relative ml-3 inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold text-white overflow-hidden"
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
            <span className="relative">Launch App</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
