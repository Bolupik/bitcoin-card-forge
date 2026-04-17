// Web Audio API synthesized sound effects — no external deps needed

let ctx: AudioContext | null = null;

const getCtx = () => {
  if (!ctx) ctx = new AudioContext();
  return ctx;
};

/** Short tick sound for the rolling slot animation */
export const playTick = () => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 600, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, c.currentTime + 0.06);
    gain.gain.setValueAtTime(0.08, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.06);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.06);
  } catch { /* silent fail */ }
};

/** Rising shimmer for the final reveal */
export const playReveal = () => {
  try {
    const c = getCtx();
    const now = c.currentTime;
    // Layered rising tones
    [440, 554, 659, 880].forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.08 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain).connect(c.destination);
      osc.start(now + i * 0.08);
      osc.stop(now + 0.7);
    });
  } catch { /* silent fail */ }
};

/** Triumphant success fanfare */
export const playSuccess = () => {
  try {
    const c = getCtx();
    const now = c.currentTime;
    // Major chord arpeggio
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.04);
      gain.gain.setValueAtTime(0.15, now + i * 0.12 + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
      osc.connect(gain).connect(c.destination);
      osc.start(now + i * 0.12);
      osc.stop(now + 1.3);
    });
    // Sub bass thud
    const sub = c.createOscillator();
    const subG = c.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(80, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 0.3);
    subG.gain.setValueAtTime(0.2, now);
    subG.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    sub.connect(subG).connect(c.destination);
    sub.start(now);
    sub.stop(now + 0.5);
  } catch { /* silent fail */ }
};

/** Button click */
export const playClick = () => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1200, c.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, c.currentTime + 0.04);
    gain.gain.setValueAtTime(0.05, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.04);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.05);
  } catch { /* silent fail */ }
};

/** Pack rip / tear sound — noisy whoosh */
export const playPackRip = () => {
  try {
    const c = getCtx();
    const now = c.currentTime;
    // White noise burst via buffer
    const bufferSize = c.sampleRate * 0.6;
    const buffer = c.createBuffer(1, bufferSize, c.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Decaying noise
      data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
    }
    const noise = c.createBufferSource();
    noise.buffer = buffer;
    const filter = c.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(400, now + 0.6);
    filter.Q.value = 2;
    const gain = c.createGain();
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    noise.connect(filter).connect(gain).connect(c.destination);
    noise.start(now);
    noise.stop(now + 0.6);
  } catch { /* silent fail */ }
};

/** Card flip sound — woody tap */
export const playCardFlip = () => {
  try {
    const c = getCtx();
    const now = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain).connect(c.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  } catch { /* silent fail */ }
};

/** Rare/Epic/Legendary celebratory sting */
export const playRareReveal = (intensity: 'rare' | 'epic' | 'legendary') => {
  try {
    const c = getCtx();
    const now = c.currentTime;
    const baseFreq = intensity === 'legendary' ? 880 : intensity === 'epic' ? 740 : 660;
    const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];
    notes.forEach((freq, i) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = intensity === 'legendary' ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0, now + i * 0.06);
      gain.gain.linearRampToValueAtTime(0.14, now + i * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.5);
      osc.connect(gain).connect(c.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.55);
    });
    if (intensity === 'legendary') {
      // Sub bass thud
      const sub = c.createOscillator();
      const sg = c.createGain();
      sub.type = 'sine';
      sub.frequency.setValueAtTime(60, now);
      sub.frequency.exponentialRampToValueAtTime(30, now + 0.4);
      sg.gain.setValueAtTime(0.3, now);
      sg.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      sub.connect(sg).connect(c.destination);
      sub.start(now);
      sub.stop(now + 0.6);
    }
  } catch { /* silent fail */ }
};

/** Soft ambient hover sound */
export const playHover = () => {
  try {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, c.currentTime);
    gain.gain.setValueAtTime(0.025, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.08);
    osc.connect(gain).connect(c.destination);
    osc.start();
    osc.stop(c.currentTime + 0.1);
  } catch { /* silent fail */ }
};
