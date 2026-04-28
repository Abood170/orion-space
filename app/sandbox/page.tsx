import type { Metadata } from 'next';
import { SandboxClient } from './client';

export const metadata: Metadata = {
  title: 'Gravity Sandbox — Orion Space',
  description: 'Interactive gravity simulator — throw planets, create orbits, watch collisions.',
};

export default function SandboxPage() {
  return <SandboxClient />;
}
