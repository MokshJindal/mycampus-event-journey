// ==========================================================================
// Web Audio API Procedural Sound Engine
// Zero external audio files required, zero latency, customizable volume/mute
// ==========================================================================

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('mycampus_muted') === 'true';
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

  isMuted() {
    return this.muted;
  }

  setMuted(muted) {
    this.muted = muted;
    localStorage.setItem('mycampus_muted', muted ? 'true' : 'false');
  }

  toggleMute() {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // Crisp tactile click
  playClick() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  }

  // Uplifting chord for milestone completion
  playSuccess() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;
      
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        
        gain.gain.setValueAtTime(0.12, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.35);
      });
    } catch (e) {}
  }

  // Soft warning chime for clash detected
  playWarning() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const freqs = [440, 370];
      
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);
        
        gain.gain.setValueAtTime(0.1, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.25);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.25);
      });
    } catch (e) {}
  }

  // Grand fanfare for Podium / Victory
  playFanfare() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      const now = this.ctx.currentTime;
      
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);
        
        gain.gain.setValueAtTime(0.1, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.5);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.5);
      });
    } catch (e) {}
  }
}

export const sound = new SoundEngine();
