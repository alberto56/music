const SEMITONES_FROM_C = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

class DissonantChords {
  static instance() {
    if (!DissonantChords._instance) {
      DissonantChords._instance = new DissonantChords();
    }
    return DissonantChords._instance;
  }

  constructor() {
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  }

  /**
   *
   * @param {string[][]} chords
   * @param {number} beatsPerChord
   * @param {number} secondsPerBeat
   */
  play(chords, beatsPerChord, secondsPerBeat = 0.6) {
    const duration = beatsPerChord * secondsPerBeat;
    const now = this.ctx.currentTime;

    chords.forEach((chord, index) => {
      const startTime = now + index * duration;
      chord.forEach((note) => {
        this._playNote(this._frequencyFor(note), startTime, duration);
      });
    });
  }

  _playNote(frequency, startTime, duration) {
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.0001, startTime);
    gain.gain.exponentialRampToValueAtTime(0.2, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
    gain.connect(this.ctx.destination);

    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = frequency;
    osc.connect(gain);
    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  /**
   *
   * @param {string} note like "C#5"
   */
  _frequencyFor(note) {
    const match = note.match(/^([A-G])(#?)(\d)$/);
    if (!match) {
      throw new Error(`Unknown note: ${note}`);
    }
    const [, letter, sharp, octave] = match;
    const midi = (parseInt(octave, 10) + 1) * 12 + SEMITONES_FROM_C[letter] + (sharp ? 1 : 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
}

export default DissonantChords;
