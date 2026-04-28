import type { Metadata } from 'next';
import { TimelineClient } from '@/components/ui/timeline-client';

export const metadata: Metadata = {
  title: 'Space Exploration Timeline',
  description:
    'A visual history of space exploration from Sputnik 1957 to Starship 2024.',
};

export default function TimelinePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <TimelineClient />
    </div>
  );
}
