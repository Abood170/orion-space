export interface GalaxyStar {
  id: number;
  name: string;
  type: string;
  constellation: string;
  distanceLY: number;
  magnitude: number;
  color: string;
  size: number;
  position: [number, number, number];
  facts: string[];
}

export const STAR_TYPE_COLORS: Record<string, string> = {
  'Blue Supergiant': '#aabbff',
  'White':           '#ffffff',
  'Yellow Dwarf':    '#ffee88',
  'Orange Giant':    '#ffaa44',
  'Red Supergiant':  '#ff4422',
  'Red Dwarf':       '#ff6644',
  'Black Hole':      '#ff8800',
};

export const GALAXY_STARS: GalaxyStar[] = [
  {
    id: 1, name: 'Sun', type: 'Yellow Dwarf', constellation: 'N/A',
    distanceLY: 0, magnitude: -26.7, color: '#ffee88', size: 0.8,
    position: [0, 0, 0],
    facts: [
      'The Sun contains 99.86% of the total mass in our solar system.',
      'Light from the Sun takes 8 minutes and 20 seconds to reach Earth.',
      'The Sun is about 4.6 billion years old and halfway through its main sequence life.',
    ],
  },
  {
    id: 2, name: 'Proxima Centauri', type: 'Red Dwarf', constellation: 'Centaurus',
    distanceLY: 4.24, magnitude: 11.1, color: '#ff6644', size: 0.35,
    position: [0.3, 0.1, -0.4],
    facts: [
      'The closest star to the Sun outside our solar system.',
      'Proxima b, an exoplanet in the habitable zone, orbits it every 11.2 days.',
      'Despite being nearby, it\'s far too faint to see with the naked eye (magnitude 11).',
    ],
  },
  {
    id: 3, name: 'Alpha Centauri', type: 'Yellow Dwarf', constellation: 'Centaurus',
    distanceLY: 4.37, magnitude: -0.3, color: '#ffee88', size: 0.85,
    position: [0.4, 0.0, -0.35],
    facts: [
      'A triple-star system — Alpha Centauri A and B orbit each other, with Proxima as a distant third.',
      'Alpha Centauri A is nearly a twin of our Sun in size and temperature.',
      'At 4.37 light years away, it would take over 6,000 years to reach with current spacecraft.',
    ],
  },
  {
    id: 4, name: "Barnard's Star", type: 'Red Dwarf', constellation: 'Ophiuchus',
    distanceLY: 5.96, magnitude: 9.5, color: '#ff6644', size: 0.32,
    position: [-0.4, 0.2, 0.55],
    facts: [
      'The fastest-moving star in the sky relative to the Sun.',
      'It moves across the sky faster than any other star — about half a degree per century.',
      'Despite being just 6 light years away, it is invisible without a telescope.',
    ],
  },
  {
    id: 5, name: 'Wolf 359', type: 'Red Dwarf', constellation: 'Leo',
    distanceLY: 7.86, magnitude: 13.5, color: '#ff6644', size: 0.28,
    position: [0.7, -0.1, 0.5],
    facts: [
      'One of the faintest and smallest stars known, with only 9% of the Sun\'s mass.',
      'Famous as the site of the pivotal Battle of Wolf 359 in Star Trek: The Next Generation.',
      'It flares unpredictably, releasing bursts of X-ray radiation.',
    ],
  },
  {
    id: 6, name: 'Lalande 21185', type: 'Red Dwarf', constellation: 'Ursa Major',
    distanceLY: 8.31, magnitude: 7.5, color: '#ff6644', size: 0.30,
    position: [-0.6, 0.3, 0.9],
    facts: [
      'The fourth-closest star system to the Sun.',
      'Thought to have two Jupiter-sized planets orbiting it.',
      'It is slowly drifting closer — in 20,000 years it will be the nearest star.',
    ],
  },
  {
    id: 7, name: 'Sirius', type: 'White', constellation: 'Canis Major',
    distanceLY: 8.6, magnitude: -1.46, color: '#ffffff', size: 0.9,
    position: [2.0, 0.1, 1.5],
    facts: [
      'The brightest star in the night sky, also known as the Dog Star.',
      'Sirius B, its white dwarf companion, was the first white dwarf ever discovered.',
      'Ancient Egyptians used Sirius\'s rising to predict the annual flooding of the Nile.',
    ],
  },
  {
    id: 8, name: 'EZ Aquarii', type: 'Red Dwarf', constellation: 'Aquarius',
    distanceLY: 8.72, magnitude: 12.5, color: '#ff6644', size: 0.25,
    position: [1.1, 0.2, -1.0],
    facts: [
      'A triple-star system of three red dwarf stars orbiting each other.',
      'All three stars are too faint to see without a telescope.',
      'The system is gravitationally bound and relatively young at ~1 billion years old.',
    ],
  },
  {
    id: 9, name: 'Procyon', type: 'Yellow Dwarf', constellation: 'Canis Minor',
    distanceLY: 11.46, magnitude: 0.34, color: '#ffee88', size: 0.75,
    position: [-1.8, 0.2, 2.1],
    facts: [
      'The eighth-brightest star in the night sky, known as the Little Dog Star.',
      'Like Sirius, it has a white dwarf companion called Procyon B.',
      'Procyon is significantly larger and brighter than the Sun, nearing the end of its main-sequence life.',
    ],
  },
  {
    id: 10, name: '61 Cygni', type: 'Orange Giant', constellation: 'Cygnus',
    distanceLY: 11.4, magnitude: 5.2, color: '#ffaa44', size: 0.55,
    position: [-2.6, 0.4, -1.7],
    facts: [
      'The first star (other than the Sun) to have its distance measured, in 1838 by Friedrich Bessel.',
      'A binary system of two orange dwarf stars orbiting each other every 659 years.',
      'Sometimes called "Piazzi\'s Flying Star" due to its large proper motion.',
    ],
  },
  {
    id: 11, name: 'Groombridge 34', type: 'Red Dwarf', constellation: 'Andromeda',
    distanceLY: 11.6, magnitude: 8.1, color: '#ff6644', size: 0.28,
    position: [-1.1, 0.2, -0.9],
    facts: [
      'A binary system of two red dwarf stars, catalogued by British astronomer Stephen Groombridge.',
      'Both stars occasionally produce powerful flares.',
      'No exoplanets have been confirmed in this system despite its proximity.',
    ],
  },
  {
    id: 12, name: 'Epsilon Eridani', type: 'Orange Giant', constellation: 'Eridanus',
    distanceLY: 10.5, magnitude: 3.73, color: '#ffaa44', size: 0.58,
    position: [2.7, -0.3, -1.8],
    facts: [
      'The third-closest individual star visible to the naked eye.',
      'One of the first stars suspected to have a debris disk, similar to our Kuiper Belt.',
      'Has been targeted by several SETI searches as a candidate for hosting habitable worlds.',
    ],
  },
  {
    id: 13, name: 'Ross 128', type: 'Red Dwarf', constellation: 'Virgo',
    distanceLY: 11.0, magnitude: 11.1, color: '#ff6644', size: 0.26,
    position: [-0.9, -0.1, 1.4],
    facts: [
      'Hosts Ross 128 b, a temperate exoplanet possibly within the habitable zone.',
      'Unlike many red dwarfs, Ross 128 is relatively quiet with few stellar flares.',
      'It is approaching our Sun and will be the closest star in about 71,000 years.',
    ],
  },
  {
    id: 14, name: 'Tau Ceti', type: 'Yellow Dwarf', constellation: 'Cetus',
    distanceLY: 11.9, magnitude: 3.5, color: '#ffee88', size: 0.72,
    position: [3.2, 0.1, -2.2],
    facts: [
      'One of the most Sun-like stars near Earth, 78% of the Sun\'s mass.',
      'Has at least five candidate exoplanets, two possibly in the habitable zone.',
      'Featured in many science fiction stories as a target for interstellar travel.',
    ],
  },
  {
    id: 15, name: 'Altair', type: 'White', constellation: 'Aquila',
    distanceLY: 17, magnitude: 0.77, color: '#ffffff', size: 0.78,
    position: [-5.2, 0.2, 2.4],
    facts: [
      'One of the vertices of the Summer Triangle asterism.',
      'Rotates so fast (once every 9 hours) that it bulges at its equator significantly.',
      'The first star outside the Sun to be directly imaged as a disk.',
    ],
  },
  {
    id: 16, name: 'Vega', type: 'White', constellation: 'Lyra',
    distanceLY: 25, magnitude: 0.03, color: '#ffffff', size: 0.82,
    position: [-8.5, 0.5, -3.5],
    facts: [
      'The second brightest star in the northern sky and part of the Summer Triangle.',
      'Will become the North Star in about 12,000 years due to Earth\'s axial precession.',
      'Featured in the movie Contact as the source of the alien signal.',
    ],
  },
  {
    id: 17, name: 'Fomalhaut', type: 'White', constellation: 'Piscis Austrinus',
    distanceLY: 25, magnitude: 1.16, color: '#ffffff', size: 0.76,
    position: [5.5, -0.6, -5.5],
    facts: [
      'Often called "the loneliest bright star" — no bright stars nearby in the sky.',
      'Surrounded by a prominent dust ring with a suspected exoplanet, Fomalhaut b.',
      'One of the first stars confirmed to have a debris disk imaged by the Hubble Space Telescope.',
    ],
  },
  {
    id: 18, name: '61 Virginis', type: 'Yellow Dwarf', constellation: 'Virgo',
    distanceLY: 28, magnitude: 4.74, color: '#ffee88', size: 0.68,
    position: [-5.5, 0.1, -3.2],
    facts: [
      'Nearly identical to the Sun in mass, temperature, and age.',
      'Has at least three super-Earth exoplanets in tight orbits.',
      'The most Sun-like star known to host a planetary system.',
    ],
  },
  {
    id: 19, name: 'Pollux', type: 'Orange Giant', constellation: 'Gemini',
    distanceLY: 34, magnitude: 1.14, color: '#ffaa44', size: 0.80,
    position: [-8.5, 0.3, 4.5],
    facts: [
      'The brightest star in Gemini, slightly outshining its twin Castor.',
      'Hosts a confirmed giant exoplanet, Pollux b, orbiting every 590 days.',
      'An evolved orange giant about 9 times wider than the Sun.',
    ],
  },
  {
    id: 20, name: 'Arcturus', type: 'Orange Giant', constellation: 'Boötes',
    distanceLY: 37, magnitude: -0.05, color: '#ffaa44', size: 0.92,
    position: [-10.5, 1.0, 6.5],
    facts: [
      'The brightest star in the northern celestial hemisphere.',
      'About 25 times larger than the Sun in diameter.',
      'Moves through the galaxy on a distinctly different path, suggesting it originated in a dwarf galaxy absorbed by the Milky Way.',
    ],
  },
  {
    id: 21, name: 'TRAPPIST-1', type: 'Red Dwarf', constellation: 'Aquarius',
    distanceLY: 40, magnitude: 18.8, color: '#ff6644', size: 0.22,
    position: [5.5, 0.3, -4.5],
    facts: [
      'Has seven Earth-sized planets, three of which are in the habitable zone.',
      'The most planetary discoveries for any star outside our solar system.',
      'Its star is so cool and red that standing on one of its planets, the star would appear salmon-colored.',
    ],
  },
  {
    id: 22, name: 'HD 40307', type: 'Orange Giant', constellation: 'Pictor',
    distanceLY: 42, magnitude: 7.17, color: '#ffaa44', size: 0.60,
    position: [8.5, -0.2, 6.5],
    facts: [
      'Home to six confirmed exoplanets, including HD 40307 g in the habitable zone.',
      'HD 40307 g is a "super-Earth" with a mass about 7 times that of Earth.',
      'One of the best candidates for further telescope study for signs of habitability.',
    ],
  },
  {
    id: 23, name: 'Capella', type: 'Yellow Dwarf', constellation: 'Auriga',
    distanceLY: 43, magnitude: 0.08, color: '#ffee88', size: 0.88,
    position: [-10.5, 0.8, -6.5],
    facts: [
      'The sixth-brightest star in the night sky, and the brightest in Auriga.',
      'Actually a binary of two giant yellow-white stars orbiting each other every 104 days.',
      'Despite appearing similar to the Sun in color, each component is about 2.5 times as massive.',
    ],
  },
  {
    id: 24, name: 'Castor', type: 'White', constellation: 'Gemini',
    distanceLY: 52, magnitude: 1.58, color: '#ffffff', size: 0.72,
    position: [-9.5, 0.4, 5.5],
    facts: [
      'Actually a sextuple-star system — six stars in three pairs orbiting each other.',
      'One of the most complex star systems visible to the naked eye.',
      'The twin pairs take over 400 years to orbit each other.',
    ],
  },
  {
    id: 25, name: 'Aldebaran', type: 'Orange Giant', constellation: 'Taurus',
    distanceLY: 65, magnitude: 0.87, color: '#ffaa44', size: 0.95,
    position: [13, -0.5, -9],
    facts: [
      'The brightest star in Taurus, marking the eye of the Bull.',
      'About 44 times the diameter of the Sun — if placed at the Sun\'s position, it would extend beyond Mercury.',
      'Pioneer 10 spacecraft is currently traveling in the direction of Aldebaran, arriving in about 2 million years.',
    ],
  },
  {
    id: 26, name: 'Regulus', type: 'Blue Supergiant', constellation: 'Leo',
    distanceLY: 79, magnitude: 1.36, color: '#aabbff', size: 0.85,
    position: [-15, 0.2, 9],
    facts: [
      'The brightest star in Leo, sometimes called "the heart of the lion".',
      'One of the fastest-rotating bright stars, spinning once every 15.9 hours.',
      'Four times hotter than the Sun and about 360 times more luminous.',
    ],
  },
  {
    id: 27, name: 'Gacrux', type: 'Red Supergiant', constellation: 'Crux',
    distanceLY: 88, magnitude: 1.64, color: '#ff4422', size: 0.80,
    position: [6.5, -1.3, 13],
    facts: [
      'The top star of the Southern Cross constellation.',
      'An irregular variable star whose brightness changes unpredictably.',
      'Much cooler and redder than the Sun despite being far more luminous.',
    ],
  },
  {
    id: 28, name: 'Achernar', type: 'Blue Supergiant', constellation: 'Eridanus',
    distanceLY: 139, magnitude: 0.46, color: '#aabbff', size: 0.90,
    position: [11, -1.6, -16],
    facts: [
      'The most oblate star known — it rotates so fast it is 56% wider at the equator than at the poles.',
      'The ninth-brightest star in the night sky and the brightest in Eridanus.',
      'At 6.7 times the mass of the Sun, it will likely end its life as a neutron star.',
    ],
  },
  {
    id: 29, name: 'Spica', type: 'Blue Supergiant', constellation: 'Virgo',
    distanceLY: 250, magnitude: 0.97, color: '#aabbff', size: 0.92,
    position: [-16, 0.3, 11],
    facts: [
      'A binary system of two blue-white stars orbiting each other every 4 days.',
      'The tidal distortion between the two stars gives Spica an egg-shaped appearance.',
      'Hipparchus used Spica\'s position to discover the precession of Earth\'s axis in 127 BC.',
    ],
  },
  {
    id: 30, name: 'Mimosa', type: 'Blue Supergiant', constellation: 'Crux',
    distanceLY: 280, magnitude: 1.30, color: '#aabbff', size: 0.88,
    position: [9.5, -1.1, 17],
    facts: [
      'The second-brightest star of the Southern Cross.',
      'A Beta Cephei variable that pulsates every 6 hours.',
      'About 34,000 times more luminous than the Sun.',
    ],
  },
  {
    id: 31, name: 'Canopus', type: 'White', constellation: 'Carina',
    distanceLY: 310, magnitude: -0.74, color: '#ffffff', size: 0.95,
    position: [8.5, -1.1, 15],
    facts: [
      'The second-brightest star in the night sky after Sirius.',
      'Used as a navigational reference by spacecraft including the Hubble Space Telescope.',
      'About 65 times the mass of the Sun and nearing the end of its brilliant life.',
    ],
  },
  {
    id: 32, name: 'Acrux', type: 'Blue Supergiant', constellation: 'Crux',
    distanceLY: 320, magnitude: 0.77, color: '#aabbff', size: 0.90,
    position: [8.5, -1.3, 18],
    facts: [
      'The brightest star in the Southern Cross and the 13th-brightest in the entire sky.',
      'A multiple star system of at least four stars.',
      'Appears on the flags of Australia, New Zealand, Brazil, and Papua New Guinea.',
    ],
  },
  {
    id: 33, name: 'Hadar', type: 'Blue Supergiant', constellation: 'Centaurus',
    distanceLY: 390, magnitude: 0.61, color: '#aabbff', size: 0.92,
    position: [7.5, -0.9, 19.5],
    facts: [
      'Also known as Beta Centauri, the second-brightest star in Centaurus.',
      'A triple-star system — two blue giant stars orbit each other with a third companion.',
      'Will explode as a supernova in about a million years.',
    ],
  },
  {
    id: 34, name: 'Adhara', type: 'Blue Supergiant', constellation: 'Canis Major',
    distanceLY: 430, magnitude: 1.50, color: '#aabbff', size: 0.88,
    position: [11, -0.9, 13],
    facts: [
      'If Adhara were at the same distance as Sirius, it would cast shadows on Earth.',
      'The strongest source of extreme ultraviolet radiation within 500 light years.',
      'Its name comes from the Arabic word for "virgins", part of an ancient star grouping.',
    ],
  },
  {
    id: 35, name: 'Antares', type: 'Red Supergiant', constellation: 'Scorpius',
    distanceLY: 550, magnitude: 1.06, color: '#ff4422', size: 1.0,
    position: [13, -0.6, 16.5],
    facts: [
      'So large that if placed where the Sun is, it would engulf all planets out to Jupiter.',
      'Its name means "rival of Mars" due to its reddish color.',
      'Will explode as a supernova within the next 100,000 years, visible in daylight from Earth.',
    ],
  },
  {
    id: 36, name: 'Betelgeuse', type: 'Red Supergiant', constellation: 'Orion',
    distanceLY: 700, magnitude: 0.42, color: '#ff4422', size: 1.0,
    position: [-17, 0.8, -13],
    facts: [
      'One of the largest stars visible to the naked eye — about 700 times the Sun\'s diameter.',
      'In 2019–2020, it dramatically dimmed (the "Great Dimming"), thought to be caused by a massive dust ejection.',
      'Expected to go supernova within the next 100,000 years — it will be visible in daylight.',
    ],
  },
  {
    id: 37, name: 'Rigel', type: 'Blue Supergiant', constellation: 'Orion',
    distanceLY: 860, magnitude: 0.13, color: '#aabbff', size: 0.95,
    position: [-19, 0.5, -16],
    facts: [
      'The seventh-brightest star in the sky and the brightest in Orion, despite being labeled Beta Orionis.',
      'About 120,000 times more luminous than the Sun.',
      'If Rigel replaced our Sun, Earth would be scorched — its habitable zone is around Saturn\'s orbit.',
    ],
  },
  {
    id: 38, name: 'Deneb', type: 'Blue Supergiant', constellation: 'Cygnus',
    distanceLY: 2615, magnitude: 1.25, color: '#aabbff', size: 1.0,
    position: [-21, 1.0, 5.5],
    facts: [
      'One of the most luminous stars in the Milky Way — estimated 200,000 times brighter than the Sun.',
      'Part of the Summer Triangle alongside Vega and Altair.',
      'Despite being 2,600 light years away, it shines as one of the 20 brightest stars in the sky.',
    ],
  },
  {
    id: 39, name: 'Kepler-452', type: 'Yellow Dwarf', constellation: 'Cygnus',
    distanceLY: 1400, magnitude: 13.7, color: '#ffee88', size: 0.65,
    position: [-23, 0.5, 8.5],
    facts: [
      'Hosts Kepler-452b, dubbed "Earth\'s cousin" — similar size, orbit, and parent star.',
      'The planet orbits in the habitable zone with a year lasting 385 days.',
      'Kepler-452 is 1.5 billion years older than the Sun, giving life much more time to evolve.',
    ],
  },
  {
    id: 40, name: 'Sagittarius A*', type: 'Black Hole', constellation: 'Sagittarius',
    distanceLY: 26000, magnitude: 0, color: '#ff8800', size: 1.5,
    position: [0, 0, -25],
    facts: [
      'The supermassive black hole at the center of the Milky Way, 4 million times the mass of the Sun.',
      'In 2022, the Event Horizon Telescope captured the first image of Sagittarius A*.',
      'Stars near the galactic center orbit Sag A* at up to 5,000 km/s — 1.7% the speed of light.',
    ],
  },
];
