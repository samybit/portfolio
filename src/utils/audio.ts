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
    const now = ctx.currentTime;

    // A descending musical drop: two staggered harmonic tones going downward
    const createTone = (frequency: number, start: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      harmonic.type = "sine";
      osc.frequency.value = frequency;
      harmonic.frequency.value = frequency * 0.5; // Sub-octave for warmth

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.start(start);
      harmonic.start(start);
      osc.stop(start + duration);
      harmonic.stop(start + duration);
    };

    createTone(220, now, 0.22, 0.05);          // A3 — warm thump
    createTone(146.83, now + 0.07, 0.25, 0.04); // D3 — low resolving drop
  } catch (error) {
    // Silently fail
  }
};

// --- 2. SOFT ELEGANT CLICK (For SystemOverride) - VIP Feeling ---
export const playMechanicalClick = (isPressDown: boolean) => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const createTone = (frequency: number, start: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      harmonic.type = "sine";
      osc.frequency.value = frequency;
      harmonic.frequency.value = frequency * 2;

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.start(start);
      harmonic.start(start);
      osc.stop(start + duration);
      harmonic.stop(start + duration);
    };

    if (isPressDown) {
      // Press: quick ascending two-note tap — E5 → A5
      createTone(659.25, now, 0.1, 0.04);
      createTone(880, now + 0.045, 0.12, 0.03);
    } else {
      // Release: gentle descending resolution — A5 → E5
      createTone(880, now, 0.1, 0.035);
      createTone(659.25, now + 0.045, 0.12, 0.025);
    }
  } catch (error) {
    // Silently fail
  }
};

// --- 3. SOFT ELEGANT TICK (For Mobile Menus & Pagination) - VIP Feeling ---
export const playTick = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const createTone = (frequency: number, start: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      harmonic.type = "sine";
      osc.frequency.value = frequency;
      harmonic.frequency.value = frequency * 2;

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.start(start);
      harmonic.start(start);
      osc.stop(start + duration);
      harmonic.stop(start + duration);
    };

    // A bright, airy upward chime — C6 → E6
    createTone(1046.50, now, 0.12, 0.03);
    createTone(1318.51, now + 0.05, 0.14, 0.025);
  } catch (error) {
    // Silently fail
  }
};

// --- 4. SOFT ELEGANT CLACK (For Theme Switcher) - VIP Feeling ---
export const playClack = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const createTone = (frequency: number, start: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      harmonic.type = "sine";
      osc.frequency.value = frequency;
      harmonic.frequency.value = frequency * 1.5; // Perfect 5th for a major-chord feel

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.start(start);
      harmonic.start(start);
      osc.stop(start + duration);
      harmonic.stop(start + duration);
    };

    // A rounded mid-tone shift — G4 → B4, like a satisfying toggle
    createTone(392, now, 0.16, 0.04);
    createTone(493.88, now + 0.07, 0.18, 0.035);
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

// --- 6. LANGUAGE TOGGLE WHOOSH (For Language Switcher) - Global Shift Feeling ---
export const playLanguageToggle = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    const createTone = (frequency: number, start: number, duration: number, volume: number) => {
      const osc = ctx.createOscillator();
      const harmonic = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      harmonic.type = "sine";
      osc.frequency.value = frequency;
      harmonic.frequency.value = frequency * 2;

      osc.connect(gain);
      harmonic.connect(gain);
      gain.connect(ctx.destination);

      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(volume, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);

      osc.start(start);
      harmonic.start(start);
      osc.stop(start + duration);
      harmonic.stop(start + duration);
    };

    // Tritone flip — C5 → F#5: the most "otherworldly" interval, like a world turning
    createTone(523.25, now, 0.14, 0.04);          // C5
    createTone(739.99, now + 0.065, 0.18, 0.035); // F#5
  } catch (error) {
    // Silently fail
  }
};