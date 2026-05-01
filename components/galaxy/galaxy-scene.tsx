'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { GALAXY_STARS, type GalaxyStar } from '@/lib/galaxy-stars';
import { GALAXIES, NEBULAE, DEEP_SPACE_OBJECTS, type UniverseGalaxy, type UniverseNebula, type DeepSpaceObject } from '@/lib/universe-objects';

export type ZoomLevel = 1 | 2 | 3;

export interface CameraAnim {
  position: [number, number, number];
  lookAt:   [number, number, number];
}

export type SelectedObject =
  | { kind: 'star';    data: GalaxyStar }
  | { kind: 'galaxy';  data: UniverseGalaxy }
  | { kind: 'nebula';  data: UniverseNebula }
  | { kind: 'deep';    data: DeepSpaceObject };

// ─── Galaxy spiral particles ───────────────────────────────────────────────────
function createGalaxy(count: number) {
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const armIndex  = i % 4;
    const t         = (i / count) * Math.PI * 6;
    const radius    = Math.random() * 25 + 1;
    const armAngle  = (armIndex / 4) * Math.PI * 2;
    const spinAngle = t * 0.4;
    const randomX   = (Math.random() - 0.5) * 2 * Math.exp(-radius * 0.05);
    const randomY   = (Math.random() - 0.5) * 0.8;
    const randomZ   = (Math.random() - 0.5) * 2 * Math.exp(-radius * 0.05);
    positions[i*3]   = Math.cos(armAngle + spinAngle) * radius + randomX;
    positions[i*3+1] = randomY;
    positions[i*3+2] = Math.sin(armAngle + spinAngle) * radius + randomZ;
    const d = radius / 25;
    colors[i*3]   = 0.8 + d * 0.2;
    colors[i*3+1] = 0.7 + d * 0.1;
    colors[i*3+2] = Math.min(0.9 + (1 - d), 1);
  }
  return { positions, colors };
}

function GalaxyPoints({ visible }: { visible: boolean }) {
  const ref   = useRef<THREE.Points>(null);
  const count = useMemo(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 30000 : 80000), []);
  const { positions, colors } = useMemo(() => createGalaxy(count), [count]);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.0003;
  });
  if (!visible) return null;
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color"    args={[colors,    3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} sizeAttenuation vertexColors transparent opacity={0.85} />
    </points>
  );
}

// ─── Galactic center glow ─────────────────────────────────────────────────────
function GalacticCenter({ visible }: { visible: boolean }) {
  const coreRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (coreRef.current?.material instanceof THREE.MeshStandardMaterial) {
      coreRef.current.material.emissiveIntensity = 3 + Math.sin(clock.getElapsedTime() * 1.5) * 0.6;
    }
  });
  if (!visible) return null;
  return (
    <group position={[0, 0, -25]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial color="#ffaa00" emissive="#ff6600" emissiveIntensity={3} />
      </mesh>
      {[{ r: 1.2, op: 0.18 }, { r: 1.8, op: 0.10 }, { r: 2.5, op: 0.05 }].map(({ r, op }, i) => (
        <mesh key={i}>
          <sphereGeometry args={[r, 16, 16]} />
          <meshBasicMaterial color="#ffaa44" wireframe transparent opacity={op} />
        </mesh>
      ))}
    </group>
  );
}

// ─── Sun glow + YOU ARE HERE label ────────────────────────────────────────────
function SunEffect({ visible }: { visible: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.scale.setScalar(1 + Math.sin(clock.getElapsedTime() * 1.8) * 0.06);
  });
  if (!visible) return null;
  return (
    <group position={[0, 0, 0]}>
      <pointLight color="#ffee88" intensity={1.5} distance={15} />
      <mesh ref={ref}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#ffee88" emissive="#ffcc44" emissiveIntensity={3} />
      </mesh>
      <Html center position={[0, 0.55, 0]} zIndexRange={[10, 0]}>
        <div style={{
          color: 'rgba(255,238,100,0.65)',
          fontSize: '8px', letterSpacing: '0.16em',
          whiteSpace: 'nowrap', userSelect: 'none', pointerEvents: 'none',
          textShadow: '0 0 8px rgba(255,238,100,0.4)',
        }}>
          ▲ YOU ARE HERE
        </div>
      </Html>
    </group>
  );
}

// ─── Visual size helpers ──────────────────────────────────────────────────────
function getVisualRadius(radiusSolar: number): number {
  if (radiusSolar >= 100000) return 0.9;
  if (radiusSolar >= 500)    return 0.75;
  if (radiusSolar >= 50)     return 0.55;
  if (radiusSolar >= 10)     return 0.40;
  if (radiusSolar >= 2)      return 0.28;
  if (radiusSolar >= 0.5)    return 0.20;
  if (radiusSolar >= 0.1)    return 0.14;
  return 0.10;
}
function getLightIntensity(luminosity: number): number {
  if (luminosity > 100000) return 3.0;
  if (luminosity > 10000)  return 2.0;
  if (luminosity > 1000)   return 1.5;
  if (luminosity > 10)     return 1.0;
  if (luminosity > 1)      return 0.6;
  return 0.3;
}

// ─── Individual notable star ──────────────────────────────────────────────────
function NotableStar({
  star, selected, highlighted, index, onStarClick, visible,
}: {
  star: GalaxyStar; selected: boolean; highlighted: boolean;
  index: number; onStarClick: (s: GalaxyStar) => void; visible: boolean;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const phase    = index * 0.31;
  const isSagA   = star.name === 'Sagittarius A*';
  const isSun    = star.name === 'Sun';

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t     = clock.getElapsedTime();
    const speed = highlighted ? 4.5 : selected ? 3 : 1.4;
    const pulse = 1 + Math.sin(t * speed + phase) * (selected || highlighted ? 0.25 : 0.12);
    meshRef.current.scale.setScalar(pulse);
  });

  if (isSun || !visible) return null;
  const r = isSagA ? 1.4 : getVisualRadius(star.radiusSolar);

  return (
    <mesh
      ref={meshRef} position={star.position}
      onClick={(e) => { e.stopPropagation(); onStarClick(star); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[r, 12, 12]} />
      <meshStandardMaterial
        color={isSagA ? '#000000' : star.color}
        emissive={star.color}
        emissiveIntensity={isSagA ? 0 : (selected || highlighted ? 2.5 : 0.8)}
        transparent={isSagA} opacity={isSagA ? 0.01 : 1}
      />
      {!isSagA && (
        <pointLight color={star.color} intensity={getLightIntensity(star.luminosity)} distance={8} />
      )}
      {(hovered || selected) && (
        <Html center position={[0, r + 0.4, 0]} zIndexRange={[20, 0]}>
          <div style={{
            color: star.color, fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em',
            whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.65)',
            padding: '2px 6px', borderRadius: '4px',
            userSelect: 'none', pointerEvents: 'none',
            border: `1px solid ${star.color}40`,
          }}>
            {star.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ─── Distance line from Sun to selected star ──────────────────────────────────
function DistanceLine({ target }: { target: [number, number, number] }) {
  const progress = useRef(0);
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3));
    return g;
  }, []);
  const mat = useMemo(() => new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35 }), []);
  const obj = useMemo(() => new THREE.Line(geo, mat), [geo, mat]);
  useEffect(() => {
    progress.current = 0;
    return () => { geo.dispose(); mat.dispose(); };
  }, [target, geo, mat]);
  useFrame((_, delta) => {
    progress.current = Math.min(progress.current + delta * 2, 1);
    const attr = geo.attributes.position as THREE.BufferAttribute;
    const arr  = attr.array as Float32Array;
    arr[3] = target[0] * progress.current;
    arr[4] = target[1] * progress.current;
    arr[5] = target[2] * progress.current;
    attr.needsUpdate = true;
  });
  return <primitive object={obj} />;
}

// ─── Radial gradient texture factory ─────────────────────────────────────────
function makeGradientTexture(color: string, size = 128): THREE.Texture {
  const canvas  = document.createElement('canvas');
  canvas.width  = size;
  canvas.height = size;
  const ctx     = canvas.getContext('2d')!;
  const cx      = size / 2;
  const grad    = ctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  grad.addColorStop(0,    color + 'ff');
  grad.addColorStop(0.35, color + 'aa');
  grad.addColorStop(0.7,  color + '44');
  grad.addColorStop(1,    color + '00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  return tex;
}

// ─── Galaxy blob (Level 2 & 3) ────────────────────────────────────────────────
function GalaxyBlob({
  galaxy, selected, onSelect, showLabel,
}: {
  galaxy: UniverseGalaxy;
  selected: boolean;
  onSelect: (g: UniverseGalaxy) => void;
  showLabel: boolean;
}) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);

  const tex = useMemo(() => makeGradientTexture(galaxy.color), [galaxy.color]);

  // Size scaled by diameter with min/max clamps
  const baseSize = Math.max(1.5, Math.min(12, galaxy.diameterKly * 0.03));

  useFrame(({ clock }) => {
    if (!spriteRef.current) return;
    const t     = clock.getElapsedTime();
    const pulse = selected ? 1 + Math.sin(t * 3) * 0.15 : 1 + Math.sin(t * 0.8 + galaxy.id.length) * 0.05;
    spriteRef.current.scale.setScalar(baseSize * pulse);
  });

  // Skip Milky Way — it's rendered as the detailed spiral
  if (galaxy.id === 'milky-way') return null;

  return (
    <group position={galaxy.position}>
      <sprite
        ref={spriteRef}
        onClick={(e) => { e.stopPropagation(); onSelect(galaxy); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <spriteMaterial
          map={tex}
          transparent
          opacity={selected ? 1 : hovered ? 0.9 : 0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          color={galaxy.color}
        />
      </sprite>
      {(hovered || selected || showLabel) && (
        <Html center position={[0, baseSize * 0.7 + 0.5, 0]} zIndexRange={[20, 0]}>
          <div style={{
            color: galaxy.color, fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em',
            whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.7)',
            padding: '2px 7px', borderRadius: '4px',
            userSelect: 'none', pointerEvents: 'none',
            border: `1px solid ${galaxy.color}40`,
          }}>
            {galaxy.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Nebula cloud (Level 1) ────────────────────────────────────────────────────
function NebulaMesh({
  nebula, selected, onSelect,
}: {
  nebula: UniverseNebula;
  selected: boolean;
  onSelect: (n: UniverseNebula) => void;
}) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const [hovered, setHovered] = useState(false);
  const tex = useMemo(() => makeGradientTexture(nebula.color, 64), [nebula.color]);

  useFrame(({ clock }) => {
    if (!spriteRef.current) return;
    const t     = clock.getElapsedTime();
    const pulse = 0.9 + 0.2 * Math.sin(t * 0.6 + nebula.id.length * 0.7);
    spriteRef.current.scale.setScalar((selected ? 1.3 : 1.0) * pulse);
  });

  return (
    <group position={nebula.position}>
      <sprite
        ref={spriteRef}
        onClick={(e) => { e.stopPropagation(); onSelect(nebula); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
      >
        <spriteMaterial
          map={tex} transparent opacity={selected ? 0.85 : hovered ? 0.75 : 0.55}
          depthWrite={false} blending={THREE.AdditiveBlending} color={nebula.color}
        />
      </sprite>
      {(hovered || selected) && (
        <Html center position={[0, 0.8, 0]} zIndexRange={[20, 0]}>
          <div style={{
            color: nebula.color, fontSize: '9px', fontWeight: 600, letterSpacing: '0.08em',
            whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.7)',
            padding: '2px 6px', borderRadius: '4px',
            userSelect: 'none', pointerEvents: 'none',
            border: `1px solid ${nebula.color}40`,
          }}>
            {nebula.name}
          </div>
        </Html>
      )}
    </group>
  );
}

// ─── Deep space object point ───────────────────────────────────────────────────
function DeepSpacePoint({
  obj, selected, onSelect,
}: {
  obj: DeepSpaceObject;
  selected: boolean;
  onSelect: (o: DeepSpaceObject) => void;
}) {
  const meshRef  = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.scale.setScalar(1 + Math.sin(t * 1.2 + obj.id.length) * (selected ? 0.3 : 0.1));
  });

  return (
    <mesh
      ref={meshRef} position={obj.position}
      onClick={(e) => { e.stopPropagation(); onSelect(obj); }}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto'; }}
    >
      <sphereGeometry args={[1.0, 8, 8]} />
      <meshStandardMaterial
        color={obj.color} emissive={obj.color}
        emissiveIntensity={selected ? 2.5 : hovered ? 1.5 : 0.6}
        transparent opacity={0.8}
      />
      {(hovered || selected) && (
        <Html center position={[0, 1.8, 0]} zIndexRange={[20, 0]}>
          <div style={{
            color: obj.color, fontSize: '9px', fontWeight: 600,
            whiteSpace: 'nowrap', background: 'rgba(0,0,0,0.7)',
            padding: '2px 6px', borderRadius: '4px',
            userSelect: 'none', pointerEvents: 'none',
            border: `1px solid ${obj.color}40`,
          }}>
            {obj.name}
          </div>
        </Html>
      )}
    </mesh>
  );
}

// ─── Zoom-level transition flash ─────────────────────────────────────────────
// Pre-allocated vectors to avoid per-frame GC pressure
const _flashDir = new THREE.Vector3();

function ZoomFlash({ zoomLevel }: { zoomLevel: ZoomLevel }) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const matRef    = useRef<THREE.SpriteMaterial>(null);
  const opacity   = useRef(0);
  const prevLevel = useRef(zoomLevel);

  useEffect(() => {
    if (zoomLevel !== prevLevel.current) {
      prevLevel.current = zoomLevel;
      opacity.current   = 0.75;
    }
  }, [zoomLevel]);

  useFrame(({ camera }, delta) => {
    if (opacity.current > 0) {
      opacity.current = Math.max(0, opacity.current - delta * 2.8);
    }
    if (matRef.current) {
      matRef.current.opacity = opacity.current;
    }
    if (spriteRef.current) {
      camera.getWorldDirection(_flashDir);
      spriteRef.current.position
        .copy(camera.position)
        .addScaledVector(_flashDir, 0.5);
    }
  });

  return (
    <sprite ref={spriteRef} scale={[20000, 20000, 1]} renderOrder={999}>
      <spriteMaterial ref={matRef} color="#000000" transparent opacity={0} depthTest={false} depthWrite={false} />
    </sprite>
  );
}

// ─── Camera rig + zoom level detector ─────────────────────────────────────────
function CameraRig({
  cameraAnim,
  onZoomChange,
}: {
  cameraAnim: CameraAnim | null;
  onZoomChange: (level: ZoomLevel) => void;
}) {
  const { camera } = useThree();
  const controlsRef  = useRef<OrbitControlsImpl>(null);
  const targetPos    = useRef(new THREE.Vector3(0, 15, 30));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const animating    = useRef(false);
  const lastLevel    = useRef<ZoomLevel>(1);

  useEffect(() => {
    if (!cameraAnim) return;
    targetPos.current.set(...cameraAnim.position);
    targetLookAt.current.set(...cameraAnim.lookAt);
    animating.current = true;
    if (controlsRef.current) controlsRef.current.enabled = false;
  }, [cameraAnim]);

  useFrame(() => {
    if (animating.current) {
      camera.position.lerp(targetPos.current, 0.04);
      camera.lookAt(targetLookAt.current);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, 0.06);
        controlsRef.current.update();
      }
      if (camera.position.distanceTo(targetPos.current) < 0.4) {
        animating.current = false;
        if (controlsRef.current) { controlsRef.current.enabled = true; controlsRef.current.update(); }
      }
    }

    const dist = camera.position.length();
    const level: ZoomLevel = dist < 50 ? 1 : dist < 200 ? 2 : 3;
    if (level !== lastLevel.current) {
      lastLevel.current = level;
      onZoomChange(level);
    }
  });

  return (
    <OrbitControls
      ref={controlsRef} makeDefault
      enableZoom enablePan enableRotate enableDamping
      dampingFactor={0.05} minDistance={5} maxDistance={600}
    />
  );
}

// ─── Filter flags ─────────────────────────────────────────────────────────────
export interface FilterFlags {
  stars:   boolean;
  galaxies:boolean;
  nebulae: boolean;
  deep:    boolean;
}

// ─── Inner scene ──────────────────────────────────────────────────────────────
interface SceneProps {
  selectedObj:   SelectedObject | null;
  onStarClick:   (s: GalaxyStar)      => void;
  onGalaxyClick: (g: UniverseGalaxy)  => void;
  onNebulaClick: (n: UniverseNebula)  => void;
  onDeepClick:   (o: DeepSpaceObject) => void;
  cameraAnim:    CameraAnim | null;
  searchQuery:   string;
  zoomLevel:     ZoomLevel;
  onZoomChange:  (l: ZoomLevel) => void;
  filters:       FilterFlags;
}

function SceneContents({
  selectedObj, onStarClick, onGalaxyClick, onNebulaClick, onDeepClick,
  cameraAnim, searchQuery, zoomLevel, onZoomChange, filters,
}: SceneProps) {
  const lowerQ     = searchQuery.toLowerCase();
  const showMilkyWay = zoomLevel === 1;
  const showGalaxies = zoomLevel >= 2 && filters.galaxies;
  const showNebulae  = zoomLevel === 1 && filters.nebulae;
  const showDeep     = zoomLevel === 3 && filters.deep;
  const showStars    = zoomLevel === 1 && filters.stars;

  const selectedStar   = selectedObj?.kind === 'star'   ? selectedObj.data : null;
  const selectedGalaxy = selectedObj?.kind === 'galaxy' ? selectedObj.data : null;
  const selectedNebula = selectedObj?.kind === 'nebula' ? selectedObj.data : null;
  const selectedDeep   = selectedObj?.kind === 'deep'   ? selectedObj.data : null;

  return (
    <>
      <ambientLight intensity={0.03} />

      <GalaxyPoints    visible={showMilkyWay} />
      <GalacticCenter  visible={showMilkyWay} />
      <SunEffect       visible={showMilkyWay} />

      {/* Notable stars — Level 1 only */}
      {GALAXY_STARS.map((star, i) => (
        <NotableStar
          key={star.id} star={star} index={i} visible={showStars}
          selected={selectedStar?.id === star.id}
          highlighted={lowerQ.length >= 2 && star.name.toLowerCase().includes(lowerQ)}
          onStarClick={onStarClick}
        />
      ))}

      {/* Nebulae — Level 1 only */}
      {showNebulae && NEBULAE.map((nebula) => (
        <NebulaMesh
          key={nebula.id} nebula={nebula}
          selected={selectedNebula?.id === nebula.id}
          onSelect={onNebulaClick}
        />
      ))}

      {/* Distance line */}
      {selectedStar && selectedStar.name !== 'Sun' && (
        <DistanceLine key={selectedStar.id} target={selectedStar.position} />
      )}

      {/* Galaxy blobs — Level 2 & 3 */}
      {showGalaxies && GALAXIES.map((galaxy) => (
        <GalaxyBlob
          key={galaxy.id} galaxy={galaxy}
          selected={selectedGalaxy?.id === galaxy.id}
          onSelect={onGalaxyClick}
          showLabel={lowerQ.length >= 2 && galaxy.name.toLowerCase().includes(lowerQ)}
        />
      ))}

      {/* Deep space objects — Level 3 */}
      {showDeep && DEEP_SPACE_OBJECTS.map((obj) => (
        <DeepSpacePoint
          key={obj.id} obj={obj}
          selected={selectedDeep?.id === obj.id}
          onSelect={onDeepClick}
        />
      ))}

      <ZoomFlash zoomLevel={zoomLevel} />
      <CameraRig cameraAnim={cameraAnim} onZoomChange={onZoomChange} />
    </>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────
export interface GalaxySceneProps {
  selectedObj:   SelectedObject | null;
  onStarClick:   (s: GalaxyStar)      => void;
  onGalaxyClick: (g: UniverseGalaxy)  => void;
  onNebulaClick: (n: UniverseNebula)  => void;
  onDeepClick:   (o: DeepSpaceObject) => void;
  cameraAnim:    CameraAnim | null;
  searchQuery:   string;
  zoomLevel:     ZoomLevel;
  onZoomChange:  (l: ZoomLevel) => void;
  filters:       FilterFlags;
}

export function GalaxyScene(props: GalaxySceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 15, 30], fov: 60 }}
      style={{ background: '#000005' }}
      gl={{ antialias: true }}
    >
      <SceneContents {...props} />
    </Canvas>
  );
}

// Re-export types for client usage
export type { UniverseGalaxy, UniverseNebula, DeepSpaceObject };
