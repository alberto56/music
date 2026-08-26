// Generates a random, mostly-nonsensical bar of chords for the 404 page
// (src/pages/404.astro): 2 to 4 chords of 3 random notes each, packed into a
// single 4/4 measure. Because the notes are picked with no regard for key,
// scale, or voice-leading, the result is statistically likely to sound
// dissonant - which is the point (see DissonantChords, which plays it back).

// Sharps only (no flats) to keep pitch spelling simple and unambiguous for
// both VexFlow's EasyScore parser and DissonantChords' frequency lookup.
const NOTE_LETTERS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
// Keeps the random notes within a comfortable, readable range on a treble
// staff (roughly middle C to two octaves above), rather than spanning the
// whole keyboard and needing lots of ledger lines.
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
    // Fitting 2, 3, or 4 chords evenly into one 4/4 (4-beat) bar:
    //   - 2 chords -> 2 beats each (half notes), fills the bar exactly.
    //   - 4 chords -> 1 beat each (quarter notes), also fills it exactly.
    //   - 3 chords -> 1 beat each leaves 1 beat spare, so a trailing rest
    //     (see easyScoreString) is added to pad the bar out to 4 beats.
    this._beatsPerChord = chordCount === 2 ? 2 : 1;
    this._hasTrailingRest = chordCount === 3;
    return this;
  }

  // The chords actually meant to be heard/highlighted, in order. Deliberately
  // does NOT include the trailing rest (if any) - callers such as 404.astro
  // iterate this array to know what to play and animate, so the rest is
  // naturally skipped without any special-casing on their end.
  chords() {
    return this._chords;
  }

  beatsPerChord() {
    return this._beatsPerChord;
  }

  // Renders the progression as a VexFlow EasyScore string, e.g.
  // "(C4 D#5 G4)/q, (F#4 A4 B5)/q, (C5 D4 E5)/q, B4/q/r".
  easyScoreString() {
    const duration = this._beatsPerChord === 2 ? 'h' : 'q';
    const notes = this._chords
      .map((chord) => `(${chord.join(' ')})/${duration}`)
      .join(', ');
    // Note the "/q/r" (duration, then a SEPARATE slash, then the type
    // letter). This is a real gotcha in VexFlow's EasyScore grammar: writing
    // "B4/qr" (duration and type letter run together) is not recognized as
    // a rest at all - the parser just quietly drops the trailing "r" and
    // renders a normal, audible B4 note instead. That produced a visible bug
    // where a 3-chord bar showed what looked like a 4th note that never
    // actually played. "/q/r" is the correct syntax and yields a real,
    // silent rest (note.isRest() === true).
    return this._hasTrailingRest ? `${notes}, B4/q/r` : notes;
  }

  // Builds one chord as `notesPerChord` DISTINCT pitches (as plain strings,
  // e.g. "C#4"). Using a Set and looping until it reaches the target size
  // guarantees no duplicate pitch ever lands in the same chord, however
  // unlikely, without needing any special retry/backoff logic.
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
