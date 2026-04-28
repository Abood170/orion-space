export class BlackHoleAudio {
  private ctx: AudioContext | null = null;
  private ambientOsc: OscillatorNode | null = null;
  private ambientGain: GainNode | null = null;
  private isEnabled = true;

  init() {
    if (typeof window === 'undefined' || this.ctx) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  resume() {
    this.ctx?.resume();
  }

  // ── 1. Ambient rumble ────────────────────────────────────────────────────────
  startAmbient(gravityStrength = 1) {
    if (!this.ctx || !this.isEnabled || this.ambientOsc) return;

    const osc    = this.ctx.createOscillator();
    const gain   = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.value = 40 + gravityStrength * 20;
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    gain.gain.value = 0.08;

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();

    this.ambientOsc  = osc;
    this.ambientGain = gain;
  }

  updateAmbient(gravityStrength: number) {
    if (!this.ambientOsc || !this.ctx) return;
    this.ambientOsc.frequency.setTargetAtTime(
      40 + gravityStrength * 20,
      this.ctx.currentTime,
      0.3,
    );
  }

  stopAmbient() {
    try { this.ambientOsc?.stop(); } catch { /* already stopped */ }
    this.ambientOsc  = null;
    this.ambientGain = null;
  }

  // ── 2. Planet launch whoosh ──────────────────────────────────────────────────
  playLaunch() {
    if (!this.ctx || !this.isEnabled) return;
    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.8);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.8);
  }

  // ── 3. Tidal forces crackle ──────────────────────────────────────────────────
  playTidalForces() {
    if (!this.ctx || !this.isEnabled) return;

    const bufSize = Math.floor(this.ctx.sampleRate * 1.5);
    const buffer  = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
    const data    = buffer.getChannelData(0);
    for (let i = 0; i < bufSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
    }

    const source = this.ctx.createBufferSource();
    const gain   = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    source.buffer      = buffer;
    filter.type        = 'bandpass';
    filter.frequency.value = 800;
    filter.Q.value     = 2;
    gain.gain.value    = 0.3;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    source.start();
  }

  // ── 4. Absorption boom ───────────────────────────────────────────────────────
  playAbsorption() {
    if (!this.ctx || !this.isEnabled) return;

    const osc        = this.ctx.createOscillator();
    const gain       = this.ctx.createGain();
    const distortion = this.ctx.createWaveShaper();

    const curve = new Float32Array(256);
    for (let i = 0; i < 256; i++) {
      const x = (i * 2) / 256 - 1;
      curve[i] = (Math.PI + 400) * x / (Math.PI + 400 * Math.abs(x));
    }
    distortion.curve = curve;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(60, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(20, this.ctx.currentTime + 1.5);

    gain.gain.setValueAtTime(0.8, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.5);

    osc.connect(distortion);
    distortion.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 1.5);

    setTimeout(() => this.playTidalForces(), 200);
  }

  // ── 5. Event horizon fall ────────────────────────────────────────────────────
  playEventHorizon() {
    if (!this.ctx || !this.isEnabled) return;

    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 3);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime + 2);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 4);
  }

  // ── 6. Gravity increase tone ─────────────────────────────────────────────────
  playGravityIncrease() {
    if (!this.ctx || !this.isEnabled) return;

    const osc  = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.3);

    gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
  }

  // ── Mute toggle ──────────────────────────────────────────────────────────────
  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
    if (this.ambientGain) {
      this.ambientGain.gain.value = enabled ? 0.08 : 0;
    }
  }

  destroy() {
    this.stopAmbient();
    this.ctx?.close();
    this.ctx = null;
  }
}

export const blackHoleAudio = new BlackHoleAudio();
