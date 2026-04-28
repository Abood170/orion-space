import type { Metadata } from 'next';
import { BlackHoleClient } from './client';

export const metadata: Metadata = {
  title: 'Black Hole — Orion Space',
  description: 'Simulate Sagittarius A*, the supermassive black hole at the centre of our galaxy. Adjust gravity, trigger spaghettification, and explore the science.',
};

export default function BlackHolePage() {
  return <BlackHoleClient />;
}
