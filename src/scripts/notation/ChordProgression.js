const NOTE_LETTERS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const OCTAVES = [4, 5];

class ChordProgression {
  constructor({ minChords = 2, maxChords = 4, notesPerChord = 3 } = {}) {
    this._minChords = minChords;
    this._maxChords = maxChords;
    this._notesPerChord = notesPerChord;
  }

  generate() {
    const chordCount = this._randomInt(this._minChords, this._maxChords);
    this._chords = Array.from({ length: chordCount }, () => this._randomChord());
    this._beatsPerChord = chordCount === 2 ? 2 : 1;
    this._hasTrailingRest = chordCount === 3;
    return this;
  }

  chords() {
    return this._chords;
  }

  beatsPerChord() {
    return this._beatsPerChord;
  }

  easyScoreString() {
    const duration = this._beatsPerChord === 2 ? 'h' : 'q';
    const notes = this._chords
      .map((chord) => `(${chord.join(' ')})/${duration}`)
      .join(', ');
    return this._hasTrailingRest ? `${notes}, B4/qr` : notes;
  }

  _randomChord() {
    const pitches = new Set();
    while (pitches.size < this._notesPerChord) {
      pitches.add(this._randomPitch());
    }
    return Array.from(pitches);
  }

  _randomPitch() {
    const letter = NOTE_LETTERS[this._randomInt(0, NOTE_LETTERS.length - 1)];
    const octave = OCTAVES[this._randomInt(0, OCTAVES.length - 1)];
    return `${letter}${octave}`;
  }

  _randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export default ChordProgression;
