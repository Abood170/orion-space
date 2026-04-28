import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { planets, getPlanet } from '@/lib/planets';
import { PlanetDetail } from '@/components/ui/planet-detail';

export function generateStaticParams() {
  return planets.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const planet = planets.find((p) => p.slug === params.slug);
  if (!planet) return { title: 'Planet Not Found' };
  return {
    title: planet.name,
    description: planet.description,
    openGraph: {
      title: `${planet.name} | Orion Space`,
      description: planet.description,
    },
  };
}

export default function PlanetPage({ params }: { params: { slug: string } }) {
  const planet = getPlanet(params.slug);
  if (!planet) notFound();
  return <PlanetDetail planet={planet} />;
}
