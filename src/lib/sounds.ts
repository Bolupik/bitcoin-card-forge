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
