import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import dynamic from 'next/dynamic';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { CursorGlow } from '@/components/ui/cursor-glow';
import { ProgressBar } from '@/components/ui/progress-bar';
import { ScrollProgress } from '@/components/ui/scroll-progress';
import { MusicController } from '@/components/layout/music-controller';

// WebGL star field — must not run server-side
const StarsBg = dynamic(
  () => import('@/components/ui/stars-bg').then((m) => m.StarsBg),
  { ssr: false },
);

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Orion Space — Explore the Solar System',
    template: '%s | Orion Space',
  },
  description:
    'An interactive 3D journey through our solar system. Explore all 8 planets, the live solar system orrery, and the history of space exploration.',
  keywords: ['solar system', 'planets', 'space', '3D', 'astronomy', 'interactive'],
  openGraph: {
    type: 'website',
    siteName: 'Orion Space',
    title: 'Orion Space — Explore the Solar System',
    description: 'An interactive 3D journey through our solar system.',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Orion Space' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orion Space — Explore the Solar System',
    description: 'An interactive 3D journey through our solar system.',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark bg-[#0a0a0f]" style={{ backgroundColor: '#0a0a0f' }}>
      <body
        className={`${inter.variable} bg-[#0a0a0f] text-white antialiased`}
        style={{ backgroundColor: '#0a0a0f', color: 'white', minHeight: '100vh' }}
      >
        <CursorGlow />
        <ScrollProgress />
        <ProgressBar />
        <StarsBg />
        <Navbar />
        <main className="relative z-10">{children}</main>
        <Footer />
        <MusicController />
      </body>
    </html>
  );
}
