export default function PlanetLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #3b82f6dd, #3b82f699 40%, #1d4ed8cc)',
              boxShadow: '0 0 40px #3b82f630, 0 0 80px #3b82f615',
              animation: 'pulse-slow 2s ease-in-out infinite',
            }}
          />
          <div
            className="absolute inset-[-14px] rounded-full"
            style={{ animation: 'spin 1.6s linear infinite' }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-blue-400"
              style={{ boxShadow: '0 0 8px #3b82f6' }}
            />
          </div>
        </div>
        <p className="text-white/35 text-xs tracking-[0.25em] uppercase animate-pulse">
          Loading planet data…
        </p>
      </div>
    </div>
  );
}
