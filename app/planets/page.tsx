import type { Metadata } from 'next';
import { PlanetsClient } from '@/components/ui/planets-client';

export const metadata: Metadata = {
  title: 'All Planets',
  description:
    'Explore all 8 planets of the solar system with 3D models, detailed stats, and fun facts.',
};

export default function PlanetsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <PlanetsClient />
    </div>
  );
}
