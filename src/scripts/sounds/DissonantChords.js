// Plays back a ChordProgression (see ../notation/ChordProgression.js) as raw
// Web Audio oscillators, for the 404 page (src/pages/404.astro). Unlike
// GuitarString (../sounds/GuitarString.js), which strums a single realistic
// string using a stack of harmonics, this plays several simple tones at once
// per chord - simplicity here is deliberate, since the chords themselves are
// random and often dissonant, so a plain, slightly buzzy timbre suits the
// "toy piano gone wrong" whimsy of the 404 page better than a warmer,
// harmonics-rich guitar tone would.

// Semitone offset of each natural note letter above C, used to convert a
// note name (e.g. "F#5") into a MIDI note number in _frequencyFor.
const SEMITONES_FROM_C = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };

class DissonantChords {
  // Singleton, matching the pattern used by GuitarString: a page should
  // reuse one AudioContext rather than creating a new one per interaction
  // (browsers cap how many can exist, and audio scheduling is cleaner
  // against a single shared clock).
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
   * Schedules every chord to play back-to-back, one after another, using the
   * AudioContext's own clock (ctx.currentTime) rather than setTimeout - this
   * keeps the audio timing sample-accurate regardless of any lag in the
   * calling JavaScript (e.g. from the visual note-highlighting code in
   * 404.astro, which uses its own, less precise setTimeout loop to roughly
   * follow along).
   *
   * @param {string[][]} chords - array of chords, each an array of note
   *   names like "C#5", as produced by ChordProgression#chords().
   * @param {number} beatsPerChord - how many beats each chord occupies, as
   *   produced by ChordProgression#beatsPerChord().
   * @param {number} secondsPerBeat - playback tempo.
   */
  play(chords, beatsPerChord, secondsPerBeat = 0.6) {
    const duration = beatsPerChord * secondsPerBeat;
    const now = this.ctx.currentTime;

    chords.forEach((chord, index) => {
      const startTime = now + index * duration;
      // All notes in a chord start at the same time and play for the full
      // chord duration, i.e. as a block chord rather than an arpeggio.
      chord.forEach((note) => {
        this._playNote(this._frequencyFor(note), startTime, duration);
      });
    });
  }

  // Plays one single tone: a triangle-wave oscillator with a short
  // exponential fade-in/out envelope. The fade avoids the audible "click"
  // that starting/stopping a tone abruptly would otherwise produce, since
  // gain can't ramp exponentially to/from exactly 0, it targets a tiny
  // epsilon (0.0001) instead.
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
   * Converts a note name like "C#5" into a frequency in Hz, via its MIDI
   * note number and the standard equal-temperament formula (A4 = 440Hz,
   * MIDI note 69).
   *
   * @param {string} note like "C#5"
   */
  _frequencyFor(note) {
    const match = note.match(/^([A-G])(#?)(\d)$/);
    if (!match) {
      throw new Error(`Unknown note: ${note}`);
    }
    const [, letter, sharp, octave] = match;
    // MIDI note numbers count from C-1 = 0, so octave 4 (as used by
    // ChordProgression) needs a +1 shift to land C4 on MIDI note 60.
    const midi = (parseInt(octave, 10) + 1) * 12 + SEMITONES_FROM_C[letter] + (sharp ? 1 : 0);
    return 440 * Math.pow(2, (midi - 69) / 12);
  }
}

export default DissonantChords;
