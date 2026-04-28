export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#000005' }}
    >
      <div className="relative w-20 h-20 mb-8">
        {/* Spinning spiral rings */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, #3b82f630 30%, #8b5cf680 60%, #3b82f630 80%, transparent 100%)',
            animation: 'spin 2s linear infinite',
          }}
        />
        <div
          className="absolute inset-2 rounded-full"
          style={{
            background: 'conic-gradient(from 180deg, transparent 0%, #8b5cf640 40%, #ffffff60 70%, transparent 100%)',
            animation: 'spin 3s linear infinite reverse',
          }}
        />
        {/* Center dot */}
        <div
          className="absolute inset-0 m-auto w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, #ffaa00 100%)',
            boxShadow: '0 0 12px #ffaa00',
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-1">
        Mapping the Milky Way…
      </p>
      <p className="text-white/20 text-xs tracking-wider">Loading 80,000 stars</p>
    </div>
  );
}
