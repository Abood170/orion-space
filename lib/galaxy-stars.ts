export interface GalaxyStar {
  id: number;
  name: string;
  type: string;
  constellation: string;
  distanceLY: number;
  magnitude: number;
  color: string;
  size: number;
  radiusSolar: number;
  massSolar: number;
  tempK: number;
  luminosity: number;
  position: [number, number, number];
  facts: string[];
}

export const STAR_TYPE_COLORS: Record<string, string> = {
  'Blue Supergiant': '#aabbff',
  'White':           '#ffffff',
  'Yellow Dwarf':    '#ffee88',
  'Orange Giant':    '#ffaa55',
  'Red Supergiant':  '#ff4400',
  'Red Dwarf':       '#ff4422',
  'Black Hole':      '#ff8800',
};

function s(
  id: number, name: string, type: string, constellation: string,
  distanceLY: number, magnitude: number, color: string, size: number,
  radiusSolar: number, massSolar: number, tempK: number, luminosity: number,
  position: [number, number, number], facts: string[],
): GalaxyStar {
  return { id, name, type, constellation, distanceLY, magnitude, color, size, radiusSolar, massSolar, tempK, luminosity, position, facts };
}

export const GALAXY_STARS: GalaxyStar[] = [
  s(1, 'Sun', 'Yellow Dwarf', 'N/A', 0, -26.7, '#ffee88', 0.8,
    1.0, 1.0, 5778, 1,
    [0, 0, 0],
    [
      'The Sun contains 99.86% of the total mass in our solar system.',
      'Light from the Sun takes 8 minutes and 20 seconds to reach Earth.',
      'The Sun is about 4.6 billion years old and halfway through its main sequence life.',
    ]),

  s(2, 'Proxima Centauri', 'Red Dwarf', 'Centaurus', 4.24, 11.1, '#ff4422', 0.35,
    0.15, 0.12, 3042, 0.0017,
    [0.3, 0.1, -0.4],
    [
      'The closest star to the Sun outside our solar system.',
      'Proxima b, an exoplanet in the habitable zone, orbits it every 11.2 days.',
      'Despite being nearby, it is far too faint to see with the naked eye (magnitude 11).',
    ]),

  s(3, 'Alpha Centauri A', 'Yellow Dwarf', 'Centaurus', 4.37, -0.3, '#ffee99', 0.85,
    1.22, 1.1, 5790, 1.519,
    [0.4, 0.0, -0.35],
    [
      'The larger of the two main stars in the Alpha Centauri binary system.',
      'Nearly a twin of our Sun in size and temperature, slightly brighter and more massive.',
      'At 4.37 light years away, it would take over 6,000 years to reach with current spacecraft.',
    ]),

  s(4, "Barnard's Star", 'Red Dwarf', 'Ophiuchus', 5.96, 9.5, '#ff4422', 0.32,
    0.18, 0.16, 3134, 0.0035,
    [-0.4, 0.2, 0.55],
    [
      'The fastest-moving star in the sky relative to the Sun.',
      'It moves across the sky faster than any other star — about half a degree per century.',
      'Despite being just 6 light years away, it is invisible without a telescope.',
    ]),

  s(5, 'Wolf 359', 'Red Dwarf', 'Leo', 7.86, 13.5, '#ff3311', 0.28,
    0.16, 0.09, 2800, 0.0014,
    [0.7, -0.1, 0.5],
    [
      'One of the faintest and smallest stars known, with only 9% of the Sun\'s mass.',
      'Famous as the site of the pivotal Battle of Wolf 359 in Star Trek: The Next Generation.',
      'It flares unpredictably, releasing bursts of X-ray radiation.',
    ]),

  s(6, 'Lalande 21185', 'Red Dwarf', 'Ursa Major', 8.31, 7.5, '#ff5533', 0.30,
    0.39, 0.39, 3828, 0.026,
    [-0.6, 0.3, 0.9],
    [
      'The fourth-closest star system to the Sun.',
      'Thought to have two Jupiter-sized planets orbiting it.',
      'It is slowly drifting closer — in 20,000 years it will be the nearest star.',
    ]),

  s(7, 'Sirius', 'Blue Supergiant', 'Canis Major', 8.6, -1.46, '#aabbff', 0.9,
    1.71, 2.02, 9940, 25.4,
    [2.0, 0.1, 1.5],
    [
      'The brightest star in the night sky, also known as the Dog Star.',
      'Sirius B, its white dwarf companion, was the first white dwarf ever discovered.',
      'Ancient Egyptians used Sirius\'s rising to predict the annual flooding of the Nile.',
    ]),

  s(8, 'EZ Aquarii', 'Red Dwarf', 'Aquarius', 8.72, 12.5, '#ff3311', 0.25,
    0.30, 0.30, 3000, 0.008,
    [1.1, 0.2, -1.0],
    [
      'A triple-star system of three red dwarf stars orbiting each other.',
      'All three stars are too faint to see without a telescope.',
      'The system is gravitationally bound and relatively young at ~1 billion years old.',
    ]),

  s(9, 'Procyon', 'Yellow Dwarf', 'Canis Minor', 11.46, 0.34, '#ffeecc', 0.75,
    2.05, 1.5, 6530, 6.93,
    [-1.8, 0.2, 2.1],
    [
      'The eighth-brightest star in the night sky, known as the Little Dog Star.',
      'Like Sirius, it has a white dwarf companion called Procyon B.',
      'Procyon is significantly larger and brighter than the Sun, nearing the end of its main-sequence life.',
    ]),

  s(10, '61 Cygni A', 'Orange Giant', 'Cygnus', 11.4, 5.2, '#ff9955', 0.55,
    0.67, 0.70, 4526, 0.085,
    [-2.6, 0.4, -1.7],
    [
      'The first star (other than the Sun) to have its distance measured, in 1838 by Friedrich Bessel.',
      'A binary system of two orange dwarf stars orbiting each other every 659 years.',
      'Sometimes called "Piazzi\'s Flying Star" due to its large proper motion.',
    ]),

  s(11, 'Groombridge 34', 'Red Dwarf', 'Andromeda', 11.6, 8.1, '#ff4422', 0.28,
    0.38, 0.38, 3700, 0.022,
    [-1.1, 0.2, -0.9],
    [
      'A binary system of two red dwarf stars, catalogued by British astronomer Stephen Groombridge.',
      'Both stars occasionally produce powerful flares.',
      'No exoplanets have been confirmed in this system despite its proximity.',
    ]),

  s(12, 'Epsilon Eridani', 'Orange Giant', 'Eridanus', 10.5, 3.73, '#ff8844', 0.58,
    0.74, 0.86, 5084, 0.34,
    [2.7, -0.3, -1.8],
    [
      'The third-closest individual star visible to the naked eye.',
      'One of the first stars suspected to have a debris disk, similar to our Kuiper Belt.',
      'Has been targeted by several SETI searches as a candidate for hosting habitable worlds.',
    ]),

  s(13, 'Ross 128', 'Red Dwarf', 'Virgo', 11.0, 11.1, '#ff4422', 0.26,
    0.20, 0.17, 3192, 0.0036,
    [-0.9, -0.1, 1.4],
    [
      'Hosts Ross 128 b, a temperate exoplanet possibly within the habitable zone.',
      'Unlike many red dwarfs, Ross 128 is relatively quiet with few stellar flares.',
      'It is approaching our Sun and will be the closest star in about 71,000 years.',
    ]),

  s(14, 'Tau Ceti', 'Yellow Dwarf', 'Cetus', 11.9, 3.5, '#ffdd99', 0.72,
    0.79, 0.79, 5344, 0.52,
    [3.2, 0.1, -2.2],
    [
      'One of the most Sun-like stars near Earth, 78% of the Sun\'s mass.',
      'Has at least five candidate exoplanets, two possibly in the habitable zone.',
      'Featured in many science fiction stories as a target for interstellar travel.',
    ]),

  s(15, 'Altair', 'White', 'Aquila', 17, 0.77, '#ffffff', 0.78,
    1.63, 1.79, 7670, 10.6,
    [-5.2, 0.2, 2.4],
    [
      'One of the vertices of the Summer Triangle asterism.',
      'Rotates so fast (once every 9 hours) that it bulges at its equator significantly.',
      'The first star outside the Sun to be directly imaged as a disk.',
    ]),

  s(16, 'Vega', 'White', 'Lyra', 25, 0.03, '#ccddff', 0.82,
    2.36, 2.14, 9602, 40.12,
    [-8.5, 0.5, -3.5],
    [
      'The second brightest star in the northern sky and part of the Summer Triangle.',
      'Will become the North Star in about 12,000 years due to Earth\'s axial precession.',
      'Featured in the movie Contact as the source of the alien signal.',
    ]),

  s(17, 'Fomalhaut', 'White', 'Piscis Austrinus', 25, 1.16, '#ddeeff', 0.76,
    1.84, 1.92, 8590, 16.63,
    [5.5, -0.6, -5.5],
    [
      'Often called "the loneliest bright star" — no bright stars nearby in the sky.',
      'Surrounded by a prominent dust ring with a suspected exoplanet, Fomalhaut b.',
      'One of the first stars confirmed to have a debris disk imaged by the Hubble Space Telescope.',
    ]),

  s(18, '61 Virginis', 'Yellow Dwarf', 'Virgo', 28, 4.74, '#ffee88', 0.68,
    0.98, 0.95, 5577, 0.83,
    [-5.5, 0.1, -3.2],
    [
      'Nearly identical to the Sun in mass, temperature, and age.',
      'Has at least three super-Earth exoplanets in tight orbits.',
      'The most Sun-like star known to host a planetary system.',
    ]),

  s(19, 'Pollux', 'Orange Giant', 'Gemini', 34, 1.14, '#ffaa66', 0.80,
    9.06, 1.91, 4586, 32,
    [-8.5, 0.3, 4.5],
    [
      'The brightest star in Gemini, slightly outshining its twin Castor.',
      'Hosts a confirmed giant exoplanet, Pollux b, orbiting every 590 days.',
      'An evolved orange giant about 9 times wider than the Sun.',
    ]),

  s(20, 'Arcturus', 'Orange Giant', 'Boötes', 37, -0.05, '#ffaa55', 0.92,
    25.4, 1.1, 4286, 170,
    [-10.5, 1.0, 6.5],
    [
      'The brightest star in the northern celestial hemisphere.',
      'About 25 times larger than the Sun in diameter.',
      'Moves through the galaxy on a distinctly different path, suggesting it originated in a dwarf galaxy absorbed by the Milky Way.',
    ]),

  s(21, 'TRAPPIST-1', 'Red Dwarf', 'Aquarius', 40, 18.8, '#ff2200', 0.22,
    0.12, 0.09, 2566, 0.000553,
    [5.5, 0.3, -4.5],
    [
      'Has seven Earth-sized planets, three of which are in the habitable zone.',
      'The most planetary discoveries for any star outside our solar system.',
      'Its star is so cool and red that standing on one of its planets, it would appear salmon-colored.',
    ]),

  s(22, 'HD 40307', 'Orange Giant', 'Pictor', 42, 7.17, '#ffaa66', 0.60,
    0.72, 0.77, 4977, 0.24,
    [8.5, -0.2, 6.5],
    [
      'Home to six confirmed exoplanets, including HD 40307 g in the habitable zone.',
      'HD 40307 g is a "super-Earth" with a mass about 7 times that of Earth.',
      'One of the best candidates for further telescope study for signs of habitability.',
    ]),

  s(23, 'Capella', 'Orange Giant', 'Auriga', 43, 0.08, '#ffee99', 0.88,
    11.98, 2.47, 4970, 78.7,
    [-10.5, 0.8, -6.5],
    [
      'The sixth-brightest star in the night sky, and the brightest in Auriga.',
      'Actually a binary of two giant yellow-white stars orbiting each other every 104 days.',
      'Despite appearing similar to the Sun in color, each component is about 2.5 times as massive.',
    ]),

  s(24, 'Castor', 'White', 'Gemini', 52, 1.58, '#ddeeff', 0.72,
    2.09, 2.37, 8840, 14.2,
    [-9.5, 0.4, 5.5],
    [
      'Actually a sextuple-star system — six stars in three pairs orbiting each other.',
      'One of the most complex star systems visible to the naked eye.',
      'The twin pairs take over 400 years to orbit each other.',
    ]),

  s(25, 'Aldebaran', 'Orange Giant', 'Taurus', 65, 0.87, '#ff8844', 0.95,
    44.2, 1.16, 3910, 439,
    [13, -0.5, -9],
    [
      'The brightest star in Taurus, marking the eye of the Bull.',
      'About 44 times the diameter of the Sun — if placed at our Sun it would extend beyond Mercury.',
      'Pioneer 10 spacecraft is currently traveling toward Aldebaran, arriving in about 2 million years.',
    ]),

  s(26, 'Regulus', 'Blue Supergiant', 'Leo', 79, 1.36, '#aabbff', 0.85,
    3.09, 3.8, 11668, 363,
    [-15, 0.2, 9],
    [
      'The brightest star in Leo, sometimes called "the heart of the lion".',
      'One of the fastest-rotating bright stars, spinning once every 15.9 hours.',
      'Four times hotter than the Sun and about 360 times more luminous.',
    ]),

  s(27, 'Gacrux', 'Red Supergiant', 'Crux', 88, 1.64, '#ff5533', 0.80,
    84, 1.3, 3689, 1500,
    [6.5, -1.3, 13],
    [
      'The top star of the Southern Cross constellation.',
      'An irregular variable star whose brightness changes unpredictably.',
      'Much cooler and redder than the Sun despite being far more luminous.',
    ]),

  s(28, 'Achernar', 'Blue Supergiant', 'Eridanus', 139, 0.46, '#aabbff', 0.90,
    6.78, 6.1, 14145, 3150,
    [11, -1.6, -16],
    [
      'The most oblate star known — it rotates so fast it is 56% wider at the equator than at the poles.',
      'The ninth-brightest star in the night sky and the brightest in Eridanus.',
      'At 6.7 times the mass of the Sun, it will likely end its life as a neutron star.',
    ]),

  s(29, 'Spica', 'Blue Supergiant', 'Virgo', 250, 0.97, '#aabbff', 0.92,
    7.47, 10.25, 25300, 12100,
    [-16, 0.3, 11],
    [
      'A binary system of two blue-white stars orbiting each other every 4 days.',
      'The tidal distortion between the two stars gives Spica an egg-shaped appearance.',
      'Hipparchus used Spica\'s position to discover the precession of Earth\'s axis in 127 BC.',
    ]),

  s(30, 'Mimosa', 'Blue Supergiant', 'Crux', 280, 1.30, '#aabbff', 0.88,
    8.4, 16, 22000, 34000,
    [9.5, -1.1, 17],
    [
      'The second-brightest star of the Southern Cross.',
      'A Beta Cephei variable that pulsates every 6 hours.',
      'About 34,000 times more luminous than the Sun.',
    ]),

  s(31, 'Canopus', 'White', 'Carina', 310, -0.74, '#ffffff', 0.95,
    71, 8.5, 7400, 10700,
    [8.5, -1.1, 15],
    [
      'The second-brightest star in the night sky after Sirius.',
      'Used as a navigational reference by spacecraft including the Hubble Space Telescope.',
      'About 65 times the mass of the Sun and nearing the end of its brilliant life.',
    ]),

  s(32, 'Acrux', 'Blue Supergiant', 'Crux', 320, 0.77, '#aabbff', 0.90,
    7.8, 14.8, 24000, 25000,
    [8.5, -1.3, 18],
    [
      'The brightest star in the Southern Cross and the 13th-brightest in the entire sky.',
      'A multiple star system of at least four stars.',
      'Appears on the flags of Australia, New Zealand, Brazil, and Papua New Guinea.',
    ]),

  s(33, 'Hadar', 'Blue Supergiant', 'Centaurus', 390, 0.61, '#aabbff', 0.92,
    9.0, 13.02, 25000, 41700,
    [7.5, -0.9, 19.5],
    [
      'Also known as Beta Centauri, the second-brightest star in Centaurus.',
      'A triple-star system — two blue giant stars orbit each other with a third companion.',
      'Will explode as a supernova in about a million years.',
    ]),

  s(34, 'Adhara', 'Blue Supergiant', 'Canis Major', 430, 1.50, '#aabbff', 0.88,
    13.9, 12.6, 20000, 38700,
    [11, -0.9, 13],
    [
      'If Adhara were at the same distance as Sirius, it would cast shadows on Earth.',
      'The strongest source of extreme ultraviolet radiation within 500 light years.',
      'Its name comes from the Arabic word for "virgins", part of an ancient star grouping.',
    ]),

  s(35, 'Antares', 'Red Supergiant', 'Scorpius', 550, 1.06, '#ff3300', 1.0,
    700, 12, 3400, 75900,
    [13, -0.6, 16.5],
    [
      'So large that if placed where the Sun is, it would engulf all planets out to Jupiter.',
      'Its name means "rival of Mars" due to its reddish color.',
      'Will explode as a supernova within the next 100,000 years, visible in daylight from Earth.',
    ]),

  s(36, 'Betelgeuse', 'Red Supergiant', 'Orion', 700, 0.42, '#ff4400', 1.0,
    764, 11.6, 3500, 126000,
    [-17, 0.8, -13],
    [
      'One of the largest stars visible to the naked eye — about 764 times the Sun\'s radius.',
      'In 2019–2020, it dramatically dimmed (the "Great Dimming"), caused by a massive dust ejection.',
      'Expected to go supernova within the next 100,000 years — visible in daylight from Earth.',
    ]),

  s(37, 'Rigel', 'Blue Supergiant', 'Orion', 860, 0.13, '#aaccff', 0.95,
    78.9, 21, 12100, 120000,
    [-19, 0.5, -16],
    [
      'The seventh-brightest star in the sky, the brightest in Orion despite being labeled Beta Orionis.',
      'About 120,000 times more luminous than the Sun.',
      'If Rigel replaced our Sun, Earth would be scorched — its habitable zone is around Saturn\'s orbit.',
    ]),

  s(38, 'Deneb', 'Blue Supergiant', 'Cygnus', 2615, 1.25, '#ccddff', 1.0,
    203, 19, 8525, 196000,
    [-21, 1.0, 5.5],
    [
      'One of the most luminous stars in the Milky Way — estimated 196,000 times brighter than the Sun.',
      'Part of the Summer Triangle alongside Vega and Altair.',
      'Despite being 2,615 light years away, it shines as one of the 20 brightest stars in the sky.',
    ]),

  s(39, 'Alpha Centauri B', 'Yellow Dwarf', 'Centaurus', 4.37, 1.33, '#ffcc77', 0.75,
    0.86, 0.9, 5260, 0.5,
    [0.38, 0.0, -0.34],
    [
      'The smaller and cooler of the two main stars in the Alpha Centauri binary system.',
      'Alpha Centauri A and B orbit their common center of mass every 79.9 years.',
      'Slightly smaller and cooler than our Sun, emitting about half the Sun\'s luminosity.',
    ]),

  s(40, 'Sagittarius A*', 'Black Hole', 'Sagittarius', 26000, 0, '#000000', 1.5,
    2400000, 4000000, 0, 0,
    [0, 0, -25],
    [
      'The supermassive black hole at the center of the Milky Way, 4 million times the mass of the Sun.',
      'In 2022, the Event Horizon Telescope captured the first image of Sagittarius A*.',
      'Stars near the galactic center orbit Sag A* at up to 5,000 km/s — 1.7% the speed of light.',
    ]),
];
