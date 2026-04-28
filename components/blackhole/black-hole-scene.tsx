'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import type { BHPlanetDef } from '@/lib/blackhole-planets';

export type CameraPreset = 'front' | 'top' | 'side';

// ─── Accretion disk ────────────────────────────────────────────────────────────
function AccretionDisk({ gravityStrength, growthFactor }: { gravityStrength: number; growthFactor: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.15 * gravityStrength;
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, growthFactor, delta * 1.5));
    }
    if (mat.current) mat.current.emissiveIntensity = Math.min((3 + gravityStrength * 1.5) * growthFactor, 8);
  });

  return (
    <mesh ref={meshRef} rotation={[Math.PI / 2.8, 0, 0]}>
      <torusGeometry args={[1.8, 0.35, 32, 128]} />
      <meshStandardMaterial ref={mat} color="#ff6000" emissive="#ff3000" emissiveIntensity={3} roughness={0.4} metalness={0.6} />
    </mesh>
  );
}

// ─── BH core ──────────────────────────────────────────────────────────────────
function BHCore({ growthFactor }: { growthFactor: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      const t = THREE.MathUtils.lerp(ref.current.scale.x, growthFactor, delta * 1.5);
      ref.current.scale.setScalar(t);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshBasicMaterial color="#000000" />
    </mesh>
  );
}

// ─── Lensing rings ─────────────────────────────────────────────────────────────
const LENS_RINGS = [
  { radius: 1.45, tube: 0.012, rotation: [0, 0, 0] as [number,number,number],             color: '#ffffff' },
  { radius: 1.55, tube: 0.008, rotation: [Math.PI / 8, 0, 0] as [number,number,number],   color: '#aaccff' },
  { radius: 1.62, tube: 0.006, rotation: [-Math.PI / 10, 0, 0] as [number,number,number], color: '#ffddaa' },
  { radius: 1.68, tube: 0.005, rotation: [0, Math.PI / 6, 0] as [number,number,number],   color: '#ffffff' },
  { radius: 1.38, tube: 0.009, rotation: [Math.PI / 5, 0, 0] as [number,number,number],   color: '#cc99ff' },
];
function LensingRings() {
  return (
    <>
      {LENS_RINGS.map((r, i) => (
        <mesh key={i} rotation={r.rotation}>
          <torusGeometry args={[r.radius, r.tube, 16, 128]} />
          <meshBasicMaterial color={r.color} transparent opacity={0.6} />
        </mesh>
      ))}
    </>
  );
}

// ─── Particle jets ─────────────────────────────────────────────────────────────
function Jets({ gravityStrength }: { gravityStrength: number }) {
  const COUNT = 200;
  const topRef = useRef<THREE.Points>(null);
  const botRef = useRef<THREE.Points>(null);
  const { topPos, botPos } = useMemo(() => {
    const topPos = new Float32Array(COUNT * 3);
    const botPos = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const s = 0.15;
      topPos[i*3] = (Math.random()-0.5)*s; topPos[i*3+1] = 2+Math.random()*6; topPos[i*3+2] = (Math.random()-0.5)*s;
      botPos[i*3] = (Math.random()-0.5)*s; botPos[i*3+1] = -(2+Math.random()*6); botPos[i*3+2] = (Math.random()-0.5)*s;
    }
    return { topPos, botPos };
  }, []);
  useFrame((_, delta) => {
    const speed = 0.6 * gravityStrength * delta;
    const pairs: [React.RefObject<THREE.Points | null>, number][] = [[topRef, 1], [botRef, -1]];
    for (const [ref, sign] of pairs) {
      if (!ref.current) continue;
      const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
      const arr = pos.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        arr[i*3+1] += sign * speed;
        if (sign === 1  && arr[i*3+1] > 8)  arr[i*3+1] = 2;
        if (sign === -1 && arr[i*3+1] < -8) arr[i*3+1] = -2;
      }
      pos.needsUpdate = true;
    }
  });
  return (
    <>
      <points ref={topRef}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[topPos, 3]} /></bufferGeometry>
        <pointsMaterial color="#88aaff" size={0.04} transparent opacity={0.7} />
      </points>
      <points ref={botRef}>
        <bufferGeometry><bufferAttribute attach="attributes-position" args={[botPos, 3]} /></bufferGeometry>
        <pointsMaterial color="#88aaff" size={0.04} transparent opacity={0.7} />
      </points>
    </>
  );
}

// ─── Background stars ──────────────────────────────────────────────────────────
function Stars() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
      const r = 15 + Math.random() * 30;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i*3] = r*Math.sin(phi)*Math.cos(theta); arr[i*3+1] = r*Math.sin(phi)*Math.sin(theta); arr[i*3+2] = r*Math.cos(phi);
    }
    return arr;
  }, []);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y += delta * 0.008; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial color="#ffffff" size={0.07} transparent opacity={0.8} />
    </points>
  );
}

// ─── Orbiting matter ───────────────────────────────────────────────────────────
const ORBITERS = [
  { r:2.6, speed:1.2,  phase:0,            tilt:0.2  },
  { r:2.9, speed:0.9,  phase:Math.PI/3,    tilt:-0.3 },
  { r:3.2, speed:0.7,  phase:Math.PI,      tilt:0.15 },
  { r:3.5, speed:0.55, phase:Math.PI*1.4,  tilt:-0.1 },
  { r:3.8, speed:0.42, phase:Math.PI*0.7,  tilt:0.4  },
  { r:4.0, speed:0.35, phase:Math.PI*1.7,  tilt:-0.2 },
  { r:2.7, speed:1.05, phase:Math.PI*0.5,  tilt:0.5  },
  { r:3.35,speed:0.62, phase:Math.PI*1.2,  tilt:-0.4 },
];
function OrbiterMesh({ r, speed, phase, tilt, gravityStrength }: { r:number; speed:number; phase:number; tilt:number; gravityStrength:number }) {
  const ref = useRef<THREE.Mesh>(null);
  const angle = useRef(phase);
  useFrame((_, delta) => {
    angle.current += delta * speed * gravityStrength;
    if (ref.current) {
      ref.current.position.x = Math.cos(angle.current) * r;
      ref.current.position.y = Math.sin(angle.current) * r * Math.sin(tilt);
      ref.current.position.z = Math.sin(angle.current) * r * Math.cos(tilt);
    }
  });
  return <mesh ref={ref}><sphereGeometry args={[0.05,8,8]} /><meshStandardMaterial color="#ff8844" emissive="#ff4400" emissiveIntensity={2} /></mesh>;
}
function OrbiterField({ gravityStrength }: { gravityStrength: number }) {
  return <>{ORBITERS.map((o, i) => <OrbiterMesh key={i} {...o} gravityStrength={gravityStrength} />)}</>;
}

// ─── Spawned planet ────────────────────────────────────────────────────────────
const DEBRIS = 35;

function SpawnedPlanet({
  def, gravityStrength, onStageChange, onDestroyed,
}: {
  def: BHPlanetDef;
  gravityStrength: number;
  onStageChange: (s: string) => void;
  onDestroyed: () => void;
}) {
  const groupRef   = useRef<THREE.Group>(null);
  const bodyRef    = useRef<THREE.Mesh>(null);
  const atmRef     = useRef<THREE.Mesh>(null);
  const ringsRef   = useRef<THREE.Mesh>(null);
  const debrisRef  = useRef<THREE.Points>(null);

  const pos   = useRef(new THREE.Vector3(5, 0.2, 0));
  const vel   = useRef(new THREE.Vector3(-0.45, 0, 0));
  const stage = useRef('approach');
  const sx    = useRef(1);   // stretch X
  const syz   = useRef(1);   // scale Y/Z
  const destroyed = useRef(false);
  const debrisInit = useRef(false);

  // Pre-allocated tmp objects (no per-frame alloc)
  const tmpDir = useRef(new THREE.Vector3());
  const tmpQ   = useRef(new THREE.Quaternion());
  const xAxis  = useRef(new THREE.Vector3(1, 0, 0));

  const { debrisPos, debrisVels } = useMemo(() => {
    const debrisPos  = new Float32Array(DEBRIS * 3);
    const debrisVels = new Float32Array(DEBRIS * 3);
    return { debrisPos, debrisVels };
  }, []);

  const onStageRef   = useRef(onStageChange);
  const onDestroyRef = useRef(onDestroyed);
  useEffect(() => { onStageRef.current   = onStageChange; }, [onStageChange]);
  useEffect(() => { onDestroyRef.current = onDestroyed;   }, [onDestroyed]);

  const isInstant = def.specialEffect === 'instant';

  useFrame((_, delta) => {
    if (destroyed.current) return;

    const dist = pos.current.length();
    tmpDir.current.copy(pos.current).negate().normalize();

    // Gravitational acceleration
    const acc = gravityStrength * 0.55 / Math.max(dist * dist, 0.18);
    vel.current.addScaledVector(tmpDir.current, acc * delta);
    pos.current.addScaledVector(vel.current, delta);

    if (groupRef.current) groupRef.current.position.copy(pos.current);

    // Stage transitions
    const raw = isInstant
      ? (dist > 2.5 ? 'approach' : 'absorbed')
      : (dist > 3.5 ? 'approach' : dist > 2.5 ? 'tidal' : dist > 1.5 ? 'spaghet' : 'absorbed');

    if (raw !== stage.current) {
      stage.current = raw;
      onStageRef.current(raw);
    }

    if (!bodyRef.current) return;

    if (raw === 'approach') {
      bodyRef.current.rotation.y += delta * 0.6;
      if (ringsRef.current) ringsRef.current.rotation.z += delta * 0.3;
    }

    if (raw === 'tidal' || raw === 'spaghet') {
      const heavy = raw === 'spaghet';
      sx.current  = Math.min(sx.current  * (1 + delta * (heavy ? 1.5 : 0.35)), heavy ? 5.5 : 2.5);
      syz.current = Math.max(syz.current * (1 - delta * (heavy ? 1.1 : 0.25)), 0.18);

      // Orient stretch axis toward BH
      tmpQ.current.setFromUnitVectors(xAxis.current, tmpDir.current);
      bodyRef.current.quaternion.copy(tmpQ.current);
      bodyRef.current.scale.set(sx.current, syz.current, syz.current);

      // Tidal heating: shift color toward orange/red
      if (bodyRef.current.material instanceof THREE.MeshStandardMaterial) {
        const heat = heavy ? 1 : Math.max(0, (3.5 - dist));
        bodyRef.current.material.emissive.setRGB(heat * 0.9, heat * 0.25, 0);
        bodyRef.current.material.emissiveIntensity = heat * 2.5;
      }

      // Earth atmosphere: expand + fade
      if (atmRef.current && def.hasAtmosphere) {
        const p = Math.max(0, (3.5 - dist) / 1.5);
        atmRef.current.scale.setScalar(1 + p * 0.6);
        if (atmRef.current.material instanceof THREE.MeshBasicMaterial) {
          atmRef.current.material.opacity = Math.max(0, 0.3 - p * 0.3);
        }
      }

      // Saturn rings: spin faster and shrink toward BH
      if (ringsRef.current && def.hasRings) {
        const p = Math.max(0, (3.5 - dist));
        ringsRef.current.rotation.z += delta * (0.3 + p * 2);
        const rScale = Math.max(1 - p * 0.4, 0.2);
        ringsRef.current.scale.setScalar(rScale);
      }

      // Init debris positions once on tidal entry
      if (!debrisInit.current) {
        for (let i = 0; i < DEBRIS; i++) {
          debrisPos[i*3]   = pos.current.x + (Math.random()-0.5)*0.4;
          debrisPos[i*3+1] = pos.current.y + (Math.random()-0.5)*0.4;
          debrisPos[i*3+2] = pos.current.z + (Math.random()-0.5)*0.4;
          debrisVels[i*3]   = (Math.random()-0.5)*0.04;
          debrisVels[i*3+1] = (Math.random()-0.5)*0.04;
          debrisVels[i*3+2] = (Math.random()-0.5)*0.04;
        }
        debrisInit.current = true;
      }

      // Animate debris
      if (debrisRef.current) {
        const attr = debrisRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const arr  = attr.array as Float32Array;
        for (let i = 0; i < DEBRIS; i++) {
          const dx = arr[i*3], dy = arr[i*3+1], dz = arr[i*3+2];
          const dl = Math.sqrt(dx*dx + dy*dy + dz*dz);
          const dacc = gravityStrength * 0.3 / Math.max(dl*dl, 0.1);
          debrisVels[i*3]   += (-dx/dl) * dacc * delta;
          debrisVels[i*3+1] += (-dy/dl) * dacc * delta;
          debrisVels[i*3+2] += (-dz/dl) * dacc * delta;
          arr[i*3]   += debrisVels[i*3]   * delta;
          arr[i*3+1] += debrisVels[i*3+1] * delta;
          arr[i*3+2] += debrisVels[i*3+2] * delta;
          // Respawn debris that fell into BH
          if (dl < 0.8) {
            arr[i*3]   = pos.current.x + (Math.random()-0.5)*0.5;
            arr[i*3+1] = pos.current.y + (Math.random()-0.5)*0.5;
            arr[i*3+2] = pos.current.z + (Math.random()-0.5)*0.5;
            debrisVels[i*3] = debrisVels[i*3+1] = debrisVels[i*3+2] = 0;
          }
        }
        attr.needsUpdate = true;
      }
    }

    if (raw === 'absorbed' && !destroyed.current) {
      destroyed.current = true;
      onDestroyRef.current();
    }
  });

  return (
    <group ref={groupRef} position={[5, 0.2, 0]}>
      <mesh ref={bodyRef}>
        <sphereGeometry args={[def.radius, 20, 20]} />
        <meshStandardMaterial
          color={def.color}
          emissive={def.emissive ?? '#000000'}
          emissiveIntensity={def.emissiveIntensity ?? 0}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>

      {def.hasAtmosphere && (
        <mesh ref={atmRef}>
          <sphereGeometry args={[def.radius * 1.18, 16, 16]} />
          <meshBasicMaterial color="#4488ff" transparent opacity={0.28} side={THREE.FrontSide} depthWrite={false} />
        </mesh>
      )}

      {def.hasRings && (
        <mesh ref={ringsRef} rotation={[Math.PI / 2.3, 0, 0]}>
          <torusGeometry args={[def.radius * 1.9, def.radius * 0.22, 8, 64]} />
          <meshBasicMaterial color="#e4d191" transparent opacity={0.65} />
        </mesh>
      )}

      <points ref={debrisRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[debrisPos, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#ff8833" size={0.035} transparent opacity={0.75} />
      </points>
    </group>
  );
}

// ─── Explosion burst ───────────────────────────────────────────────────────────
const BURST_COUNT = 320;
function ExplosionBurst({ onComplete }: { onComplete: () => void }) {
  const ref  = useRef<THREE.Points>(null);
  const t    = useRef(0);
  const done = useRef(false);
  const DURATION = 2;

  const { positions, velocities, colors } = useMemo(() => {
    const positions  = new Float32Array(BURST_COUNT * 3);
    const velocities = new Float32Array(BURST_COUNT * 3);
    const colors     = new Float32Array(BURST_COUNT * 3);
    const palette = [[1,0.5,0.1],[1,0.2,0.05],[1,1,1],[1,0.9,0.2],[1,0.65,0]];
    for (let i = 0; i < BURST_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2*Math.random()-1);
      const spd   = 0.8 + Math.random() * 4.5;
      velocities[i*3]   = spd * Math.sin(phi) * Math.cos(theta);
      velocities[i*3+1] = spd * Math.sin(phi) * Math.sin(theta);
      velocities[i*3+2] = spd * Math.cos(phi);
      const c = palette[Math.floor(Math.random()*palette.length)];
      colors[i*3] = c[0]; colors[i*3+1] = c[1]; colors[i*3+2] = c[2];
    }
    return { positions, velocities, colors };
  }, []);

  useFrame((_, delta) => {
    if (done.current || !ref.current) return;
    t.current += delta;
    if (t.current > DURATION) { done.current = true; onComplete(); return; }

    const attr = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;
    for (let i = 0; i < BURST_COUNT; i++) {
      arr[i*3]   += velocities[i*3]   * delta;
      arr[i*3+1] += velocities[i*3+1] * delta;
      arr[i*3+2] += velocities[i*3+2] * delta;
    }
    attr.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 1 - t.current / DURATION;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors, 3]}    />
      </bufferGeometry>
      <pointsMaterial size={0.1} vertexColors transparent opacity={1} depthWrite={false} />
    </points>
  );
}

// ─── Camera rig (spaghettification + presets + OrbitControls) ─────────────────
const PRESET_POS: Record<CameraPreset, THREE.Vector3> = {
  front: new THREE.Vector3(0, 0, 8),
  top:   new THREE.Vector3(0, 8, 1),
  side:  new THREE.Vector3(8, 2, 0),
};

function CameraRig({
  spaghettify,
  cameraPreset,
  cameraShake,
  onEventHorizon,
}: {
  spaghettify:    boolean;
  cameraPreset:   CameraPreset | null;
  cameraShake:    boolean;
  onEventHorizon: () => void;
}) {
  const { camera } = useThree();
  const controlsRef   = useRef<OrbitControlsImpl>(null);
  const spaghP        = useRef(0);
  const spaghNotified = useRef(false);
  const presetTarget  = useRef(new THREE.Vector3(0, 0, 8));
  const animPreset    = useRef(false);

  useEffect(() => {
    if (!spaghettify) { spaghP.current = 0; spaghNotified.current = false; }
  }, [spaghettify]);

  useEffect(() => {
    if (!cameraPreset) return;
    presetTarget.current.copy(PRESET_POS[cameraPreset]);
    animPreset.current = true;
  }, [cameraPreset]);

  useFrame((_, delta) => {
    const isManual = spaghettify || animPreset.current;
    if (controlsRef.current) controlsRef.current.enabled = !isManual;

    if (spaghettify) {
      spaghP.current = Math.min(spaghP.current + delta / 2, 1);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3.5, spaghP.current * 0.05);
      if (spaghP.current > 0.1) {
        const shake = (1 - spaghP.current) * 0.04 * spaghP.current * 8;
        camera.position.x += (Math.random() - 0.5) * shake;
        camera.position.y += (Math.random() - 0.5) * shake;
      }
      if (spaghP.current >= 1 && !spaghNotified.current) {
        spaghNotified.current = true;
        onEventHorizon();
      }
      return;
    }

    if (!animPreset.current) {
      // Gently return z to default when not animating anything
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 8, delta * 1.5);
    }

    if (animPreset.current) {
      camera.position.lerp(presetTarget.current, 0.07);
      camera.lookAt(0, 0, 0);
      if (camera.position.distanceTo(presetTarget.current) < 0.25) {
        animPreset.current = false;
        if (controlsRef.current) {
          controlsRef.current.target.set(0, 0, 0);
          controlsRef.current.update();
        }
      }
    }

    if (cameraShake && !animPreset.current) {
      camera.position.x += (Math.random() - 0.5) * 0.04;
      camera.position.y += (Math.random() - 0.5) * 0.04;
    }
  });

  return <OrbitControls ref={controlsRef} makeDefault enableDamping dampingFactor={0.06} />;
}

// ─── Scene ─────────────────────────────────────────────────────────────────────
interface SceneProps {
  gravityStrength: number;
  spaghettify:     boolean;
  onEventHorizon:  () => void;
  spawnedPlanet:   { def: BHPlanetDef } | null;
  onPlanetStageChange: (s: string) => void;
  onPlanetDestroyed:   () => void;
  showExplosion:   boolean;
  onExplosionDone: () => void;
  cameraPreset:    CameraPreset | null;
  cameraShake:     boolean;
  growthFactor:    number;
}

function Scene(props: SceneProps) {
  const {
    gravityStrength, spaghettify, onEventHorizon,
    spawnedPlanet, onPlanetStageChange, onPlanetDestroyed,
    showExplosion, onExplosionDone,
    cameraPreset, cameraShake, growthFactor,
  } = props;

  return (
    <>
      <ambientLight intensity={0.05} />
      <pointLight position={[0,0,0]} color="#ff6000" intensity={gravityStrength * 4 * growthFactor} distance={14} />

      <BHCore growthFactor={growthFactor} />
      <LensingRings />
      <AccretionDisk gravityStrength={gravityStrength} growthFactor={growthFactor} />
      <Jets gravityStrength={gravityStrength} />
      <OrbiterField gravityStrength={gravityStrength} />
      <Stars />

      {spawnedPlanet && (
        <SpawnedPlanet
          def={spawnedPlanet.def}
          gravityStrength={gravityStrength}
          onStageChange={onPlanetStageChange}
          onDestroyed={onPlanetDestroyed}
        />
      )}

      {showExplosion && <ExplosionBurst onComplete={onExplosionDone} />}

      <CameraRig
        spaghettify={spaghettify}
        cameraPreset={cameraPreset}
        cameraShake={cameraShake}
        onEventHorizon={onEventHorizon}
      />
    </>
  );
}

// ─── Export ────────────────────────────────────────────────────────────────────
export interface BlackHoleSceneProps {
  gravityStrength:     number;
  spaghettify:         boolean;
  onEventHorizon:      () => void;
  spawnedPlanet:       { def: BHPlanetDef } | null;
  onPlanetStageChange: (s: string) => void;
  onPlanetDestroyed:   () => void;
  showExplosion:       boolean;
  onExplosionDone:     () => void;
  cameraPreset:        CameraPreset | null;
  cameraShake:         boolean;
  growthFactor:        number;
}

export function BlackHoleScene(props: BlackHoleSceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 60 }} style={{ background: '#000000' }} gl={{ antialias: true }}>
      <Scene {...props} />
    </Canvas>
  );
}
