export interface UniverseGalaxy {
  id: string;
  name: string;
  type: 'spiral' | 'elliptical' | 'irregular' | 'lenticular' | 'dwarf';
  distanceMly: number;
  diameterKly: number;
  stars: string;
  color: string;
  position: [number, number, number];
  description: string;
  discoveredBy: string;
  discoveredYear: number;
  facts: string[];
}

export interface UniverseNebula {
  id: string;
  name: string;
  type: 'emission' | 'reflection' | 'planetary' | 'supernova';
  distanceLy: number;
  color: string;
  position: [number, number, number];
  description: string;
  discoveredYear: number;
  facts: string[];
}

export interface DeepSpaceObject {
  id: string;
  name: string;
  type: string;
  distanceMly: number;
  color: string;
  position: [number, number, number];
  description: string;
  facts: string[];
}

export const GALAXIES: UniverseGalaxy[] = [
  {
    id: 'milky-way', name: 'Milky Way', type: 'spiral', distanceMly: 0, diameterKly: 100,
    stars: '200–400 billion', color: '#ffffcc', position: [0, 0, 0],
    description: 'Our home galaxy — a barred spiral galaxy containing our Solar System, roughly 100,000 light years across.',
    discoveredBy: 'Known since antiquity', discoveredYear: 0,
    facts: [
      'Contains a supermassive black hole (Sagittarius A*) at its center.',
      'The Solar System sits about 26,000 ly from the galactic center.',
      'Estimated to be 13.6 billion years old — nearly as old as the universe.',
    ],
  },
  {
    id: 'andromeda', name: 'Andromeda (M31)', type: 'spiral', distanceMly: 2.537, diameterKly: 220,
    stars: '1 trillion', color: '#ffeecc', position: [25, 2, -8],
    description: 'The nearest large galaxy and the most distant object visible to the naked eye. It is on a collision course with the Milky Way.',
    discoveredBy: 'Abd al-Rahman al-Sufi', discoveredYear: 964,
    facts: [
      'Will collide and merge with the Milky Way in approximately 4.5 billion years.',
      'Contains roughly twice as many stars as the Milky Way.',
      'Has at least 19 satellite galaxies, including M32 and M110.',
    ],
  },
  {
    id: 'triangulum', name: 'Triangulum (M33)', type: 'spiral', distanceMly: 2.73, diameterKly: 60,
    stars: '40 billion', color: '#eeddcc', position: [27, 0, 6],
    description: 'The third-largest member of the Local Group, a pure spiral with no central bulge.',
    discoveredBy: 'Giovanni Battista Hodierna', discoveredYear: 1654,
    facts: [
      'One of the most distant objects visible to the naked eye under dark skies.',
      'Contains a very prominent HII region called NGC 604.',
      'Has an unusually small central bulge compared to other spirals.',
    ],
  },
  {
    id: 'lmc', name: 'Large Magellanic Cloud', type: 'irregular', distanceMly: 0.158, diameterKly: 14,
    stars: '30 billion', color: '#ffddaa', position: [5, -4, 3],
    description: 'A satellite galaxy of the Milky Way visible from the Southern Hemisphere, home to the Tarantula Nebula.',
    discoveredBy: 'Ferdinand Magellan', discoveredYear: 1519,
    facts: [
      'Contains the Tarantula Nebula, the most active star-forming region in our galactic neighborhood.',
      'Supernova 1987A, the closest supernova since 1604, exploded here.',
      'Interacts gravitationally with the Milky Way and Small Magellanic Cloud.',
    ],
  },
  {
    id: 'smc', name: 'Small Magellanic Cloud', type: 'irregular', distanceMly: 0.197, diameterKly: 7,
    stars: '3 billion', color: '#ffeebb', position: [6, -4, 5],
    description: 'A dwarf irregular satellite galaxy of the Milky Way located near the LMC.',
    discoveredBy: 'Ferdinand Magellan', discoveredYear: 1519,
    facts: [
      'Contains stars at various stages of evolution, useful for calibrating cosmic distances.',
      'Henrietta Swan Leavitt discovered Cepheid variables here, revolutionizing astronomy.',
      'Connected to the LMC by a stream of neutral hydrogen gas.',
    ],
  },
  {
    id: 'whirlpool', name: 'Whirlpool Galaxy (M51)', type: 'spiral', distanceMly: 23, diameterKly: 76,
    stars: '160 billion', color: '#ccddff', position: [-60, 5, 35],
    description: 'A grand-design spiral galaxy interacting with a smaller companion galaxy NGC 5195.',
    discoveredBy: 'Charles Messier', discoveredYear: 1773,
    facts: [
      'One of the most photographed galaxies in the sky due to its face-on orientation.',
      'The first galaxy whose spiral structure was discovered (1845, Lord Rosse).',
      'Its interaction with NGC 5195 triggers intense star formation.',
    ],
  },
  {
    id: 'sombrero', name: 'Sombrero Galaxy (M104)', type: 'lenticular', distanceMly: 29.35, diameterKly: 50,
    stars: '800 billion', color: '#ffccaa', position: [85, -15, 30],
    description: 'A galaxy with a bright nucleus and a large central bulge, bisected by a dark dust lane.',
    discoveredBy: 'Pierre Méchain', discoveredYear: 1781,
    facts: [
      'Its large central bulge indicates a supermassive black hole of about 1 billion solar masses.',
      'Has an unusually large and bright globular cluster system.',
      'The dark dust lane is a signature of its high inclination from our viewpoint.',
    ],
  },
  {
    id: 'pinwheel', name: 'Pinwheel Galaxy (M101)', type: 'spiral', distanceMly: 20.9, diameterKly: 170,
    stars: '1 trillion', color: '#ccffdd', position: [-55, 8, -30],
    description: 'A face-on spiral galaxy twice the diameter of the Milky Way, located in Ursa Major.',
    discoveredBy: 'Pierre Méchain', discoveredYear: 1781,
    facts: [
      'One of the largest spirals known, spanning about 170,000 light years.',
      'Has hosted several recent supernovae, including SN 2011fe.',
      'Its asymmetric shape suggests a past interaction with a companion galaxy.',
    ],
  },
  {
    id: 'centaurus-a', name: 'Centaurus A', type: 'elliptical', distanceMly: 10.7, diameterKly: 60,
    stars: '200 billion', color: '#ddccff', position: [-35, -8, 18],
    description: 'One of the closest radio galaxies, featuring a prominent dark dust lane across its center.',
    discoveredBy: 'James Dunlop', discoveredYear: 1826,
    facts: [
      'Contains one of the most massive black holes, about 55 million solar masses.',
      'Emits powerful jets visible in X-ray and radio wavelengths.',
      'The dark dust lane is thought to be the remnant of a spiral galaxy it consumed.',
    ],
  },
  {
    id: 'ngc1300', name: 'NGC 1300', type: 'spiral', distanceMly: 61.3, diameterKly: 110,
    stars: 'unknown', color: '#ffddcc', position: [175, 14, -58],
    description: 'A prototypical barred spiral galaxy in the Eridanus constellation with a well-defined central bar.',
    discoveredBy: 'John Herschel', discoveredYear: 1835,
    facts: [
      'One of the best examples of a barred spiral galaxy.',
      'The bar structure funnels gas toward the center, fueling star formation.',
      'Was extensively studied with the Hubble Space Telescope.',
    ],
  },
  {
    id: 'cartwheel', name: 'Cartwheel Galaxy', type: 'irregular', distanceMly: 500, diameterKly: 150,
    stars: 'unknown', color: '#ffffff', position: [-270, 22, 105],
    description: 'A lenticular ring galaxy formed by a high-speed collision between two galaxies 200 million years ago.',
    discoveredBy: 'Fritz Zwicky', discoveredYear: 1941,
    facts: [
      'The ring is a massive star-forming region triggered by the galactic collision.',
      'James Webb Space Telescope revealed previously unseen star formation in exquisite detail.',
      'The inner galaxy is still visible as a smaller structure within the ring.',
    ],
  },
  {
    id: 'antennae', name: 'Antennae Galaxies', type: 'irregular', distanceMly: 45, diameterKly: 100,
    stars: 'unknown', color: '#ffaacc', position: [90, -22, 42],
    description: 'Two colliding galaxies (NGC 4038/4039) whose tidal interaction has created long antenna-like tails.',
    discoveredBy: 'William Herschel', discoveredYear: 1785,
    facts: [
      'One of the closest and youngest examples of merging galaxies.',
      'The collision has triggered the formation of millions of new star clusters.',
      'Will eventually merge into a single elliptical galaxy.',
    ],
  },
  {
    id: 'black-eye', name: "Black Eye Galaxy (M64)", type: 'spiral', distanceMly: 17, diameterKly: 54,
    stars: '100 billion', color: '#223344', position: [-48, 14, -20],
    description: 'Known for a spectacular dark band of absorbing dust in front of a bright nucleus.',
    discoveredBy: 'Edward Pigott', discoveredYear: 1779,
    facts: [
      'Its outer and inner discs rotate in opposite directions, a rare phenomenon.',
      'The counter-rotation likely resulted from a past galactic merger.',
      'Also called the "Sleeping Beauty Galaxy."',
    ],
  },
  {
    id: 'tadpole', name: 'Tadpole Galaxy', type: 'spiral', distanceMly: 420, diameterKly: 280,
    stars: 'unknown', color: '#aaccff', position: [245, 55, -88],
    description: 'A disrupted barred spiral with a tail of stars and star clusters 280,000 light years long.',
    discoveredBy: 'Halton Arp', discoveredYear: 1966,
    facts: [
      'The tail was created when a compact galaxy passed through its disc.',
      'Clusters of blue stars in the tail are being formed from the tidal forces.',
      'Hubble image revealed a compact intruder galaxy near the nucleus.',
    ],
  },
  {
    id: 'cigar', name: 'Cigar Galaxy (M82)', type: 'irregular', distanceMly: 12, diameterKly: 37,
    stars: '30 billion', color: '#ffaa88', position: [-34, 11, 11],
    description: 'A starburst galaxy with a superwind of hot gas shooting out from its core.',
    discoveredBy: 'Johann Elert Bode', discoveredYear: 1774,
    facts: [
      'The starburst rate is about 10 times that of the Milky Way.',
      'The galactic wind extends several thousand light years above the disc.',
      'It is gravitationally interacting with nearby M81 (Bode\'s Galaxy).',
    ],
  },
  {
    id: 'bodes', name: "Bode's Galaxy (M81)", type: 'spiral', distanceMly: 11.74, diameterKly: 90,
    stars: '250 billion', color: '#ffeecc', position: [-32, 12, 10],
    description: 'One of the brightest galaxies in the night sky, notable for its active galactic nucleus.',
    discoveredBy: 'Johann Elert Bode', discoveredYear: 1774,
    facts: [
      'Contains one of the best-studied supermassive black holes at 68 million solar masses.',
      'Part of the M81 Group, one of the nearest galaxy groups to the Local Group.',
      'Interacting with M82, distorting both galaxies through tidal forces.',
    ],
  },
  {
    id: 'ic1101', name: 'IC 1101', type: 'elliptical', distanceMly: 1045, diameterKly: 6000,
    stars: '100 trillion', color: '#ffddaa', position: [350, 40, -120],
    description: 'One of the largest known galaxies in the observable universe, located at the center of the Abell 2029 cluster.',
    discoveredBy: 'Albert Marth', discoveredYear: 1867,
    facts: [
      'About 60 times larger than the Milky Way in diameter.',
      'Would engulf the Milky Way and Andromeda combined many times over.',
      'Likely grew to this enormous size by consuming other galaxies.',
    ],
  },
  {
    id: 'mayalls', name: "Mayall's Object", type: 'irregular', distanceMly: 402, diameterKly: 100,
    stars: 'unknown', color: '#ccffee', position: [-235, 42, 78],
    description: 'A pair of colliding galaxies forming a distinctive ring-and-handle shape.',
    discoveredBy: 'Nicholas Mayall', discoveredYear: 1940,
    facts: [
      'The ring structure was created by a direct collision between two galaxies.',
      'Served as the inspiration for the Superman "S" shield logo.',
      'Intense star formation is occurring throughout the ring.',
    ],
  },
  {
    id: 'ngc1232', name: 'NGC 1232', type: 'spiral', distanceMly: 60, diameterKly: 200,
    stars: 'unknown', color: '#ddeeff', position: [178, 20, -62],
    description: 'A large face-on spiral galaxy in Eridanus with a tiny irregular companion.',
    discoveredBy: 'William Herschel', discoveredYear: 1784,
    facts: [
      'One of the largest spiral galaxies in its region, twice the diameter of the Milky Way.',
      'Has a prominent companion galaxy NGC 1232A distorting its outer arms.',
      'One of the most detailed images was taken by the VLT in 1998.',
    ],
  },
  {
    id: 'hoags', name: "Hoag's Object", type: 'lenticular', distanceMly: 600, diameterKly: 120,
    stars: 'unknown', color: '#ffffff', position: [295, -55, 108],
    description: 'A nearly perfect ring galaxy with a round core surrounded by a detached ring of young blue stars.',
    discoveredBy: 'Art Hoag', discoveredYear: 1950,
    facts: [
      'Formation mechanism is still debated — ring galaxies are extremely rare.',
      'Another ring galaxy is visible in the gap between the ring and core.',
      'The ring contains billions of newly formed blue-white stars.',
    ],
  },
  {
    id: 'ngc6872', name: 'NGC 6872', type: 'spiral', distanceMly: 212, diameterKly: 522,
    stars: 'unknown', color: '#ccddff', position: [-182, 30, -65],
    description: 'One of the largest known barred spiral galaxies, about five times the size of the Milky Way.',
    discoveredBy: 'John Herschel', discoveredYear: 1835,
    facts: [
      'One of the largest spiral galaxies ever measured.',
      'Its enormous size is partly due to gravitational interaction with IC 4970.',
      'Has an unusually extended outer arm reaching over 500,000 light years.',
    ],
  },
  {
    id: 'm87', name: 'Virgo A (M87)', type: 'elliptical', distanceMly: 53.5, diameterKly: 240,
    stars: '1 trillion', color: '#ffeecc', position: [160, -30, 55],
    description: 'A massive elliptical galaxy famous for its relativistic jet and the first black hole ever imaged.',
    discoveredBy: 'Charles Messier', discoveredYear: 1781,
    facts: [
      'Contains the first black hole ever directly imaged by the Event Horizon Telescope in 2019.',
      'Its central black hole has a mass of 6.5 billion solar masses.',
      'Emits a prominent jet of plasma extending at least 5,000 light years.',
    ],
  },
  {
    id: 'fornax-dwarf', name: 'Fornax Dwarf', type: 'dwarf', distanceMly: 0.46, diameterKly: 3.5,
    stars: '~20 million', color: '#ffddcc', position: [8, -2, 4],
    description: 'A dwarf spheroidal galaxy and satellite of the Milky Way in the Fornax constellation.',
    discoveredBy: 'Harlow Shapley', discoveredYear: 1938,
    facts: [
      'Contains 6 globular clusters despite its small size.',
      'Has a much higher mass-to-light ratio than expected, suggesting dark matter.',
      'Its stars are predominantly old, with little recent star formation.',
    ],
  },
  {
    id: 'sagittarius-dwarf', name: 'Sagittarius Dwarf', type: 'dwarf', distanceMly: 0.065, diameterKly: 10,
    stars: '~10 million', color: '#ffccaa', position: [2, 0, 1.5],
    description: 'A small satellite galaxy on the far side of the Milky Way that is being slowly consumed by it.',
    discoveredBy: 'Rodrigo Ibata', discoveredYear: 1994,
    facts: [
      'Currently passing through the Milky Way disc and being torn apart by tidal forces.',
      'Some Milky Way stars may have originated from this galaxy.',
      'It has orbited the Milky Way several times, losing mass with each pass.',
    ],
  },
  {
    id: 'leo-i', name: 'Leo I', type: 'dwarf', distanceMly: 0.82, diameterKly: 2,
    stars: '~5 million', color: '#ffeedd', position: [14, 2, -6],
    description: 'A dwarf spheroidal galaxy and one of the most distant known satellites of the Milky Way.',
    discoveredBy: 'Albert Wilson & Albert Sandage', discoveredYear: 1950,
    facts: [
      'One of the youngest dwarf spheroidals — it formed stars as recently as 1 billion years ago.',
      'Its high recession velocity raises questions about whether it is truly gravitationally bound to the Milky Way.',
      'Has very little gas or dust, suggesting its gas was stripped away long ago.',
    ],
  },
  {
    id: 'ngc4889', name: 'NGC 4889', type: 'elliptical', distanceMly: 308, diameterKly: 239,
    stars: 'unknown', color: '#ffeecc', position: [-215, 52, -72],
    description: 'A supergiant elliptical galaxy and the brightest galaxy in the Coma Cluster.',
    discoveredBy: 'Friedrich Wilhelm Herschel', discoveredYear: 1785,
    facts: [
      'Contains one of the most massive known black holes at 21 billion solar masses.',
      'The dominant galaxy of the Coma Cluster.',
      'Surrounded by a swarm of thousands of globular clusters.',
    ],
  },
  {
    id: 'ngc3842', name: 'NGC 3842', type: 'elliptical', distanceMly: 331, diameterKly: 200,
    stars: 'unknown', color: '#ffeedd', position: [205, 42, 92],
    description: 'The brightest galaxy in the Leo Cluster, known for hosting one of the largest black holes.',
    discoveredBy: 'William Herschel', discoveredYear: 1785,
    facts: [
      'Its central black hole has a mass of about 9.7 billion solar masses.',
      'One of two galaxies providing the strongest evidence for ultramassive black holes.',
      'Part of the Abell 1367 galaxy cluster.',
    ],
  },
  {
    id: 'sculptor', name: 'Sculptor Galaxy', type: 'spiral', distanceMly: 11.4, diameterKly: 90,
    stars: '~100 billion', color: '#ccffdd', position: [-30, -12, 12],
    description: 'A starburst galaxy and one of the closest and brightest galaxies to the Milky Way.',
    discoveredBy: 'Caroline Herschel', discoveredYear: 1783,
    facts: [
      'Discovered by Caroline Herschel, one of the first women to discover a comet.',
      'Has an intensely star-forming nucleus with very high infrared luminosity.',
      'Bright enough to be seen with binoculars under dark skies.',
    ],
  },
  {
    id: 'ngc253', name: 'NGC 253', type: 'spiral', distanceMly: 11.4, diameterKly: 70,
    stars: '~100 billion', color: '#ddeeff', position: [-28, -12, 14],
    description: 'One of the brightest and most active starburst galaxies in the sky.',
    discoveredBy: 'Caroline Herschel', discoveredYear: 1783,
    facts: [
      'Star formation rate is 10 times higher than the Milky Way\'s.',
      'Located in the Sculptor Group, the nearest galaxy group to the Local Group.',
      'Has a faint X-ray halo from hot gas driven out by stellar winds.',
    ],
  },
];

export const NEBULAE: UniverseNebula[] = [
  {
    id: 'orion', name: 'Orion Nebula (M42)', type: 'emission', distanceLy: 1344, color: '#ff88aa',
    position: [0.5, -0.3, 0.8],
    description: 'The nearest stellar nursery to Earth, visible to the naked eye as the middle "star" in Orion\'s sword.',
    discoveredYear: 1610,
    facts: [
      'A vast cloud of gas and dust where thousands of new stars are forming right now.',
      'The Trapezium cluster at its core is only about 300,000 years old.',
      'Spans about 24 light years and is about 2,000 times the mass of the Sun.',
    ],
  },
  {
    id: 'crab', name: 'Crab Nebula (M1)', type: 'supernova', distanceLy: 6523, color: '#88aaff',
    position: [-0.8, 0.5, -0.5],
    description: 'The remnant of a supernova explosion witnessed by Chinese astronomers in 1054 CE.',
    discoveredYear: 1731,
    facts: [
      'At its center is a pulsar spinning 30 times per second.',
      'Is expanding at over 1,500 km/s.',
      'One of the most studied objects in the sky across all wavelengths.',
    ],
  },
  {
    id: 'eagle', name: 'Eagle Nebula (M16)', type: 'emission', distanceLy: 7000, color: '#44ff88',
    position: [1.2, 0.2, -1.0],
    description: 'Famous for the "Pillars of Creation" — towering columns of gas and dust that are stellar nurseries.',
    discoveredYear: 1764,
    facts: [
      'The pillars are about 5 light years tall.',
      'A nearby supernova may have destroyed the pillars 6,000 years ago — we just cannot see it yet.',
      'The pillars are being eroded by radiation from newly formed stars.',
    ],
  },
  {
    id: 'helix', name: 'Helix Nebula', type: 'planetary', distanceLy: 655, color: '#00ffaa',
    position: [-0.5, -0.4, 0.6],
    description: 'One of the closest and largest planetary nebulae, sometimes called the "Eye of God."',
    discoveredYear: 1824,
    facts: [
      'Spans about 3 light years — enormous for a planetary nebula.',
      'The dying white dwarf at its center will eventually fade to a cold black dwarf.',
      'Has a complex double-ring structure that took centuries to unravel.',
    ],
  },
  {
    id: 'ring', name: 'Ring Nebula (M57)', type: 'planetary', distanceLy: 2283, color: '#aaffcc',
    position: [0.3, 0.6, -0.7],
    description: 'A nearly perfect ring of glowing gas expelled by a dying star in the constellation Lyra.',
    discoveredYear: 1779,
    facts: [
      'The central white dwarf is one of the hottest known at 125,000 K.',
      'The ring is about 1 light year across and expanding at about 20–30 km/s.',
      'What we see as a ring is actually a cylinder of gas viewed end-on.',
    ],
  },
  {
    id: 'carina', name: 'Carina Nebula', type: 'emission', distanceLy: 8500, color: '#ff6644',
    position: [-1.5, -0.2, 1.2],
    description: 'One of the largest and brightest nebulae in the sky, containing some of the most massive stars known.',
    discoveredYear: 1752,
    facts: [
      'Contains Eta Carinae, one of the most massive and luminous stars known.',
      'Four times larger than the Orion Nebula.',
      'Home to multiple stellar clusters and star-forming regions.',
    ],
  },
  {
    id: 'horsehead', name: 'Horsehead Nebula', type: 'emission', distanceLy: 1500, color: '#cc4488',
    position: [0.6, -0.5, 0.9],
    description: 'A dark nebula shaped like a horse\'s head, silhouetted against a bright emission nebula in Orion.',
    discoveredYear: 1888,
    facts: [
      'The dark shape is a dense cloud of gas and dust about 3.5 light years tall.',
      'Radiation from a nearby hot star causes the emission nebula to glow.',
      'One of the most recognized and photographed nebulae in the sky.',
    ],
  },
  {
    id: 'lagoon', name: 'Lagoon Nebula (M8)', type: 'emission', distanceLy: 4100, color: '#ff4466',
    position: [-0.2, 0.4, -1.1],
    description: 'A giant interstellar cloud in Sagittarius and a popular target for astronomers.',
    discoveredYear: 1747,
    facts: [
      'One of the few emission nebulae visible to the naked eye in both hemispheres.',
      'Contains a young cluster NGC 6530, whose hot stars illuminate the nebula.',
      'Spans about 110 by 50 light years.',
    ],
  },
  {
    id: 'rosette', name: 'Rosette Nebula', type: 'emission', distanceLy: 5000, color: '#ff2244',
    position: [1.0, 0.3, 0.8],
    description: 'A large, circular emission and reflection nebula in the Monoceros constellation.',
    discoveredYear: 1690,
    facts: [
      'The central cluster NGC 2244 powers the nebula with intense ultraviolet radiation.',
      'The nebula has a central hole carved out by stellar winds.',
      'Spans about 130 light years and is 5 times the apparent diameter of the full Moon.',
    ],
  },
  {
    id: 'cats-eye', name: "Cat's Eye Nebula", type: 'planetary', distanceLy: 3262, color: '#00ddff',
    position: [-0.7, 0.7, -0.4],
    description: 'One of the most structurally complex planetary nebulae, with concentric rings and jets.',
    discoveredYear: 1786,
    facts: [
      'Has at least 11 concentric shells formed by episodic mass ejections.',
      'The central star may actually be a binary system.',
      'Was the first nebula to have its spectrum analyzed (1864).',
    ],
  },
  {
    id: 'butterfly', name: 'Butterfly Nebula', type: 'planetary', distanceLy: 3800, color: '#aaccff',
    position: [0.4, -0.6, -0.8],
    description: 'A bipolar planetary nebula with two wing-like lobes of gas expanding from a central star.',
    discoveredYear: 1918,
    facts: [
      'The central star is one of the hottest known at about 200,000 K.',
      'Gas in the wings is moving at over 950 km/s.',
      'The bipolar shape is caused by a dense band of dust at the center.',
    ],
  },
  {
    id: 'pillars', name: 'Pillars of Creation', type: 'emission', distanceLy: 6500, color: '#ffaa44',
    position: [1.1, 0.1, -0.9],
    description: 'Iconic elephant-trunk pillars of gas and dust inside the Eagle Nebula, photographed by Hubble in 1995.',
    discoveredYear: 1995,
    facts: [
      'The tallest pillar is about 4 light years — roughly 100x the distance from the Sun to Pluto.',
      'Stars inside the pillars are just beginning to form.',
      'The 2014 Hubble image revealed new details in infrared light.',
    ],
  },
  {
    id: 'tarantula', name: 'Tarantula Nebula', type: 'emission', distanceLy: 160000, color: '#ff3366',
    position: [2.0, -2.0, 1.0],
    description: 'The largest and most active star-forming region in the Local Group, located in the Large Magellanic Cloud.',
    discoveredYear: 1751,
    facts: [
      'If it were as close as the Orion Nebula, it would cast shadows on Earth.',
      'Contains R136, a cluster with some of the most massive and luminous stars known.',
      'Spans about 1,000 light years across.',
    ],
  },
  {
    id: 'boomerang', name: 'Boomerang Nebula', type: 'planetary', distanceLy: 5000, color: '#aaffff',
    position: [-0.3, 0.8, 0.5],
    description: 'The coldest known natural place in the universe at −272°C, just 1 degree above absolute zero.',
    discoveredYear: 1980,
    facts: [
      'At −272°C, it is colder than the cosmic microwave background.',
      'The extreme cold is caused by rapid gas expansion from the dying central star.',
      'The gas is flowing out at about 164 km/s.',
    ],
  },
  {
    id: 'veil', name: 'Veil Nebula', type: 'supernova', distanceLy: 2100, color: '#8844ff',
    position: [0.8, 0.5, -0.3],
    description: 'The remnant of a supernova explosion that occurred about 10,000–20,000 years ago.',
    discoveredYear: 1784,
    facts: [
      'The original star was about 20 times more massive than the Sun.',
      'Spans about 110 light years and subtends 3 degrees of sky.',
      'At its brightest, the original supernova was likely visible in daylight.',
    ],
  },
];

export const DEEP_SPACE_OBJECTS: DeepSpaceObject[] = [
  {
    id: 'hubble-deep', name: 'Hubble Deep Field', type: 'Deep Field', distanceMly: 12000,
    color: '#aabbff', position: [150, 40, -80],
    description: 'A series of deep-field images showing nearly 3,000 galaxies in a tiny patch of sky, revealing the early universe.',
    facts: [
      'The original 1995 image covered 1/13,000,000 of the total sky.',
      'Contains galaxies as far as 12 billion light years away.',
      'Revealed the universe was more complex and galaxy-rich than imagined.',
    ],
  },
  {
    id: 'jwst-deep', name: 'James Webb Deep Field', type: 'Deep Field', distanceMly: 13200,
    color: '#ffccaa', position: [160, 45, -90],
    description: 'The deepest and sharpest infrared image of the universe, released in 2022, showing thousands of galaxies.',
    facts: [
      'Shows galaxies as they appeared just 600 million years after the Big Bang.',
      'Infrared capability reveals galaxies hidden behind dust clouds.',
      'Released by NASA in July 2022 as the first JWST science image.',
    ],
  },
  {
    id: 'bullet-cluster', name: 'Bullet Cluster', type: 'Galaxy Cluster', distanceMly: 3800,
    color: '#00ccff', position: [-100, 25, 50],
    description: 'Two colliding galaxy clusters providing the best evidence for the existence of dark matter.',
    facts: [
      'The hot gas from the collision was slowed by electromagnetic interaction, but dark matter passed straight through.',
      'Provides one of the strongest observational proofs of dark matter.',
      'The cluster collision speed was about 3,000 km/s.',
    ],
  },
  {
    id: 'abell2029', name: 'Abell 2029', type: 'Galaxy Cluster', distanceMly: 1045,
    color: '#ffddaa', position: [120, 35, -65],
    description: 'A massive galaxy cluster dominated by IC 1101, one of the largest known galaxies.',
    facts: [
      'Contains hundreds of galaxies with a total mass equivalent to a quadrillion Suns.',
      'The hot intracluster gas emits strongly in X-rays.',
      'Is about 5 million light years across.',
    ],
  },
  {
    id: 'coma-cluster', name: 'Coma Cluster', type: 'Galaxy Cluster', distanceMly: 321,
    color: '#ffeedd', position: [-62, 22, -28],
    description: 'One of the first galaxy clusters where dark matter was inferred (Fritz Zwicky, 1933).',
    facts: [
      'Contains over 1,000 identified galaxies and thousands more.',
      'Fritz Zwicky first proposed dark matter here — galaxies moved too fast for visible mass alone.',
      'Dominated by two giant elliptical galaxies NGC 4874 and NGC 4889.',
    ],
  },
  {
    id: 'virgo-cluster', name: 'Virgo Cluster', type: 'Galaxy Cluster', distanceMly: 53.8,
    color: '#ffeecc', position: [42, -12, 20],
    description: 'The nearest large galaxy cluster, anchoring the Virgo Supercluster which includes our Local Group.',
    facts: [
      'Contains over 1,300 confirmed member galaxies.',
      'The gravitational pull of the Virgo Cluster is slightly decelerating the expansion of our Local Group.',
      'M87 with its famous black hole image is one of its central galaxies.',
    ],
  },
  {
    id: 'perseus-cluster', name: 'Perseus Cluster', type: 'Galaxy Cluster', distanceMly: 237,
    color: '#aabbff', position: [-48, 18, -22],
    description: 'One of the most massive objects in the known universe and a powerful X-ray emitter.',
    facts: [
      'NASA found "sounds" propagating through the cluster gas — the lowest note ever detected in the universe.',
      'Has a mass of about 660 trillion solar masses.',
      'NGC 1275 at its center is one of the largest galaxies known.',
    ],
  },
  {
    id: 'el-gordo', name: 'El Gordo', type: 'Galaxy Cluster', distanceMly: 7200,
    color: '#ff8866', position: [180, -50, 80],
    description: 'The most massive galaxy cluster known in the distant universe — "The Fat One" in Spanish.',
    facts: [
      'Has a mass of about 2 quadrillion (2 × 10¹⁵) solar masses.',
      'The most massive cluster found at such a large cosmic distance.',
      'It is actually two subclusters colliding at millions of km/h.',
    ],
  },
  {
    id: 'pandoras-cluster', name: "Pandora's Cluster", type: 'Galaxy Cluster', distanceMly: 3500,
    color: '#cc88ff', position: [-90, 30, 45],
    description: 'A galaxy cluster formed by the simultaneous collision of at least four separate galaxy clusters.',
    facts: [
      'Officially known as Abell 2744.',
      'James Webb Space Telescope used it as a gravitational lens to study extremely distant galaxies.',
      'One of the most complex cluster mergers ever studied.',
    ],
  },
  {
    id: 'stephans-quintet', name: "Stephan's Quintet", type: 'Galaxy Group', distanceMly: 282,
    color: '#ddccff', position: [-58, 16, 22],
    description: 'A compact group of five galaxies — four of which are interacting and will eventually merge.',
    facts: [
      'Featured in the opening of "It\'s a Wonderful Life" (1946).',
      'One of the first JWST images released in 2022, revealing unprecedented detail.',
      'The four interacting galaxies are about 290 million light years away; the fifth is a foreground galaxy.',
    ],
  },
];
