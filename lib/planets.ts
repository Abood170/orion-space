export interface Planet {
  slug: string;
  name: string;
  type: 'rocky' | 'gas';
  color: string;
  secondaryColor: string;
  hasRings: boolean;
  diameter: string;
  mass: string;
  distanceFromSun: string;
  moons: number;
  orbitalPeriod: string;
  description: string;
  funFacts: string[];
  keyFact: string;
}

export const planets: Planet[] = [
  {
    slug: 'mercury',
    name: 'Mercury',
    type: 'rocky',
    hasRings: false,
    color: '#a8a8b3',
    secondaryColor: '#6b6b7a',
    diameter: '4,879 km',
    mass: '3.30 × 10²³ kg',
    distanceFromSun: '57.9M km',
    moons: 0,
    orbitalPeriod: '88 days',
    description:
      'Mercury is the smallest planet in the Solar System and the closest to the Sun, completing an orbit every 88 Earth days. Despite its proximity to the Sun, it is not the hottest planet — Venus takes that title due to its thick atmosphere. Without an atmosphere to retain heat, Mercury experiences extreme temperature swings from -180°C at night to 430°C during the day.',
    funFacts: [
      'A single day on Mercury lasts 59 Earth days.',
      'Surface temperatures swing from -180°C at night to 430°C in daytime.',
      'Mercury is the second densest planet in the Solar System after Earth.',
      'Mercury has no moons and no rings — just a thin exosphere.',
    ],
    keyFact: '0 moons · Closest to the Sun',
  },
  {
    slug: 'venus',
    name: 'Venus',
    type: 'rocky',
    hasRings: false,
    color: '#f59e0b',
    secondaryColor: '#b45309',
    diameter: '12,104 km',
    mass: '4.87 × 10²⁴ kg',
    distanceFromSun: '108.2M km',
    moons: 0,
    orbitalPeriod: '225 days',
    description:
      'Venus is the second planet from the Sun and the hottest in our solar system, with surface temperatures reaching 465°C due to a runaway greenhouse effect. It rotates in the opposite direction to most planets, meaning the Sun rises in the west on Venus. A Venusian day is longer than its year — it takes 243 Earth days to rotate once.',
    funFacts: [
      'Venus rotates backwards relative to most other planets.',
      'A day on Venus (243 Earth days) is longer than its year (225 Earth days).',
      'Surface atmospheric pressure is 92 times greater than on Earth.',
      'Venus and Earth are nearly identical in size, earning Venus the title of "Earth\'s twin."',
    ],
    keyFact: '0 moons · Hottest planet at 465°C',
  },
  {
    slug: 'earth',
    name: 'Earth',
    type: 'rocky',
    hasRings: false,
    color: '#3b82f6',
    secondaryColor: '#1d4ed8',
    diameter: '12,742 km',
    mass: '5.97 × 10²⁴ kg',
    distanceFromSun: '149.6M km',
    moons: 1,
    orbitalPeriod: '365.25 days',
    description:
      'Earth is the third planet from the Sun and the only world known to harbor life. About 71% of its surface is covered in liquid water, creating the conditions necessary for biology as we know it. Earth\'s large Moon stabilizes its axial tilt, moderating the climate over millions of years.',
    funFacts: [
      'Earth is the densest planet in the Solar System at 5.51 g/cm³.',
      'The core temperature (~5,400°C) rivals the surface of the Sun.',
      'Earth\'s magnetic field deflects harmful solar radiation and cosmic rays.',
      'Our Moon is the fifth largest natural satellite in the Solar System.',
    ],
    keyFact: '1 moon · Only known world with life',
  },
  {
    slug: 'mars',
    name: 'Mars',
    type: 'rocky',
    hasRings: false,
    color: '#ef4444',
    secondaryColor: '#991b1b',
    diameter: '6,779 km',
    mass: '6.39 × 10²³ kg',
    distanceFromSun: '227.9M km',
    moons: 2,
    orbitalPeriod: '687 days',
    description:
      'Mars is the fourth planet from the Sun, known as the "Red Planet" for the iron oxide dust that coats its surface. It is home to Olympus Mons, the tallest volcano in the Solar System at 22 km, and Valles Marineris, a canyon system stretching 4,000 km. Mars has two small moons — Phobos and Deimos — thought to be captured asteroids.',
    funFacts: [
      'Olympus Mons is the tallest volcano in the Solar System at 22 km high.',
      'A Martian day (sol) is 24 hours and 37 minutes — very similar to Earth.',
      'Mars\' thin atmosphere is 95% carbon dioxide.',
      'Valles Marineris canyon is so long it could span the entire United States.',
    ],
    keyFact: '2 moons · Home to Olympus Mons',
  },
  {
    slug: 'jupiter',
    name: 'Jupiter',
    type: 'gas',
    hasRings: false,
    color: '#f97316',
    secondaryColor: '#9a3412',
    diameter: '139,820 km',
    mass: '1.90 × 10²⁷ kg',
    distanceFromSun: '778.5M km',
    moons: 95,
    orbitalPeriod: '11.9 years',
    description:
      'Jupiter is the largest planet in the Solar System — so massive it contains more than twice the material of all other planets combined. Its iconic Great Red Spot is a storm larger than Earth that has raged for over 350 years. Jupiter acts as a cosmic shield, its immense gravity capturing or deflecting many asteroids and comets headed toward the inner solar system.',
    funFacts: [
      'Jupiter has the shortest day of any planet, rotating in just under 10 hours.',
      'The Great Red Spot is a persistent anticyclonic storm larger than Earth.',
      'Jupiter has at least 95 known moons, including Ganymede — the largest moon in the Solar System.',
      'Jupiter\'s magnetic field is 14 times stronger than Earth\'s, creating powerful radiation belts.',
    ],
    keyFact: '95 moons · Largest planet',
  },
  {
    slug: 'saturn',
    name: 'Saturn',
    type: 'gas',
    hasRings: true,
    color: '#eab308',
    secondaryColor: '#854d0e',
    diameter: '116,460 km',
    mass: '5.68 × 10²⁶ kg',
    distanceFromSun: '1.43B km',
    moons: 146,
    orbitalPeriod: '29.5 years',
    description:
      'Saturn is the sixth planet from the Sun and the most visually stunning, famous for its spectacular ring system made of billions of ice and rock particles ranging from tiny grains to house-sized boulders. It is the least dense planet in the Solar System — so light it would theoretically float in water. Saturn has the most confirmed moons of any planet, at 146.',
    funFacts: [
      'Saturn\'s rings extend up to 282,000 km from the planet but are typically less than 100 m thick.',
      'Saturn is less dense than water (0.687 g/cm³) — it would float in a large enough ocean.',
      'With 146 confirmed moons, Saturn holds the solar system record.',
      'Saturn\'s moon Titan has a thick nitrogen atmosphere and lakes of liquid methane.',
    ],
    keyFact: '146 moons · Iconic ring system',
  },
  {
    slug: 'uranus',
    name: 'Uranus',
    type: 'gas',
    hasRings: false,
    color: '#67e8f9',
    secondaryColor: '#0e7490',
    diameter: '50,724 km',
    mass: '8.68 × 10²⁵ kg',
    distanceFromSun: '2.87B km',
    moons: 27,
    orbitalPeriod: '84 years',
    description:
      'Uranus is the seventh planet from the Sun and the first discovered with a telescope, by William Herschel in 1781. Its most remarkable feature is an axial tilt of 97.77°, causing it to essentially roll around the Sun on its side. This means its poles receive 42 years of continuous sunlight followed by 42 years of darkness over its 84-year orbit.',
    funFacts: [
      'Uranus rolls on its side with an axial tilt of nearly 98°.',
      'Its atmosphere at -224°C is the coldest of any planetary body in the Solar System.',
      'Uranus was discovered by William Herschel on March 13, 1781 — the first planet found by telescope.',
      'All 27 of Uranus\' moons are named after characters from Shakespeare and Alexander Pope.',
    ],
    keyFact: '27 moons · Rotates on its side',
  },
  {
    slug: 'neptune',
    name: 'Neptune',
    type: 'gas',
    hasRings: false,
    color: '#6366f1',
    secondaryColor: '#3730a3',
    diameter: '49,244 km',
    mass: '1.02 × 10²⁶ kg',
    distanceFromSun: '4.50B km',
    moons: 16,
    orbitalPeriod: '165 years',
    description:
      'Neptune is the eighth and farthest planet from the Sun in our Solar System. It is the smallest of the ice giants but punches above its weight with the strongest winds in the solar system, reaching speeds of 2,100 km/h. Neptune was the first planet whose existence was mathematically predicted before it was directly observed, in 1846.',
    funFacts: [
      'Neptune\'s winds are the fastest in the Solar System, reaching 2,100 km/h.',
      'Neptune was mathematically predicted by Urbain Le Verrier before being telescopically confirmed in 1846.',
      'A single Neptunian year lasts 165 Earth years — it completed its first orbit since discovery in 2011.',
      'Neptune\'s moon Triton orbits in retrograde and is slowly spiraling inward toward Neptune.',
    ],
    keyFact: '16 moons · Strongest winds in the Solar System',
  },
];

export function getPlanet(slug: string): Planet | undefined {
  return planets.find((p) => p.slug === slug);
}
