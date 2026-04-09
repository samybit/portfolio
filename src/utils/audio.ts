// src/utils/audio.ts

// We keep a single instance of the AudioContext to prevent memory leaks
let audioCtx: AudioContext | null = null;

const initAudio = () => {
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

export const playThud = () => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // A triangle wave gives a nice, heavy bass tone without being too harsh
    osc.type = 'triangle';

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    // Frequency sweeps down rapidly from 150Hz to 20Hz (like a heavy kick drum)
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.15);

    // Volume spikes and fades instantly
    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    osc.start(now);
    osc.stop(now + 0.15);
  } catch (error) {
    // Silently fail if the browser blocks it
  }
};

export const playMechanicalClick = (isPressDown: boolean) => {
  try {
    const ctx = initAudio();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Square wave for a harsh, electrical "snap"
    osc.type = 'square';

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;

    // Pressing down sounds slightly lower-pitched than releasing the button
    const startFreq = isPressDown ? 400 : 600;

    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    // Very sharp, short volume spike (50 milliseconds)
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

    osc.start(now);
    osc.stop(now + 0.05);
  } catch (error) {
    // Silently fail if the browser blocks it
  }
};