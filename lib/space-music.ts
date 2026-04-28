export class SpaceMusicPlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isPlaying = false;
  private isMuted = false;
  private volume = 0.12;
  private pulseTimeout: ReturnType<typeof setTimeout> | null = null;
  private fadeTimeout: ReturnType<typeof setTimeout> | null = null;

  init() {
    if (typeof window === 'undefined' || this.ctx) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0;
    this.masterGain.connect(this.ctx.destination);
  }

  resume() {
    this.ctx?.resume();
  }

  // ── 1. Home — calm, majestic ─────────────────────────────────────────────────
  playHome() {
    this.stopAll();
    if (!this.ctx || !this.masterGain) return;
    const notes = [130.81, 164.81, 196.00, 220.00];
    notes.forEach((freq, i) => {
      const osc    = this.ctx!.createOscillator();
      const gain   = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();
      const lfo    = this.ctx!.createOscillator();
      const lfoG   = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      gain.gain.value = 0.06;

      lfo.frequency.value = 0.3 + i * 0.05;
      lfoG.gain.value = 1.5;
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      lfo.start();

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc, lfo);
    });
    this.isPlaying = true;
  }

  // ── 2. Planets — curious, exploratory ───────────────────────────────────────
  playPlanets() {
    this.stopAll();
    if (!this.ctx || !this.masterGain) return;
    const notes = [146.83, 185.00, 220.00, 246.94, 293.66];
    notes.forEach((freq, i) => {
      const osc      = this.ctx!.createOscillator();
      const gain     = this.ctx!.createGain();
      const tremolo  = this.ctx!.createOscillator();
      const tremG    = this.ctx!.createGain();

      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      tremolo.frequency.value = 4 + i * 0.5;
      tremG.gain.value = 0.03;
      tremolo.connect(tremG);
      tremG.connect(gain.gain);
      tremolo.start();

      gain.gain.value = 0.04;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc, tremolo);
    });
    this.isPlaying = true;
  }

  // ── 3. Orrery — mechanical, clockwork ────────────────────────────────────────
  playOrrery() {
    this.stopAll();
    if (!this.ctx || !this.masterGain) return;

    const drone     = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    drone.type = 'sine';
    drone.frequency.value = 55;
    droneGain.gain.value = 0.08;
    drone.connect(droneGain);
    droneGain.connect(this.masterGain);
    drone.start();
    this.oscillators.push(drone);

    ([110, 165, 220] as const).forEach((freq, i) => {
      const osc  = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      gain.gain.value = 0.03 - i * 0.008;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc);
    });

    const pulse = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const click     = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      click.type = 'sine';
      click.frequency.value = 440;
      clickGain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      click.connect(clickGain);
      clickGain.connect(this.masterGain);
      click.start();
      click.stop(this.ctx.currentTime + 0.1);
      this.pulseTimeout = setTimeout(pulse, 2000);
    };
    this.pulseTimeout = setTimeout(pulse, 1000);
    this.isPlaying = true;
  }

  // ── 4. Timeline — historic, epic ─────────────────────────────────────────────
  playTimeline() {
    this.stopAll();
    if (!this.ctx || !this.masterGain) return;
    const notes = [98.00, 116.54, 146.83, 196.00];
    notes.forEach((freq, i) => {
      const osc    = this.ctx!.createOscillator();
      const gain   = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      gain.gain.setValueAtTime(0, this.ctx!.currentTime);
      gain.gain.linearRampToValueAtTime(0.05, this.ctx!.currentTime + 3 + i);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc);
    });
    this.isPlaying = true;
  }

  // ── 5. Quiz — alert, energetic ───────────────────────────────────────────────
  playQuiz() {
    this.stopAll();
    if (!this.ctx || !this.masterGain) return;
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq) => {
      const osc  = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.value = 0.025;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc);
    });
    this.isPlaying = true;
  }

  // ── 6. Black Hole — dark, ominous ────────────────────────────────────────────
  playBlackHole() {
    this.stopAll();
    if (!this.ctx || !this.masterGain) return;
    const notes = [30.87, 43.65, 61.74];
    notes.forEach((freq) => {
      const osc    = this.ctx!.createOscillator();
      const gain   = this.ctx!.createGain();
      const filter = this.ctx!.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.value = freq;
      filter.type = 'lowpass';
      filter.frequency.value = 150;
      gain.gain.value = 0.06;

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc);
    });
    this.isPlaying = true;
  }

  // ── 7. Galaxy — vast, ethereal ───────────────────────────────────────────────
  playGalaxy() {
    this.stopAll();
    if (!this.ctx || !this.masterGain) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, i) => {
      const osc  = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const lfo  = this.ctx!.createOscillator();
      const lfoG = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;
      lfo.frequency.value = 0.1 + i * 0.03;
      lfoG.gain.value = 3;
      lfo.connect(lfoG);
      lfoG.connect(osc.frequency);
      lfo.start();

      gain.gain.value = 0.025;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc, lfo);
    });
    this.isPlaying = true;
  }

  // ── 8. Sandbox — energetic, dynamic ─────────────────────────────────────────
  playSandbox() {
    this.stopAll();
    if (!this.ctx || !this.masterGain) return;
    // E minor scale — driving, energetic
    const notes = [164.81, 196.00, 220.00, 246.94, 293.66, 329.63];
    notes.forEach((freq, i) => {
      const osc     = this.ctx!.createOscillator();
      const gain    = this.ctx!.createGain();
      const tremolo = this.ctx!.createOscillator();
      const tremG   = this.ctx!.createGain();

      osc.type = i % 3 === 0 ? 'triangle' : i % 3 === 1 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      tremolo.frequency.value = 6 + i * 0.7;
      tremG.gain.value = 0.025;
      tremolo.connect(tremG);
      tremG.connect(gain.gain);
      tremolo.start();

      gain.gain.value = 0.03;
      osc.connect(gain);
      gain.connect(this.masterGain!);
      osc.start();
      this.oscillators.push(osc, tremolo);
    });
    // Low pulse for energy
    const pulse = this.ctx.createOscillator();
    const pulseGain = this.ctx.createGain();
    pulse.type = 'sine';
    pulse.frequency.value = 82.41;
    pulseGain.gain.value = 0.05;
    pulse.connect(pulseGain);
    pulseGain.connect(this.masterGain);
    pulse.start();
    this.oscillators.push(pulse);
    this.isPlaying = true;
  }

  // ── Controls ─────────────────────────────────────────────────────────────────
  stopAll() {
    if (this.pulseTimeout) { clearTimeout(this.pulseTimeout); this.pulseTimeout = null; }
    this.oscillators.forEach((osc) => { try { osc.stop(); } catch { /* already stopped */ } });
    this.oscillators = [];
    this.isPlaying = false;
  }

  setVolume(fraction: number) {
    this.volume = Math.max(0, Math.min(1, fraction)) * 0.12;
    if (!this.isMuted && this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.volume, this.ctx.currentTime, 0.3);
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(
        muted ? 0 : this.volume,
        this.ctx.currentTime, 0.3,
      );
    }
  }

  fadeOut(callback: () => void) {
    if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
    if (!this.masterGain || !this.ctx) { callback(); return; }
    this.masterGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.4);
    this.fadeTimeout = setTimeout(callback, 700);
  }

  fadeIn() {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(
      this.isMuted ? 0 : this.volume,
      this.ctx.currentTime, 0.8,
    );
  }

  destroy() {
    this.stopAll();
    if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
    this.ctx?.close();
    this.ctx = null;
  }
}

export const spaceMusicPlayer = new SpaceMusicPlayer();
