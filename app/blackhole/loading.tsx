export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#000000' }}
    >
      <div className="relative w-24 h-24 mb-8">
        {/* Expanding rings */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-white/20"
            style={{
              animation: `expandRing 2s ease-out ${i * 0.6}s infinite`,
            }}
          />
        ))}
        {/* Core */}
        <div
          className="absolute inset-1/4 rounded-full"
          style={{
            background: 'radial-gradient(circle, #1a0a00 0%, #000 100%)',
            boxShadow: '0 0 20px #ff600020, 0 0 40px #ff300010',
          }}
        />
      </div>
      <p
        className="text-white/30 text-xs tracking-[0.3em] uppercase"
        style={{ animation: 'pulse-slow 2s ease-in-out infinite' }}
      >
        Approaching the event horizon…
      </p>

      <style>{`
        @keyframes expandRing {
          0%   { transform: scale(0.3); opacity: 0.6; }
          100% { transform: scale(2.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
