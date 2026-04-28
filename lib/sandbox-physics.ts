export interface Body {
  id: string;
  name: string;
  mass: number;
  radius: number;
  color: string;
  position: [number, number, number];
  velocity: [number, number, number];
  trail: [number, number, number][];
  isStatic: boolean;
  type: 'star' | 'planet' | 'moon' | 'blackhole';
}

export interface SpawnTypeDef {
  id: string;
  label: string;
  icon: string;
  bodyType: Body['type'];
  mass: number;
  radius: number;
  color: string;
}

export const SPAWN_TYPES: SpawnTypeDef[] = [
  { id: 'star',      label: 'Star',        icon: '☀️', bodyType: 'star',      mass: 100,  radius: 1.5,  color: '#ffdd44' },
  { id: 'planet',    label: 'Planet',      icon: '🌍', bodyType: 'planet',    mass: 1,    radius: 0.4,  color: '#3b82f6' },
  { id: 'moon',      label: 'Moon',        icon: '🪨', bodyType: 'moon',      mass: 0.1,  radius: 0.2,  color: '#aaaaaa' },
  { id: 'blackhole', label: 'Black Hole',  icon: '🕳️', bodyType: 'blackhole', mass: 500,  radius: 0.8,  color: '#110022' },
  { id: 'asteroid',  label: 'Asteroid',    icon: '☄️', bodyType: 'planet',    mass: 0.01, radius: 0.12, color: '#886644' },
  { id: 'neutron',   label: 'Neutron Star',icon: '💫', bodyType: 'star',      mass: 200,  radius: 0.3,  color: '#aaffff' },
];

let bodyCounter = 0;
export function createBody(
  spawnTypeId: string,
  position: [number, number, number],
  velocity: [number, number, number],
): Body {
  const def = SPAWN_TYPES.find((t) => t.id === spawnTypeId) ?? SPAWN_TYPES[1];
  bodyCounter++;
  return {
    id: `body_${Date.now()}_${bodyCounter}`,
    name: `${def.label} ${bodyCounter}`,
    mass: def.mass,
    radius: def.radius,
    color: def.color,
    position,
    velocity,
    trail: [],
    isStatic: false,
    type: def.bodyType,
  };
}

// G_CONST = G so that solar system preset (G=1) gives stable ~14s Earth orbit
export function updatePhysics(bodies: Body[], dt: number, G: number): Body[] {
  return bodies.map((body) => {
    if (body.isStatic) {
      const newTrail: [number, number, number][] = [...body.trail.slice(-79), [...body.position] as [number, number, number]];
      return { ...body, trail: newTrail };
    }

    let fx = 0, fy = 0, fz = 0;

    for (const other of bodies) {
      if (other.id === body.id) continue;
      const dx = other.position[0] - body.position[0];
      const dy = other.position[1] - body.position[1];
      const dz = other.position[2] - body.position[2];
      const distSq = dx * dx + dy * dy + dz * dz;
      const dist = Math.sqrt(distSq);
      if (dist < 0.1) continue;
      const force = G * body.mass * other.mass / distSq;
      const invDist = 1 / dist;
      fx += force * dx * invDist;
      fy += force * dy * invDist;
      fz += force * dz * invDist;
    }

    const invMass = 1 / body.mass;
    const nvx = body.velocity[0] + fx * invMass * dt;
    const nvy = body.velocity[1] + fy * invMass * dt;
    const nvz = body.velocity[2] + fz * invMass * dt;

    const nx = body.position[0] + nvx * dt;
    const ny = body.position[1] + nvy * dt;
    const nz = body.position[2] + nvz * dt;

    const newTrail: [number, number, number][] = [...body.trail.slice(-79), [...body.position] as [number, number, number]];

    return {
      ...body,
      velocity: [nvx, nvy, nvz],
      position: [nx, ny, nz],
      trail: newTrail,
    };
  });
}

export interface CollisionResult {
  survived: Body[];
  collisions: Array<{ a: string; b: string; mergedId: string }>;
}

export function checkCollisions(bodies: Body[]): CollisionResult {
  const toRemove = new Set<string>();
  const mergedUpdates = new Map<string, Body>();
  const collisions: CollisionResult['collisions'] = [];

  for (let i = 0; i < bodies.length; i++) {
    for (let j = i + 1; j < bodies.length; j++) {
      const a = bodies[i];
      const b = bodies[j];
      if (toRemove.has(a.id) || toRemove.has(b.id)) continue;

      const dx = a.position[0] - b.position[0];
      const dy = a.position[1] - b.position[1];
      const dz = a.position[2] - b.position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      if (dist < (a.radius + b.radius) * 0.8) {
        const bigger  = a.mass >= b.mass ? a : b;
        const smaller = a.mass >= b.mass ? b : a;
        const total   = a.mass + b.mass;

        const nvx = (a.mass * a.velocity[0] + b.mass * b.velocity[0]) / total;
        const nvy = (a.mass * a.velocity[1] + b.mass * b.velocity[1]) / total;
        const nvz = (a.mass * a.velocity[2] + b.mass * b.velocity[2]) / total;

        const merged: Body = {
          ...bigger,
          mass:     total,
          radius:   bigger.radius * Math.cbrt(total / bigger.mass),
          velocity: [nvx, nvy, nvz],
        };

        mergedUpdates.set(bigger.id, merged);
        toRemove.add(smaller.id);
        collisions.push({ a: a.id, b: b.id, mergedId: bigger.id });
      }
    }
  }

  const survived = bodies
    .filter((b) => !toRemove.has(b.id))
    .map((b) => mergedUpdates.get(b.id) ?? b);

  return { survived, collisions };
}

// ─── Presets ──────────────────────────────────────────────────────────────────
function b(id: string, name: string, type: Body['type'], mass: number, radius: number, color: string,
           px: number, py: number, pz: number, vx: number, vy: number, vz: number, isStatic = false): Body {
  return { id, name, type, mass, radius, color, position: [px, py, pz], velocity: [vx, vy, vz], trail: [], isStatic };
}

export function generateSolarSystem(): Body[] {
  return [
    b('sun',     'Sun',     'star',   100,  1.5,  '#ffdd44',  0,  0, 0,  0,    0,    0),
    b('mercury', 'Mercury', 'planet', 0.05, 0.15, '#b5b5b5',  4,  0, 0,  0,    5.0,  0),
    b('venus',   'Venus',   'planet', 0.8,  0.3,  '#e8cda0',  6,  0, 0,  0,    4.1,  0),
    b('earth',   'Earth',   'planet', 1.0,  0.35, '#3b82f6',  8,  0, 0,  0,    3.5,  0),
    b('mars',    'Mars',    'planet', 0.1,  0.25, '#c1440e',  11, 0, 0,  0,    2.9,  0),
  ];
}

export function generateBinaryStars(): Body[] {
  return [
    b('starA', 'Star Alpha', 'star', 80, 1.2, '#ffaa44', -5, 0, 0, 0,  2.5, 0),
    b('starB', 'Star Beta',  'star', 80, 1.2, '#aaddff',  5, 0, 0, 0, -2.5, 0),
  ];
}

export function generateChaos(): Body[] {
  const rng = (min: number, max: number) => min + Math.random() * (max - min);
  const colors = ['#ff6644', '#44aaff', '#ffdd44', '#44ff88', '#ff44aa', '#aaffff', '#ff8800', '#8844ff'];
  return Array.from({ length: 8 }, (_, i) => {
    const mass = rng(0.5, 20);
    return b(
      `chaos_${i}`, `Body ${i + 1}`, 'planet',
      mass, 0.15 + Math.cbrt(mass) * 0.12, colors[i],
      rng(-14, 14), rng(-6, 6), 0,
      rng(-2, 2), rng(-2, 2), 0,
    );
  });
}

export function generateFigure8(): Body[] {
  // Classic Chenciner-Montgomery figure-8 (G=1, m=1 units — scale * 8 for visibility)
  const s = 8;
  const vs = 0.125;
  return [
    b('f8_a', 'Body A', 'planet', 1, 0.35, '#3b82f6', -0.97 * s, 0.243 * s, 0,  0.466 * vs,  0.433 * vs, 0),
    b('f8_b', 'Body B', 'planet', 1, 0.35, '#f59e0b',  0.97 * s,-0.243 * s, 0,  0.466 * vs,  0.433 * vs, 0),
    b('f8_c', 'Body C', 'planet', 1, 0.35, '#10b981',  0,        0,         0, -0.932 * vs, -0.866 * vs, 0),
  ];
}

export const PRESETS = [
  { id: 'solar',  label: 'Solar System', icon: '☀️', generate: generateSolarSystem },
  { id: 'binary', label: 'Binary Stars', icon: '⭐', generate: generateBinaryStars },
  { id: 'chaos',  label: 'Chaos',        icon: '🌀', generate: generateChaos       },
  { id: 'figure8',label: 'Figure-8',     icon: '♾️', generate: generateFigure8      },
] as const;
