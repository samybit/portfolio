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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
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
  } catch {
    // Silently fail
  }
};

// --- 7. PAPER CRUMBLE (For Copy Email Button) - Tactile Paper Crinkle Feeling ---
export const playPaperCrumble = () => {
  try {
    const ctx = initAudio();
    if (!ctx) return;
    const now = ctx.currentTime;

    // Create 0.3s noise buffer for organic paper texture
    const bufferSize = Math.floor(ctx.sampleRate * 0.3);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    // Micro-crinkle noise bursts (rapid paper folds & crisp friction creases)
    const numBursts = 7;
    for (let i = 0; i < numBursts; i++) {
      const startTime = now + i * 0.032 + (Math.random() * 0.012 - 0.006);
      const duration = 0.025 + Math.random() * 0.02;

      const source = ctx.createBufferSource();
      source.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1600 + Math.random() * 3400; // High-frequency paper friction
      filter.Q.value = 2.0 + Math.random() * 2.5;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.06 + Math.random() * 0.04, startTime + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      source.start(startTime);
      source.stop(startTime + duration);
    }

    // Subtle paper body resonance (low-frequency crunch thud)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(90, now + 0.16);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.04, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.18);
  } catch {
    // Silently fail
  }
};