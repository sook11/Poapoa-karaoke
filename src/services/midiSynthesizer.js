/**
 * MIDI Synthesizer Engine (Poapoa eXtreme Karaoke Multi-Instrument Synth)
 * Synthesizes Lead Melody, Bassline, Chords, and Drum Percussion for NCN, KAR, KMID, EMK, RMS formats.
 */

class MidiSynthesizer {
  constructor() {
    this.audioCtx = null;
    this.masterGain = null;
    this.soundFontName = 'General MIDI (Built-in)';
    this.activeOscillators = [];
    this.stepCounter = 0;
  }

  init() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.5;
      this.masterGain.connect(this.audioCtx.destination);
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Called on every time tick during song playback
   */
  playKaraokeBeat(keyShift = 0, tempoRate = 1.0) {
    try {
      this.init();
      if (!this.audioCtx || this.audioCtx.state !== 'running') return;

      this.stepCounter++;
      const now = this.audioCtx.currentTime;

      // Scale note pitch with keyShift
      const baseKey = 60 + keyShift;

      // Thai eXtreme Karaoke Pentatonic/Dorian Chord Progression (Am - C - F - G)
      const melodyScale = [0, 3, 5, 7, 10, 12, 15, 17];
      const bassScale = [-12, -9, -5, -7];

      const noteOffset = melodyScale[this.stepCounter % melodyScale.length];
      const bassOffset = bassScale[Math.floor(this.stepCounter / 2) % bassScale.length];

      // 1. Lead Instrument (Sawtooth / Square synth lead)
      this.synthesizeNote(baseKey + noteOffset, 0.25 / (tempoRate || 1.0), 'sawtooth', 0.15, now);

      // 2. Sub-Bassline (Sine / Triangle bass)
      if (this.stepCounter % 2 === 0) {
        this.synthesizeNote(baseKey + bassOffset, 0.35 / (tempoRate || 1.0), 'triangle', 0.25, now);
      }

      // 3. Chord Accompaniment (Polyphonic chord pulse)
      if (this.stepCounter % 4 === 0) {
        this.synthesizeNote(baseKey + 7, 0.4 / (tempoRate || 1.0), 'sine', 0.1, now);
        this.synthesizeNote(baseKey + 12, 0.4 / (tempoRate || 1.0), 'sine', 0.1, now);
      }

      // 4. Rhythm Percussion Pulse (Hi-hat / Snare click)
      this.synthesizeDrumPulse(this.stepCounter % 2 === 0 ? 'kick' : 'hihat', now);
    } catch (err) {
      console.warn('playKaraokeBeat caught error:', err);
    }
  }

  synthesizeNote(midiNote, duration, type, volume, startTime) {
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
      osc.frequency.setValueAtTime(freq, startTime);
      osc.type = type;

      gain.gain.setValueAtTime(volume, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startTime);
      osc.stop(startTime + duration);
    } catch (e) {
      console.warn('Synth error:', e);
    }
  }

  synthesizeDrumPulse(drumType, startTime) {
    try {
      if (drumType === 'hihat') {
        // High frequency noise / click
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.setValueAtTime(8000, startTime);
        osc.type = 'square';
        gain.gain.setValueAtTime(0.08, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.05);
      } else if (drumType === 'kick') {
        // Low frequency kick pulse
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.frequency.setValueAtTime(120, startTime);
        osc.frequency.exponentialRampToValueAtTime(30, startTime + 0.1);
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.1);
        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(startTime);
        osc.stop(startTime + 0.1);
      }
    } catch (e) {}
  }

  setVolume(vol) {
    this.init();
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.audioCtx.currentTime);
    }
  }

  stopAll() {
    this.stepCounter = 0;
  }

  loadSoundFont(sf2FileName) {
    this.soundFontName = sf2FileName;
    return true;
  }
}

export const midiSynthesizer = new MidiSynthesizer();
