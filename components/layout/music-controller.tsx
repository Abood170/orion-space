'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { spaceMusicPlayer } from '@/lib/space-music';

type Route = '/' | '/planets' | '/orrery' | '/timeline' | '/quiz' | '/blackhole' | '/galaxy';

function routeToPlay(pathname: string): Route | null {
  if (pathname === '/')                        return '/';
  if (pathname.startsWith('/planets'))         return '/planets';
  if (pathname.startsWith('/orrery'))          return '/orrery';
  if (pathname.startsWith('/timeline'))        return '/timeline';
  if (pathname.startsWith('/quiz'))            return '/quiz';
  if (pathname.startsWith('/blackhole'))       return '/blackhole';
  if (pathname.startsWith('/galaxy'))          return '/galaxy';
  return null;
}

function playForRoute(route: Route | null) {
  switch (route) {
    case '/':          spaceMusicPlayer.playHome();      break;
    case '/planets':   spaceMusicPlayer.playPlanets();   break;
    case '/orrery':    spaceMusicPlayer.playOrrery();    break;
    case '/timeline':  spaceMusicPlayer.playTimeline();  break;
    case '/quiz':      spaceMusicPlayer.playQuiz();      break;
    case '/blackhole': spaceMusicPlayer.playBlackHole(); break;
    case '/galaxy':    spaceMusicPlayer.playGalaxy();    break;
    default:           spaceMusicPlayer.stopAll();
  }
}

function SpeakerIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

export function MusicController() {
  const pathname    = usePathname();
  const [muted,     setMuted]     = useState(false);
  const [volume,    setVolume]    = useState(0.7);
  const [started,   setStarted]   = useState(false);
  const [expanded,  setExpanded]  = useState(false);
  const currentRoute = useRef<Route | null>(null);
  const panelRef     = useRef<HTMLDivElement>(null);

  // Init on first user gesture
  useEffect(() => {
    const start = () => {
      if (started) return;
      spaceMusicPlayer.init();
      spaceMusicPlayer.resume();
      spaceMusicPlayer.setVolume(volume);
      const route = routeToPlay(pathname);
      currentRoute.current = route;
      playForRoute(route);
      spaceMusicPlayer.fadeIn();
      setStarted(true);
      window.removeEventListener('click', start);
      window.removeEventListener('keydown', start);
    };
    window.addEventListener('click', start, { once: true });
    window.addEventListener('keydown', start, { once: true });
    return () => {
      window.removeEventListener('click', start);
      window.removeEventListener('keydown', start);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Route changes → crossfade to new track
  useEffect(() => {
    if (!started) return;
    const route = routeToPlay(pathname);
    if (route === currentRoute.current) return;
    currentRoute.current = route;
    spaceMusicPlayer.fadeOut(() => {
      playForRoute(route);
      spaceMusicPlayer.fadeIn();
    });
  }, [pathname, started]);

  // Close panel on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    if (expanded) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded]);

  const handleMute = () => {
    const next = !muted;
    setMuted(next);
    spaceMusicPlayer.setMuted(next);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    spaceMusicPlayer.setVolume(v);
    if (muted) { setMuted(false); spaceMusicPlayer.setMuted(false); }
  };

  const isBlackhole = pathname === '/blackhole';

  return (
    <div
      ref={panelRef}
      className={`fixed bottom-5 z-50 flex flex-col gap-2 ${isBlackhole ? 'left-5 items-start' : 'right-5 items-end'}`}
    >
      {/* Volume panel */}
      {expanded && (
        <div
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-2xl"
          style={{
            background: 'rgba(10,10,15,0.88)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <button
            onClick={handleMute}
            className="text-white/40 hover:text-white/70 transition-colors shrink-0"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            <SpeakerIcon muted={muted} />
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={muted ? 0 : volume}
            onChange={handleVolume}
            className="w-24 cursor-pointer"
            style={{ accentColor: '#3b82f6' }}
          />
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => {
          if (!started) return;
          setExpanded((v) => !v);
        }}
        title={started ? 'Music controls' : 'Click anywhere to start music'}
        aria-label="Music controls"
        className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
        style={{
          background: 'rgba(10,10,15,0.88)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,255,255,0.10)',
          color: muted ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.5)',
        }}
      >
        <SpeakerIcon muted={muted || !started} />
      </button>
    </div>
  );
}
