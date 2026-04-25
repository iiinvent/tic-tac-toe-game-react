/**
 * soundEngine.js — Programmatic sound effects via Web Audio API.
 * No external files required; all sounds are synthesized on the fly.
 */

let audioCtx = null;

function getCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume if suspended (browser autoplay policy)
  if (audioCtx.state === 'suspended') audioCtx.resume();
  return audioCtx;
}

/**
 * playTone — Core helper that creates and plays a tone.
 * @param {number}   freq       - Frequency in Hz
 * @param {number}   duration   - Duration in seconds
 * @param {string}   type       - OscillatorType: 'sine'|'square'|'triangle'|'sawtooth'
 * @param {number}   gain       - Peak gain (0–1)
 * @param {number}   startTime  - AudioContext time to start
 * @param {string}   envelope   - 'pluck' | 'pad' | 'blip'
 */
function playTone(freq, duration, type = 'sine', gain = 0.4, startTime = 0, envelope = 'pluck') {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

  const t = ctx.currentTime + startTime;

  if (envelope === 'pluck') {
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(gain, t + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);
  } else if (envelope === 'pad') {
    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(gain, t + 0.08);
    gainNode.gain.setValueAtTime(gain, t + duration - 0.1);
    gainNode.gain.linearRampToValueAtTime(0, t + duration);
  } else if (envelope === 'blip') {
    gainNode.gain.setValueAtTime(gain, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + duration);
  }

  osc.start(t);
  osc.stop(t + duration + 0.01);
}

// ── Individual Sound Effects ──────────────────────────────────────────────────

/** Soft click when human places X */
export function playPlayerMove() {
  playTone(520, 0.12, 'triangle', 0.35, 0, 'pluck');
  playTone(780, 0.08, 'sine', 0.15, 0.04, 'pluck');
}

/** Slightly different tone when computer places O */
export function playComputerMove() {
  playTone(380, 0.14, 'triangle', 0.3, 0, 'pluck');
  playTone(570, 0.09, 'sine', 0.12, 0.05, 'pluck');
}

/** Ascending fanfare for a win */
export function playWin() {
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    playTone(freq, 0.35, 'triangle', 0.4, i * 0.12, 'pad');
  });
  // Sparkle layer
  [1047, 1319, 1568].forEach((freq, i) => {
    playTone(freq, 0.2, 'sine', 0.15, 0.48 + i * 0.08, 'pluck');
  });
}

/** Descending sad tones for a loss */
export function playLoss() {
  const notes = [392, 349, 311, 262]; // G4 F4 Eb4 C4
  notes.forEach((freq, i) => {
    playTone(freq, 0.4, 'triangle', 0.35, i * 0.14, 'pad');
  });
}

/** Neutral two-tone for a draw */
export function playDraw() {
  playTone(440, 0.25, 'sine', 0.3, 0, 'pad');
  playTone(440, 0.25, 'sine', 0.3, 0.3, 'pad');
}

// ── Mute State ────────────────────────────────────────────────────────────────

let muted = false;

export function isMuted() { return muted; }
export function toggleMute() { muted = !muted; return muted; }

/**
 * play — Safe wrapper that respects mute state.
 * @param {function} soundFn - One of the exported sound functions above
 */
export function play(soundFn) {
  if (!muted) soundFn();
}
