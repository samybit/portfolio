// A single instance of the AudioContext to prevent memory leaks
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (typeof window === "undefined") return null;
  // Browsers require a user interaction before allowing audio. 
  // Since these are triggered by clicks, this will always succeed.
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
};

export const prewarmAudio = () => {
  try {
    initAudio();
  } catch (e) {
    // silently fail
  }
};

// --- 1. SOFT ELEGANT THUD (Right-click) - VIP Feeling ---
export const playThud = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    // Warm, deep bass note - refined and sophisticated
    osc.frequency.setValueAtTime(200, now);

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.start(now);
    osc.stop(now + 0.2);
  } catch (error) {
    // Silently fail if blocked
  }
};

// --- 2. SOFT ELEGANT CLICK (For SystemOverride) - VIP Feeling ---
export const playMechanicalClick = (isPressDown: boolean) => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine';
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    // Higher freq for press down, lower for release - both refined and subtle
    const frequency = isPressDown ? 800 : 650;

    osc.frequency.setValueAtTime(frequency, now);

    gainNode.gain.setValueAtTime(0.07, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.start(now);
    osc.stop(now + 0.08);
  } catch (error) {
    // Silently fail if blocked
  }
};

// --- 3. SOFT ELEGANT TICK (For Mobile Menus & Pagination) - VIP Feeling ---
export const playTick = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    // Clean, high frequency - refined and subtle
    osc.frequency.setValueAtTime(1000, now);

    // Very soft with gentle fade
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07);

    osc.start(now);
    osc.stop(now + 0.07);
  } catch (error) {
    // Silently fail
  }
};

// --- 4. SOFT ELEGANT CLACK (For Theme Switcher) - VIP Feeling ---
export const playClack = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    // Warm, mid-range frequency - natural and refined
    osc.frequency.setValueAtTime(550, now);

    // Subtle volume with smooth fade
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (error) {
    // Silently fail
  }
};

// --- 5. VIP Confirmation Chime ---
export const playPowerUp = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;

    const now = ctx.currentTime;

    const createTone = (
      frequency: number,
      start: number,
      duration: number,
      volume: number
    ) => {
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      harmonic.type = "sine";

      osc.frequency.value = frequency;
      harmonic.frequency.value = frequency * 2;

      harmonic.connect(gain);
      osc.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.start(start);
      harmonic.start(start);

      osc.stop(start + duration);
      harmonic.stop(start + duration);
    };

    createTone(880, now, 0.18, 0.04);        // A5
    createTone(1318.51, now + 0.06, 0.22, 0.03); // E6
  } catch (error) {
    // Silently fail
  }
};