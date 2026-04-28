import { GlowingButton } from '@/components/ui/glowing-button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div
          className="w-24 h-24 rounded-full mx-auto mb-8 opacity-40"
          style={{
            background: 'radial-gradient(circle at 32% 30%, #3b82f6, #1e1b4b)',
            boxShadow: '0 0 60px #3b82f630',
          }}
        />
        <p className="text-blue-400 text-xs font-semibold tracking-[0.25em] uppercase mb-4">
          404
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4">Lost in Space</h1>
        <p className="text-white/45 text-lg mb-10">
          This part of the universe does not exist — yet.
        </p>
        <GlowingButton href="/" variant="primary">
          Return to Solar System
        </GlowingButton>
      </div>
    </div>
  );
}
