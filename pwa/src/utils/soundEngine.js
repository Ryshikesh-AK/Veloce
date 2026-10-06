// Engine Exhaust & Launch Sound Synthesizer via Web Audio API
// Generates realistic luxury sports car exhaust revs and EV launch sounds on-demand without external mp3 dependencies

class SoundEngine {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play realistic sports engine rev (Porsche, Ferrari, V8, etc.)
  playExhaustRev(type = 'sports') {
    try {
      this.init();
      if (!this.ctx) return;

      const t0 = this.ctx.currentTime;
      const duration = 2.4;

      // Master Gain
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, t0);
      masterGain.gain.exponentialRampToValueAtTime(0.4, t0 + 0.15);
      masterGain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.9);
      masterGain.gain.exponentialRampToValueAtTime(0.5, t0 + 1.3);
      masterGain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
      masterGain.connect(this.ctx.destination);

      // Low rumble oscillator (V8 cylinders)
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(65, t0);
      osc1.frequency.exponentialRampToValueAtTime(140, t0 + 0.4);
      osc1.frequency.exponentialRampToValueAtTime(120, t0 + 0.8);
      osc1.frequency.exponentialRampToValueAtTime(220, t0 + 1.4);
      osc1.frequency.exponentialRampToValueAtTime(70, t0 + duration);

      // Distort for throaty exhaust roar
      const waveShaper = this.ctx.createWaveShaper();
      const n_samples = 44100;
      const curve = new Float32Array(n_samples);
      const deg = Math.PI / 180;
      const k = 50;
      for (let i = 0; i < n_samples; ++i) {
        const x = (i * 2) / n_samples - 1;
        curve[i] = ((3 + k) * x * 20 * deg) / (Math.PI + k * Math.abs(x));
      }
      waveShaper.curve = curve;

      // Low pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, t0);
      filter.frequency.exponentialRampToValueAtTime(1200, t0 + 1.4);
      filter.frequency.exponentialRampToValueAtTime(350, t0 + duration);

      osc1.connect(waveShaper);
      waveShaper.connect(filter);
      filter.connect(masterGain);

      // Pop / overrun backfire at t0 + 1.8s
      const popOsc = this.ctx.createOscillator();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(80, t0 + 1.7);
      popOsc.frequency.exponentialRampToValueAtTime(40, t0 + 2.0);

      const popGain = this.ctx.createGain();
      popGain.gain.setValueAtTime(0.001, t0);
      popGain.gain.setValueAtTime(0.3, t0 + 1.75);
      popGain.gain.exponentialRampToValueAtTime(0.001, t0 + 1.95);
      popOsc.connect(popGain);
      popGain.connect(masterGain);

      osc1.start(t0);
      osc1.stop(t0 + duration);
      popOsc.start(t0 + 1.7);
      popOsc.stop(t0 + 2.0);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  // Play high-tech EV Warp sound (Audi e-tron, Taycan, Tesla)
  playEvLaunch() {
    try {
      this.init();
      if (!this.ctx) return;

      const t0 = this.ctx.currentTime;
      const duration = 2.2;

      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(0.001, t0);
      masterGain.gain.exponentialRampToValueAtTime(0.35, t0 + 0.3);
      masterGain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
      masterGain.connect(this.ctx.destination);

      // Dual sine oscillators for electric jet pitch sweep
      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(180, t0);
      osc1.frequency.exponentialRampToValueAtTime(750, t0 + 1.6);
      osc1.frequency.exponentialRampToValueAtTime(600, t0 + duration);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(90, t0);
      osc2.frequency.exponentialRampToValueAtTime(375, t0 + 1.6);
      osc2.frequency.exponentialRampToValueAtTime(300, t0 + duration);

      osc1.connect(masterGain);
      osc2.connect(masterGain);

      osc1.start(t0);
      osc1.stop(t0 + duration);
      osc2.start(t0);
      osc2.stop(t0 + duration);
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }
}

export const soundEngine = new SoundEngine();
