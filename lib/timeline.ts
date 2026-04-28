export type Category = 'satellite' | 'human' | 'rover' | 'telescope' | 'station' | 'private';

export interface TimelineEvent {
  year: number;
  title: string;
  description: string;
  agency: string;
  category: Category;
  color: string;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  satellite: '#f59e0b',
  human:     '#3b82f6',
  rover:     '#ef4444',
  telescope: '#8b5cf6',
  station:   '#10b981',
  private:   '#f97316',
};

export const CATEGORY_LABELS: Record<Category, string> = {
  satellite: 'Satellite',
  human:     'Human',
  rover:     'Rover',
  telescope: 'Telescope',
  station:   'Station',
  private:   'Private',
};

export const timelineEvents: TimelineEvent[] = [
  {
    year: 1957,
    title: 'Sputnik 1 Launched',
    description:
      'The Soviet Union launched Sputnik 1 on October 4, 1957, making it the first artificial satellite to orbit Earth. It transmitted radio signals for 21 days before its batteries died, marking the dawn of the Space Age.',
    agency: 'USSR',
    category: 'satellite',
    color: CATEGORY_COLORS.satellite,
  },
  {
    year: 1961,
    title: 'Yuri Gagarin — First Human in Space',
    description:
      'Soviet cosmonaut Yuri Gagarin became the first human to travel into outer space on April 12, 1961. His Vostok 1 spacecraft completed a single orbit of Earth in 108 minutes, making him an instant global hero.',
    agency: 'USSR',
    category: 'human',
    color: CATEGORY_COLORS.human,
  },
  {
    year: 1965,
    title: 'First Spacewalk',
    description:
      'Soviet cosmonaut Alexei Leonov performed the first extravehicular activity on March 18, 1965, spending 12 minutes outside the Voskhod 2 spacecraft. His suit inflated dangerously in the vacuum, forcing him to partially deflate it to re-enter the airlock.',
    agency: 'USSR',
    category: 'human',
    color: CATEGORY_COLORS.human,
  },
  {
    year: 1969,
    title: 'Apollo 11 — First Moon Landing',
    description:
      'Neil Armstrong and Buzz Aldrin became the first humans to land on the Moon on July 20, 1969, as part of NASA\'s Apollo 11 mission. Armstrong\'s first steps were watched by an estimated 600 million people worldwide.',
    agency: 'NASA',
    category: 'human',
    color: CATEGORY_COLORS.human,
  },
  {
    year: 1971,
    title: 'Salyut 1 — First Space Station',
    description:
      'The Soviet Union launched Salyut 1, the world\'s first space station, on April 19, 1971. It hosted one crew of three cosmonauts for 23 days before re-entering Earth\'s atmosphere that October.',
    agency: 'USSR',
    category: 'station',
    color: CATEGORY_COLORS.station,
  },
  {
    year: 1972,
    title: 'Apollo 17 — Last Moon Landing',
    description:
      'Apollo 17 was the final mission of NASA\'s Apollo program and the last time humans traveled to the Moon, landing on December 11, 1972. Commander Eugene Cernan was the last person to walk on the lunar surface.',
    agency: 'NASA',
    category: 'human',
    color: CATEGORY_COLORS.human,
  },
  {
    year: 1977,
    title: 'Voyager 1 Launched',
    description:
      'NASA launched Voyager 1 on September 5, 1977, on a grand tour of the outer solar system. It became the first spacecraft to enter interstellar space in 2012 and remains the most distant human-made object.',
    agency: 'NASA',
    category: 'satellite',
    color: CATEGORY_COLORS.satellite,
  },
  {
    year: 1981,
    title: 'Space Shuttle First Flight',
    description:
      'NASA\'s Space Shuttle Columbia completed its maiden flight on April 12, 1981, marking the first flight of a reusable crewed spacecraft. The Shuttle program ultimately flew 135 missions over 30 years.',
    agency: 'NASA',
    category: 'human',
    color: CATEGORY_COLORS.human,
  },
  {
    year: 1986,
    title: 'Mir Space Station',
    description:
      'The Soviet Union launched the core module of the Mir space station on February 20, 1986. Mir hosted continuous human occupation for nearly 10 years and became a symbol of international cooperation in space.',
    agency: 'USSR',
    category: 'station',
    color: CATEGORY_COLORS.station,
  },
  {
    year: 1990,
    title: 'Hubble Space Telescope',
    description:
      'The Hubble Space Telescope was deployed from Space Shuttle Discovery on April 25, 1990, becoming the first major optical space telescope. After corrective optics were installed in 1993, it began delivering revolutionary images of the cosmos.',
    agency: 'NASA',
    category: 'telescope',
    color: CATEGORY_COLORS.telescope,
  },
  {
    year: 1997,
    title: 'Mars Pathfinder & Sojourner Rover',
    description:
      'NASA\'s Mars Pathfinder lander touched down on July 4, 1997, deploying the Sojourner rover — the first wheeled vehicle to explore another planet. The mission returned over 2.3 billion bits of data and 16,000 images.',
    agency: 'NASA',
    category: 'rover',
    color: CATEGORY_COLORS.rover,
  },
  {
    year: 1998,
    title: 'ISS Construction Begins',
    description:
      'The first module of the International Space Station, Zarya, launched on November 20, 1998, beginning assembly of the largest structure ever built in space. The ISS has been continuously inhabited since November 2000.',
    agency: 'International',
    category: 'station',
    color: CATEGORY_COLORS.station,
  },
  {
    year: 2001,
    title: 'First Space Tourist',
    description:
      'American businessman Dennis Tito became the first self-funded space tourist on April 28, 2001, paying approximately $20 million to visit the ISS aboard a Russian Soyuz spacecraft. He spent nearly 8 days in orbit.',
    agency: 'Private',
    category: 'private',
    color: CATEGORY_COLORS.private,
  },
  {
    year: 2004,
    title: 'SpaceShipOne — First Private Spaceflight',
    description:
      'SpaceShipOne made history on June 21, 2004, becoming the first privately funded vehicle to achieve spaceflight. It won the $10 million Ansari X Prize by flying to space twice in two weeks.',
    agency: 'Scaled Composites',
    category: 'private',
    color: CATEGORY_COLORS.private,
  },
  {
    year: 2004,
    title: 'Spirit & Opportunity on Mars',
    description:
      'NASA\'s twin rovers Spirit and Opportunity landed on Mars in January 2004, designed for 90-day missions. Opportunity survived for over 14 years, traveling 45 km before a global dust storm ended its mission in 2018.',
    agency: 'NASA',
    category: 'rover',
    color: CATEGORY_COLORS.rover,
  },
  {
    year: 2008,
    title: 'Falcon 1 — First Private Orbital Flight',
    description:
      'SpaceX successfully launched the Falcon 1 rocket on September 28, 2008, making it the first privately developed liquid-fueled rocket to reach orbit. This marked a pivotal turning point in commercial spaceflight.',
    agency: 'SpaceX',
    category: 'private',
    color: CATEGORY_COLORS.private,
  },
  {
    year: 2012,
    title: 'Curiosity Lands on Mars',
    description:
      'NASA\'s Curiosity rover touched down in Gale Crater on August 6, 2012, using an unprecedented sky-crane landing system. The car-sized rover confirmed that Mars once had conditions potentially suitable for microbial life.',
    agency: 'NASA',
    category: 'rover',
    color: CATEGORY_COLORS.rover,
  },
  {
    year: 2015,
    title: 'New Horizons Flies Past Pluto',
    description:
      'NASA\'s New Horizons spacecraft made its closest approach to Pluto on July 14, 2015, after a 9.5-year journey of 5 billion kilometers. It revealed Pluto as a geologically active world with towering mountains of water ice.',
    agency: 'NASA',
    category: 'satellite',
    color: CATEGORY_COLORS.satellite,
  },
  {
    year: 2021,
    title: 'Perseverance & Ingenuity on Mars',
    description:
      'NASA\'s Perseverance rover and Ingenuity helicopter landed in Jezero Crater on February 18, 2021. Ingenuity became the first aircraft to achieve powered flight on another planet, completing over 70 flights.',
    agency: 'NASA',
    category: 'rover',
    color: CATEGORY_COLORS.rover,
  },
  {
    year: 2021,
    title: 'James Webb Space Telescope',
    description:
      'The James Webb Space Telescope launched on December 25, 2021, after decades of development and a $10 billion budget. Its first full-color images, released in July 2022, revealed galaxies formed just 300 million years after the Big Bang.',
    agency: 'NASA / ESA / CSA',
    category: 'telescope',
    color: CATEGORY_COLORS.telescope,
  },
  {
    year: 2023,
    title: 'Chandrayaan-3 Lunar South Pole Landing',
    description:
      'India\'s Chandrayaan-3 mission successfully landed the Vikram lander near the lunar south pole on August 23, 2023. India became the fourth country to soft-land on the Moon and the first to reach the south pole.',
    agency: 'ISRO',
    category: 'rover',
    color: CATEGORY_COLORS.rover,
  },
  {
    year: 2024,
    title: 'Starship First Successful Integrated Flight',
    description:
      'SpaceX\'s Starship completed its first fully successful integrated test flight in October 2024, with the Super Heavy booster caught by robotic "chopstick" arms at the launch site. The mission demonstrated rapid full-stack reusability for the first time.',
    agency: 'SpaceX',
    category: 'private',
    color: CATEGORY_COLORS.private,
  },
];
