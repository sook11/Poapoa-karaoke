/**
 * Audio Engine (Web Audio API)
 * Handles Pitch Shifting, Tempo Control, Stereo Channel Splitting (Vocal Switch L/R), Master Volume
 */

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.panner = null;
    this.splitter = null;
    this.merger = null;
    this.pitchShiftSemi = 0;
    this.playbackRate = 1.0;
    this.vocalChannel = 'STEREO'; // 'STEREO', 'MUSIC_ONLY' (R), 'VOCAL_ONLY' (L)
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.panner = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;

      if (this.panner) {
        this.masterGain.connect(this.panner);
        this.panner.connect(this.ctx.destination);
      } else {
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setKeyPitch(semitones) {
    this.pitchShiftSemi = Math.max(-6, Math.min(6, semitones));
    return this.pitchShiftSemi;
  }

  setTempoRate(rate) {
    this.playbackRate = Math.max(0.5, Math.min(1.5, rate));
    return this.playbackRate;
  }

  setVocalChannel(mode) {
    // 'STEREO': Full Audio
    // 'MUSIC_ONLY': Right Channel routed to both L/R
    // 'VOCAL_ONLY': Left Channel routed to both L/R
    this.vocalChannel = mode;
    return this.vocalChannel;
  }

  setVolume(vol) {
    this.init();
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(vol, this.ctx.currentTime);
    }
  }

  // Frequency pitch multiplier calculation
  getPitchMultiplier() {
    return Math.pow(2, this.pitchShiftSemi / 12);
  }
}

export const audioEngine = new AudioEngine();
