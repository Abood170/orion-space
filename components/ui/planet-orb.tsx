import { cn } from '@/lib/utils';

interface PlanetOrbProps {
  color: string;
  secondaryColor: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
}

const sizeMap = {
  sm: 40,
  md: 72,
  lg: 128,
  xl: 220,
};

export function PlanetOrb({
  color,
  secondaryColor,
  name,
  size = 'md',
  animate = false,
  className,
}: PlanetOrbProps) {
  const px = sizeMap[size];
  const glowSize = Math.round(px * 0.6);
  const glowOuter = Math.round(px * 1.1);

  return (
    <div
      className={cn('rounded-full flex-shrink-0', animate && 'animate-spin-slow', className)}
      role="img"
      aria-label={`${name} planet`}
      style={{
        width: px,
        height: px,
        background: `radial-gradient(circle at 32% 30%, ${color}ee, ${color}99 40%, ${secondaryColor}dd)`,
        boxShadow: `0 0 ${glowSize}px ${color}55, 0 0 ${glowOuter}px ${color}22`,
      }}
    />
  );
}
