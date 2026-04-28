import type { Metadata } from 'next';
import { OrreryClient } from '@/components/orrery/orrery-client';

export const metadata: Metadata = {
  title: 'Solar System Orrery',
  description:
    'Watch all 8 planets orbit the sun in real time in this interactive 3D orrery.',
};

export default function OrreryPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <OrreryClient />
    </div>
  );
}
