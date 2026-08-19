class GuitarString {
  static instance() {
    if (!GuitarString._instance) {
      GuitarString._instance = new GuitarString();
    }
    return GuitarString._instance;
  }

  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  strum({
    baseFreq = 110.00,
    duration = 1.00,
  } = {}) {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.exponentialRampToValueAtTime(0.3, now + 0.01); // quick attack, avoids a click
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration); // fade out
    masterGain.connect(ctx.destination);

    const harmonics = 7; // fundamental + 6 overtones
    for (let n = 1; n <= harmonics; n++) {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = baseFreq * n;

      const gain = ctx.createGain();
      gain.gain.value = 1 / n; // each overtone quieter than the last

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + duration);
    }
  }
}

if (import.meta.env.DEV) {
  window.GuitarString = GuitarString;
}

export default GuitarString;
