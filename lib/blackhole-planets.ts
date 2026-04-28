export type PlanetKey =
  | 'mercury' | 'venus' | 'earth' | 'mars'
  | 'jupiter' | 'saturn' | 'uranus' | 'neptune'
  | 'moon' | 'asteroid' | 'star';

export interface BHPlanetDef {
  name: string;
  symbol: string;
  radius: number;
  color: string;
  emissive?: string;
  emissiveIntensity?: number;
  hasRings?: boolean;
  hasAtmosphere?: boolean;
  massLabel: string;
  solarMassFraction: number;
  specialEffect?: 'atmosphere' | 'rings-first' | 'star-flash' | 'instant';
}

export const BH_PLANETS: Record<PlanetKey, BHPlanetDef> = {
  mercury:  { name: 'Mercury',  symbol: '☿',  radius: 0.15, color: '#b5b5b5', massLabel: '3.30×10²³ kg', solarMassFraction: 1.65e-7 },
  venus:    { name: 'Venus',    symbol: '♀',  radius: 0.25, color: '#e8cda0', massLabel: '4.87×10²⁴ kg', solarMassFraction: 2.45e-6 },
  earth:    { name: 'Earth',    symbol: '🌍', radius: 0.28, color: '#3b82f6', hasAtmosphere: true,  massLabel: '5.97×10²⁴ kg', solarMassFraction: 3.00e-6,  specialEffect: 'atmosphere'  },
  mars:     { name: 'Mars',     symbol: '♂',  radius: 0.20, color: '#c1440e', massLabel: '6.39×10²³ kg', solarMassFraction: 3.21e-7 },
  jupiter:  { name: 'Jupiter',  symbol: '♃',  radius: 0.70, color: '#c88b3a', massLabel: '1.90×10²⁷ kg', solarMassFraction: 9.55e-4 },
  saturn:   { name: 'Saturn',   symbol: '♄',  radius: 0.55, color: '#e4d191', hasRings: true,       massLabel: '5.68×10²⁶ kg', solarMassFraction: 2.86e-4,  specialEffect: 'rings-first' },
  uranus:   { name: 'Uranus',   symbol: '⛢',  radius: 0.40, color: '#7de8e8', massLabel: '8.68×10²⁵ kg', solarMassFraction: 4.36e-5 },
  neptune:  { name: 'Neptune',  symbol: '♆',  radius: 0.35, color: '#5b5ddf', massLabel: '1.02×10²⁶ kg', solarMassFraction: 5.15e-5 },
  moon:     { name: 'Moon',     symbol: '🌙', radius: 0.10, color: '#aaaaaa', massLabel: '7.35×10²² kg', solarMassFraction: 3.69e-8 },
  asteroid: { name: 'Asteroid', symbol: '☄️', radius: 0.08, color: '#887755', massLabel: '~10¹⁵ kg',     solarMassFraction: 5e-16,   specialEffect: 'instant'     },
  star:     { name: 'Star',     symbol: '🌟', radius: 0.90, color: '#ffdd44', emissive: '#ffaa00', emissiveIntensity: 2, massLabel: '2.00×10³⁰ kg', solarMassFraction: 1.0, specialEffect: 'star-flash' },
};

export const PLANET_ORDER: PlanetKey[] = [
  'mercury', 'venus', 'earth', 'mars',
  'jupiter', 'saturn', 'uranus', 'neptune',
  'moon', 'asteroid', 'star',
];
