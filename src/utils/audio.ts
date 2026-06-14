// A single instance of the AudioContext to prevent memory leaks
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (typeof window === "undefined") return null;
  // Browsers require a user interaction before allowing audio. 
  // Since these are triggered by clicks, this will always succeed.
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
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

// --- 1. HEAVY THUD (Right-click) ---
export const playThud = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'triangle';
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.15);

    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    // Silently fail if blocked
  }
};

// --- 2. MECHANICAL CLICK (For SystemOverride) ---
export const playMechanicalClick = (isPressDown: boolean) => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'square';
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    const startFreq = isPressDown ? 400 : 600;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (error) {
    // Silently fail if blocked
  }
};

// --- 3. SHARP TICK (For Mobile Menus & Pagination) ---
export const playTick = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (error) {
    // Silently fail
  }
};

// --- 4. HEAVY CLACK (For Theme Switcher) ---
export const playClack = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.1);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  } catch (error) {
    // Silently fail
  }
};

// --- 5. DIGITAL POWER-UP (For Contact Form Submission) ---
export const playPowerUp = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.3);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 0.3);

    osc.start(now);
    osc.stop(now + 0.3);
  } catch (error) {
    // Silently fail
  }
};