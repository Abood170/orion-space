export default function Loading() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: '#000008' }}
    >
      <div className="relative w-16 h-16 mb-8">
        {/* 3 orbiting dots */}
        <div className="absolute inset-0" style={{ animation: 'sandboxOrbit1 1.8s linear infinite' }}>
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-400" />
        </div>
        <div className="absolute inset-0" style={{ animation: 'sandboxOrbit2 2.4s linear infinite' }}>
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-400" />
        </div>
        <div className="absolute inset-0" style={{ animation: 'sandboxOrbit3 3.2s linear infinite' }}>
          <span className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400" />
        </div>
        {/* Center sun */}
        <div
          className="absolute inset-0 m-auto w-3 h-3 rounded-full"
          style={{
            background: 'radial-gradient(circle, #ffffff 0%, #ffdd44 100%)',
            boxShadow: '0 0 10px #ffdd44',
            top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          }}
        />
      </div>

      <p className="text-white/50 text-sm font-medium tracking-widest uppercase mb-1">
        Initializing physics engine…
      </p>
      <p className="text-white/20 text-xs tracking-wider">N-body gravity simulation</p>

      <style>{`
        @keyframes sandboxOrbit1 {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes sandboxOrbit2 {
          from { transform: rotate(120deg); }
          to   { transform: rotate(480deg); }
        }
        @keyframes sandboxOrbit3 {
          from { transform: rotate(240deg); }
          to   { transform: rotate(600deg); }
        }
      `}</style>
    </div>
  );
}
