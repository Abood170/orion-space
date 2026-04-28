export default function Loading() {
  return (
    <div
      className="min-h-screen bg-[#0a0a0f] flex items-center justify-center"
      style={{ backgroundColor: '#0a0a0f' }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 rounded-full border-2 border-blue-500/30 border-t-blue-500 animate-spin"
          style={{ animationDuration: '0.8s' }}
        />
        <span className="text-white/20 text-xs tracking-widest uppercase">Loading</span>
      </div>
    </div>
  );
}
