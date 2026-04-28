import dynamic from 'next/dynamic';
import { planets } from '@/lib/planets';
import { PlanetCard } from '@/components/ui/planet-card';
import { HeroSection } from '@/components/ui/hero-section';
import { StatsBar } from '@/components/ui/stats-bar';
import { FeatureBento } from '@/components/sections/feature-bento';

const HeroScene = dynamic(
  () => import('@/components/hero/hero-scene').then((m) => m.HeroScene),
  { ssr: false },
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#0a0a0f]">
      {/* 3D hero background — absolute, behind hero content */}
      <div
        className="absolute top-0 left-0 w-full pointer-events-none"
        style={{ height: '100vh', zIndex: 0 }}
        aria-hidden
      >
        <HeroScene />
      </div>

      {/* Hero content */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* ── Stats bar ── */}
      <div className="relative z-10 px-4">
        <StatsBar />
      </div>

      {/* ── Planet grid ── */}
      <section id="planets" className="relative z-10 py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center mb-16"
            style={{ animation: 'fadeUp 0.6s ease-out 0.1s both' }}
          >
            <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
              The Eight Planets
            </h2>
            <p className="text-white/45 text-lg max-w-xl mx-auto leading-relaxed">
              From the scorched surface of Mercury to the icy reaches of Neptune —
              every world tells its own extraordinary story.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {planets.map((planet, index) => (
              <PlanetCard key={planet.slug} planet={planet} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Feature bento ── */}
      <div className="relative z-10">
        <FeatureBento />
      </div>
    </div>
  );
}
