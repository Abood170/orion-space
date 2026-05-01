export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#000005' }}
    >
      <div className="relative w-24 h-24 mb-8">
        {/* Outer galaxy ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, #3b82f630 30%, #8b5cf680 60%, #3b82f630 80%, transparent 100%)',
            animation: 'spin 2s linear infinite',
          }}
        />
        {/* Middle ring */}
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'conic-gradient(from 180deg, transparent 0%, #8b5cf640 40%, #ffffff60 70%, transparent 100%)',
            animation: 'spin 3s linear infinite reverse',
          }}
        />
        {/* Inner orbit */}
        <div
          className="absolute inset-5 rounded-full"
          style={{
            border: '1px solid rgba(100,160,255,0.3)',
            animation: 'spin 1.5s linear infinite',
          }}
        />
        {/* Orbiting dot */}
        <div
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: '#aabbff',
            boxShadow: '0 0 6px #aabbff',
            top: '50%', left: '50%',
            transformOrigin: '0 -16px',
            animation: 'spin 1.5s linear infinite',
          }}
        />
        {/* Center glow */}
        <div
          className="absolute w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, #ffaa00 100%)',
            boxShadow: '0 0 16px #ffaa00',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <p className="text-white/55 text-sm font-medium tracking-widest uppercase mb-2">
        Mapping the Observable Universe…
      </p>
      <p className="text-white/25 text-xs tracking-wider">
        Loading 30 galaxies · 15 nebulae · 40 notable stars
      </p>
    </div>
  );
}
