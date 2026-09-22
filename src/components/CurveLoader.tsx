"use client";
import { useEffect, useRef, useMemo } from "react";
import type { CSSProperties } from "react";

// ---------------------------------------------------------------------------
// Pixel Dissolve Grid Preloader
// The screen is covered by a 16×9 grid of black tiles.
// On exit, tiles dissolve away in a radial wave from the centre outward,
// revealing the 3D hero that has already been warming up underneath.
// All tile animations run on the GPU compositor via CSS @keyframes — zero
// JS main-thread involvement during the reveal.
// ---------------------------------------------------------------------------

const COLS = 16;
const ROWS = 9;

const LOADER_CSS = `
  /* ---- WRAPPER ---- */
  #cl-wrapper {
    /* #000 during loading fills any sub-pixel rounding gaps between tiles
       so the hero never bleeds through before dissolve fires. */
    background: #000;
  }
  /* Once dissolving: go transparent so the hero is revealed as tiles vanish */
  #cl-wrapper.cl-dissolving {
    background: transparent;
  }

  /* ---- PIXEL TILE GRID ---- */
  #cl-tiles {
    position: absolute;
    inset: 0;
    display: grid;
    grid-template-columns: repeat(${COLS}, 1fr);
    grid-template-rows: repeat(${ROWS}, 1fr);
    z-index: 1;
  }
  .cl-tile {
    background: #000;
    will-change: transform, opacity;
    transform-origin: center center;
    opacity: 1;
    transform: scale(1);
  }

  /* Tile dissolve — fired by adding .cl-dissolving to #cl-wrapper */
  #cl-wrapper.cl-dissolving .cl-tile {
    animation: cl-tile-out 420ms cubic-bezier(0.4, 0, 1, 1) both;
    /* animation-delay injected via inline style per tile */
  }

  @keyframes cl-tile-out {
    0%   { opacity: 1;    transform: scale(1);    filter: brightness(1); }
    /* Brief pixel-burn flash before collapsing */
    35%  { opacity: 1;    transform: scale(1.04); filter: brightness(2.8); }
    70%  { opacity: 0.25; transform: scale(0.82); filter: brightness(1); }
    100% { opacity: 0;    transform: scale(0.6);  filter: brightness(0); }
  }

  /* ---- LOADER CONTENT: single centred layer above tiles ---- */
  #cl-content {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    pointer-events: none;
    /* Fade content out slightly before/during tile dissolve */
    transition: opacity 0.28s ease;
  }
  #cl-wrapper.cl-dissolving #cl-content {
    opacity: 0;
    transition-delay: 0.04s;
  }

  /* ---- INNER STACK ---- */
  .cl-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.1rem;
    padding: 0 1rem;
    text-align: center;
    user-select: none;
  }

  /* ---- 3D CSS CUBE ---- */
  .cl-3d-scene {
    perspective: 800px;
    perspective-origin: 50% 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
  }
  .cl-3d-cube {
    width: 60px; height: 60px;
    position: relative;
    transform-style: preserve-3d;
    animation: cl-cube-spin 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    will-change: transform;
  }
  .cl-face {
    position: absolute;
    width: 60px; height: 60px;
    border: 1.5px solid rgba(255,255,255,0.38);
    background: rgba(255,255,255,0.04);
    box-shadow: inset 0 0 10px rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    font-family: monospace;
    font-size: 10px; font-weight: bold;
    color: rgba(255,255,255,0.65);
  }
  .cl-face-front  { transform: translateZ(30px); }
  .cl-face-back   { transform: rotateY(180deg) translateZ(30px); }
  .cl-face-right  { transform: rotateY(90deg) translateZ(30px); }
  .cl-face-left   { transform: rotateY(-90deg) translateZ(30px); }
  .cl-face-top    { transform: rotateX(90deg) translateZ(30px); }
  .cl-face-bottom { transform: rotateX(-90deg) translateZ(30px); }

  .cl-3d-ring {
    position: absolute;
    width: 118px; height: 118px;
    border: 1.5px dashed rgba(255,255,255,0.18);
    border-radius: 50%;
    transform-style: preserve-3d;
    animation: cl-ring-spin 4s linear infinite;
    will-change: transform, border-color, box-shadow;
    transition: border-color 0.35s ease, box-shadow 0.35s ease;
  }

  /* Cube & ring shine when counter hits 100 */
  .cl-3d-scene.exiting .cl-3d-ring {
    border-color: rgba(255, 255, 255, 0.88);
    box-shadow: 0 0 22px rgba(255, 255, 255, 0.55);
  }
  .cl-3d-scene.exiting .cl-face {
    animation: cl-face-shine 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes cl-face-shine {
    0%   { border-color: rgba(255,255,255,0.38); background: rgba(255,255,255,0.04); box-shadow: inset 0 0 10px rgba(255,255,255,0.07); }
    45%  { border-color: rgba(255,255,255,0.95); background: rgba(255,255,255,0.20); box-shadow: inset 0 0 20px rgba(255,255,255,0.50), 0 0 16px rgba(255,255,255,0.40); }
    100% { border-color: rgba(255,255,255,0.90); background: rgba(255,255,255,0.18); box-shadow: inset 0 0 18px rgba(255,255,255,0.45), 0 0 14px rgba(255,255,255,0.35); }
  }

  @keyframes cl-cube-spin {
    0%   { transform: rotateX(-20deg) rotateY(0deg)   rotateZ(0deg); }
    50%  { transform: rotateX(20deg)  rotateY(180deg) rotateZ(15deg); }
    100% { transform: rotateX(-20deg) rotateY(360deg) rotateZ(0deg); }
  }
  @keyframes cl-ring-spin {
    0%   { transform: rotateX(70deg) rotateZ(0deg); }
    100% { transform: rotateX(70deg) rotateZ(360deg); }
  }

  /* ---- NAME TAG ---- */
  .cl-name-tag {
    font-family: monospace;
    font-size: clamp(0.52rem, 1.6vw, 0.72rem);
    letter-spacing: 0.22em;
    color: rgba(255,255,255,0.45);
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 0.45rem;
  }
  .cl-dot { color: rgba(255,255,255,0.18); }

  /* Stacked LOADING / READY words */
  .cl-status-wrap {
    display: inline-grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    font-weight: 700;
    color: rgba(255,255,255,0.78);
  }
  .cl-status-word { grid-column: 1; grid-row: 1; transition: opacity 0.3s ease; }
  .cl-status-word--ready   { opacity: 0; }
  .cl-status-word--loading { opacity: 1; }
  .cl-3d-scene.exiting ~ .cl-name-tag .cl-status-word--loading { opacity: 0; }
  .cl-3d-scene.exiting ~ .cl-name-tag .cl-status-word--ready   { opacity: 1; }

  /* ---- WELCOME TEXT ---- */
  .cl-welcome-text {
    display: flex;
    justify-content: center;
    overflow: visible;
    margin: 0; padding: 0;
    font-size: clamp(2.5rem, 11vw, 6.5rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: #fff;
    line-height: 1;
  }
  .cl-char {
    display: inline-block;
    opacity: 0;
    transform: translateY(-44px) scaleY(1.55);
    animation: cl-char-slam 0.42s cubic-bezier(0.22, 1, 0.36, 1)
               calc(0.08s + var(--ci, 0) * 0.055s) forwards;
    will-change: transform, opacity;
    transform-origin: top center;
  }
  @keyframes cl-char-slam {
    0%   { opacity: 0; transform: translateY(-44px) scaleY(1.55); }
    55%  { opacity: 1; transform: translateY(4px)   scaleY(0.88); }
    75%  { transform: translateY(-2px) scaleY(1.04); }
    100% { opacity: 1; transform: translateY(0)     scaleY(1); }
  }

  /* ---- COUNTER ---- */
  .cl-counter {
    font-family: monospace;
    color: #fff;
    display: flex;
    align-items: baseline;
    gap: 2px;
  }
  .cl-count {
    font-weight: 900;
    font-size: clamp(1.8rem, 7vw, 3.8rem);
    letter-spacing: -0.04em;
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .cl-percent {
    font-size: 1.1rem;
    opacity: 0.45;
    font-weight: 700;
  }

  /* ---- PROGRESS BAR ---- */
  .cl-progress-bar {
    width: 110px; height: 1.5px;
    background: rgba(255,255,255,0.1);
    overflow: hidden;
  }
  .cl-progress-fill {
    height: 100%;
    background: rgba(255,255,255,0.6);
    width: 0%;
    animation: cl-progress-grow 1.4s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    will-change: width;
  }
  @keyframes cl-progress-grow {
    0%   { width: 0%; }
    100% { width: 100%; }
  }

  /* ---- HERO ENTRANCE GATING ---- */
  .animate-slide-up,
  .animate-slide-up-delay-1,
  .animate-slide-up-delay-2 {
    animation-play-state: paused;
  }
  html.loader-exiting .animate-slide-up,
  html.loader-exiting .animate-slide-up-delay-1,
  html.loader-exiting .animate-slide-up-delay-2,
  html.loader-complete .animate-slide-up,
  html.loader-complete .animate-slide-up-delay-1,
  html.loader-complete .animate-slide-up-delay-2 {
    animation-play-state: running;
  }
  html.no-animations .animate-slide-up,
  html.no-animations .animate-slide-up-delay-1,
  html.no-animations .animate-slide-up-delay-2 {
    animation: none;
    opacity: 1;
    transform: none;
  }

  /* ---- REDUCED MOTION ---- */
  @media (prefers-reduced-motion: reduce) {
    .cl-tile {
      animation: none !important;
      opacity: 0 !important;
    }
    .cl-char, .cl-3d-cube, .cl-3d-ring, .cl-progress-fill {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      width: 100% !important;
    }
  }
`;

// ---------------------------------------------------------------------------
// Main loader component
// ---------------------------------------------------------------------------
export default function CurveLoader({
  locale = "en",
}: {
  onComplete?: () => void;
  locale?: string;
  initialLoaded?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const rafRef     = useRef<number>(0);
  const hasExited  = useRef(false);

  const isAr        = locale === "ar";
  const nameText    = isAr ? "سامي برسوم" : "SAMY BARSOUM";
  const welcomeText = isAr ? "أهلاً بك"   : "WELCOME";

  // Pre-compute per-tile dissolve delays (radial from centre, with organic jitter).
  // useMemo with [] runs once on mount — stable for the component's lifetime.
  const tileDelays = useMemo<number[]>(() => {
    const cx = (COLS - 1) / 2;
    const cy = (ROWS - 1) / 2;
    const maxDist = Math.sqrt(cx * cx + cy * cy);
    return Array.from({ length: COLS * ROWS }, (_, i) => {
      const col = i % COLS;
      const row = Math.floor(i / COLS);
      const dx = col - cx;
      const dy = row - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const normalized = dist / maxDist;
      // ±15% organic jitter so tiles don't dissolve in perfect arcs
      const jitter = (Math.random() - 0.5) * 0.18;
      return Math.max(0, (normalized + jitter) * 820);
    });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Cache the single counter span
    const countEl = document.querySelector<HTMLSpanElement>(".cl-count");
    const setCount = (val: string) => {
      if (countEl) countEl.textContent = val;
    };

    document.documentElement.style.overflow = "hidden";

    const COUNTER_DURATION = 1200; // ms
    const start      = performance.now();
    let countVal     = 0;
    let assetsReady  = false;
    let counterDone  = false;

    const maybeExit = () => {
      if (!assetsReady || !counterDone || hasExited.current) return;
      triggerExit();
    };

    // Gate: custom fonts
    document.fonts.ready.then(() => {
      assetsReady = true;
      maybeExit();
    });
    const fontFallback = setTimeout(() => {
      assetsReady = true;
      maybeExit();
    }, 2000);

    // rAF counter — exponential ease-out to 100
    const tick = (now: number) => {
      const t     = Math.min((now - start) / COUNTER_DURATION, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const val   = Math.floor(eased * 100);

      if (val !== countVal) {
        countVal = val;
        setCount(String(val));
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setCount("100");
        // Trigger cube shine
        document.querySelectorAll<HTMLElement>(".cl-3d-scene").forEach((el) => {
          el.classList.add("exiting");
        });
        // 180ms pause: shine peaks, then dissolve fires
        setTimeout(() => {
          counterDone = true;
          maybeExit();
        }, 180);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    // Hard fallback — always exit by 3.5 s
    const hardFallback = setTimeout(() => {
      if (!hasExited.current) triggerExit();
    }, 3500);

    // ---------------------------------------------------------------------------
    // Exit: radial pixel-dissolve grid — all tile animations are GPU-composited
    // ---------------------------------------------------------------------------
    function triggerExit() {
      if (hasExited.current) return;
      hasExited.current = true;

      const wrapper = wrapperRef.current;
      if (!wrapper) { finalize(); return; }

      // Signal Hero CSS animations to start running
      document.documentElement.classList.add("loader-exiting");

      // Fire dissolve on next paint frame
      requestAnimationFrame(() => {
        wrapper.classList.add("cl-dissolving");
      });

      // Max tile delay (820ms) + tile animation (420ms) + small buffer = 1300ms
      setTimeout(finalize, 1300);
    }

    function finalize() {
      document.documentElement.style.overflow = "";
      document.documentElement.classList.remove("loader-exiting");
      document.documentElement.classList.add("loader-complete");
      if (wrapperRef.current) wrapperRef.current.style.display = "none";
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fontFallback);
      clearTimeout(hardFallback);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      id="cl-wrapper"
      aria-hidden="true"
      style={{ position: "fixed", inset: 0, zIndex: 9999, pointerEvents: "all" }}
    >
      <style>{LOADER_CSS}</style>

      {/* PIXEL TILE GRID — covers hero underneath */}
      <div id="cl-tiles">
        {tileDelays.map((delay, i) => (
          <div
            key={i}
            className="cl-tile"
            style={{ animationDelay: `${delay}ms` } as CSSProperties}
          />
        ))}
      </div>

      {/* CENTRED CONTENT — sits above tiles at z-index 2 */}
      <div id="cl-content">
        <div className="cl-inner">

          {/* 3D CSS Cube */}
          <div className="cl-3d-scene">
            <div className="cl-3d-ring" />
            <div className="cl-3d-cube">
              <div className="cl-face cl-face-front">+</div>
              <div className="cl-face cl-face-back">+</div>
              <div className="cl-face cl-face-right">+</div>
              <div className="cl-face cl-face-left">+</div>
              <div className="cl-face cl-face-top">+</div>
              <div className="cl-face cl-face-bottom">+</div>
            </div>
          </div>

          {/* Name + status */}
          <div className="cl-name-tag">
            <span>{nameText}</span>
            <span className="cl-dot">•</span>
            <span className="cl-status-wrap">
              <span className="cl-status-word cl-status-word--loading">
                {isAr ? "جاري التحميل" : "LOADING"}
              </span>
              <span className="cl-status-word cl-status-word--ready">
                {isAr ? "جاهز" : "READY"}
              </span>
            </span>
          </div>

          {/* Welcome heading */}
          <div className="cl-welcome-text" role="presentation">
            {welcomeText.split("").map((char, i) => (
              <span
                key={i}
                className="cl-char"
                style={{ "--ci": i } as CSSProperties}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </div>

          {/* Counter */}
          <div className="cl-counter">
            <span className="cl-count">0</span>
            <span className="cl-percent">%</span>
          </div>

          {/* Progress bar */}
          <div className="cl-progress-bar">
            <div className="cl-progress-fill" />
          </div>

        </div>
      </div>
    </div>
  );
}
