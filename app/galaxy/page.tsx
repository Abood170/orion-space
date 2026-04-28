import type { Metadata } from 'next';
import { GalaxyClient } from './client';

export const metadata: Metadata = {
  title: 'Galaxy Map — Orion Space',
  description: 'Explore an interactive 3D map of the Milky Way galaxy with real star data.',
};

export default function GalaxyPage() {
  return <GalaxyClient />;
}
