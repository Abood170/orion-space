export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0a0a0f]">
      <div className="relative w-16 h-16">
        {/* Central glowing orb */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #3b82f6, #1d4ed8)',
            boxShadow: '0 0 30px #3b82f640, 0 0 60px #3b82f620',
            animation: 'pulse-slow 2s ease-in-out infinite',
          }}
        />
        {/* Orbiting dot */}
        <div
          className="absolute inset-[-14px] rounded-full"
          style={{ animation: 'spin 1.4s linear infinite' }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-400"
            style={{ boxShadow: '0 0 10px #3b82f6, 0 0 20px #3b82f640' }}
          />
        </div>
      </div>
    </div>
  );
}
