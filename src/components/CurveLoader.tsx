"use client";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap } from "gsap";

// ---------------------------------------------------------------------------
// Option C: Both panels contain the same full-viewport-width content block.
// Each panel has overflow:hidden and clips to its respective half.
// When GSAP slides the panels apart, the content is physically split and
// each half travels with its panel — no fake fade or floating overlay.
// ---------------------------------------------------------------------------

const LOADER_CSS = `
  /* ---- BASE LAYOUT ---- */
  #cl-panel-left,
  #cl-panel-right {
    position: absolute;
    top: 0; bottom: 0;
    width: 50%;
    background: #000;
    overflow: hidden;
    will-change: transform;
    /* Create a new stacking context so z-index children behave */
    isolation: isolate;
  }
  #cl-panel-left  { left: 0; }
  #cl-panel-right { right: 0; }

  /* ---- PANEL DECORATIONS (stay inside their panel) ---- */
  /* Subtle grid texture */
  #cl-panel-left::before,
  #cl-panel-right::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      repeating-linear-gradient(0deg, transparent, transparent 59px, rgba(255,255,255,0.028) 59px, rgba(255,255,255,0.028) 60px),
      repeating-linear-gradient(90deg, transparent, transparent 59px, rgba(255,255,255,0.028) 59px, rgba(255,255,255,0.028) 60px);
    pointer-events: none;
    z-index: 0;
  }

  /* Corner bracket marks — outer corners only */
  #cl-panel-left::after {
    content: '';
    position: absolute;
    top: 28px; left: 28px;
    width: 28px; height: 28px;
    border-top: 1.5px solid rgba(255,255,255,0.22);
    border-left: 1.5px solid rgba(255,255,255,0.22);
    z-index: 1;
  }
  #cl-panel-right::after {
    content: '';
    position: absolute;
    top: 28px; right: 28px;
    width: 28px; height: 28px;
    border-top: 1.5px solid rgba(255,255,255,0.22);
    border-right: 1.5px solid rgba(255,255,255,0.22);
    z-index: 1;
  }

  /* Technical panel labels (stay anchored to outer edges) */
  .cl-panel-label {
    position: absolute;
    bottom: 28px;
    font-family: monospace;
    font-size: 0.58rem;
    letter-spacing: 0.22em;
    color: rgba(255,255,255,0.18);
    text-transform: uppercase;
    pointer-events: none;
    z-index: 1;
  }
  .cl-panel-label--left  { left: 28px; }
  .cl-panel-label--right { right: 28px; }

  /* ---- SHARED CONTENT LAYER ---- */
  /*
   * Key trick: width = 200% (= 100vw since each panel is 50vw).
   * Left panel:  left:0  → content spans 0 to 100vw, panel clips left half.
   * Right panel: right:0 → content spans 0 to 100vw, panel clips right half.
   * Both show the same centered content — split exactly at the seam.
   */
  .cl-panel-content {
    position: absolute;
    top: 0; bottom: 0;
    width: 200%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
    pointer-events: none;
  }
  .cl-panel-content--left  { left: 0; }
  .cl-panel-content--right { right: 0; }

  /* Inner flex stack */
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
    /* Smooth glow-up when exiting class is applied */
    transition: border-color 0.35s ease, box-shadow 0.35s ease;
  }

  /* Cube & ring shine when counter hits 100 — peaks right as panels split */
  .cl-3d-scene.exiting .cl-3d-ring {
    border-color: rgba(255, 255, 255, 0.88);
    box-shadow: 0 0 22px rgba(255, 255, 255, 0.55);
  }

  .cl-3d-scene.exiting .cl-face {
    animation: cl-face-shine 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }

  @keyframes cl-face-shine {
    0% {
      border-color: rgba(255, 255, 255, 0.38);
      background:   rgba(255, 255, 255, 0.04);
      box-shadow:   inset 0 0 10px rgba(255, 255, 255, 0.07);
    }
    /* Peak: full glow at 45% — this is the moment the panels start opening */
    45% {
      border-color: rgba(255, 255, 255, 0.95);
      background:   rgba(255, 255, 255, 0.20);
      box-shadow:   inset 0 0 20px rgba(255, 255, 255, 0.50),
                    0 0 16px rgba(255, 255, 255, 0.40);
    }
    /* Hold the glow — panels are now splitting open with a bright cube */
    100% {
      border-color: rgba(255, 255, 255, 0.90);
      background:   rgba(255, 255, 255, 0.18);
      box-shadow:   inset 0 0 18px rgba(255, 255, 255, 0.45),
                    0 0 14px rgba(255, 255, 255, 0.35);
    }
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
  .cl-dot    { color: rgba(255,255,255,0.18); }

  /* Stacked LOADING / READY words — same grid cell, cross-fade on exiting */
  .cl-status-wrap {
    display: inline-grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    font-weight: 700;
    color: rgba(255,255,255,0.78);
  }
  .cl-status-word {
    grid-column: 1;
    grid-row: 1;
    transition: opacity 0.3s ease;
  }
  .cl-status-word--ready   { opacity: 0; }
  .cl-status-word--loading { opacity: 1; }

  /* When .cl-3d-scene sibling gets .exiting, swap the words */
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
  /* Pause slide-up animations until the loader signals its exit */
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
    .cl-char, .cl-3d-cube, .cl-3d-ring, .cl-progress-fill {
      animation: none !important;
      opacity: 1 !important;
      transform: none !important;
      width: 100% !important;
    }
  }
`;

// ---------------------------------------------------------------------------
// Shared content block — rendered identically inside each panel.
// Each panel's overflow:hidden clips its respective half of the content.
// ---------------------------------------------------------------------------
function PanelContent({
  side,
  nameText,
  welcomeText,
  isAr,
}: {
  side: "left" | "right";
  nameText: string;
  welcomeText: string;
  isAr: boolean;
}) {
  return (
    <div className={`cl-panel-content cl-panel-content--${side}`}>
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
  );
}

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
  const wrapperRef   = useRef<HTMLDivElement>(null);
  const panelLeftRef = useRef<HTMLDivElement>(null);
  const panelRightRef= useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const hasExited    = useRef(false);

  const isAr       = locale === "ar";
  const nameText   = isAr ? "سامي برسوم" : "SAMY BARSOUM";
  const welcomeText= isAr ? "أهلاً بك"   : "WELCOME";

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Capture panel refs at effect start — satisfies react-hooks/exhaustive-deps
    // in the cleanup closure below.
    const panelL = panelLeftRef.current;
    const panelR = panelRightRef.current;

    // Cache counter elements once (both panels have one each)
    const countEls = Array.from(
      document.querySelectorAll<HTMLSpanElement>(".cl-count")
    );
    const setCount = (val: string) => {
      countEls.forEach((el) => { el.textContent = val; });
    };

    document.documentElement.style.overflow = "hidden";

    const COUNTER_DURATION = 1400; // ms
    const start    = performance.now();
    let countVal   = 0;
    let assetsReady= false;
    let counterDone= false;

    const maybeExit = () => {
      if (!assetsReady || !counterDone || hasExited.current) return;
      triggerExit();
    };

    // Gate 1: custom fonts
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
        // Trigger cube shine on both panels immediately when counter hits 100
        document.querySelectorAll<HTMLElement>(".cl-3d-scene").forEach((el) => {
          el.classList.add("exiting");
        });
        // 220ms pause: shine builds to peak, then maybeExit fires the split
        setTimeout(() => {
          counterDone = true;
          maybeExit();
        }, 220);
      }
    };
    rafRef.current = requestAnimationFrame(tick);

    // Hard fallback — always exit by 3.5 s
    const hardFallback = setTimeout(() => {
      if (!hasExited.current) triggerExit();
    }, 3500);

    // ---------------------------------------------------------------------------
    // Exit: pure panel split — content is carried by each panel as it slides
    // ---------------------------------------------------------------------------
    function triggerExit() {
      if (hasExited.current) return;
      hasExited.current = true;

      if (!panelL || !panelR) { finalize(); return; }

      // Signal Hero CSS animations to start running
      document.documentElement.classList.add("loader-exiting");

      gsap.timeline({ onComplete: finalize })
        .to(panelL, { xPercent: -100, duration: 0.85, ease: "power3.inOut" }, 0)
        .to(panelR, { xPercent:  100, duration: 0.85, ease: "power3.inOut" }, 0);
    }

    function finalize() {
      document.documentElement.style.overflow = "";
      document.documentElement.classList.remove("loader-exiting");
      document.documentElement.classList.add("loader-complete");
      // Hide instead of unmount to avoid React re-render tearing
      if (wrapperRef.current) wrapperRef.current.style.display = "none";
    }

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(fontFallback);
      clearTimeout(hardFallback);
      if (panelL) gsap.killTweensOf(panelL);
      if (panelR) gsap.killTweensOf(panelR);
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

      {/* LEFT PANEL — clips content to its half (left 50vw) */}
      <div id="cl-panel-left" ref={panelLeftRef}>
        <span className="cl-panel-label cl-panel-label--left">01 // INIT</span>
        <PanelContent
          side="left"
          nameText={nameText}
          welcomeText={welcomeText}
          isAr={isAr}
        />
      </div>

      {/* RIGHT PANEL — clips content to its half (right 50vw) */}
      <div id="cl-panel-right" ref={panelRightRef}>
        <span className="cl-panel-label cl-panel-label--right">02 // LOAD</span>
        <PanelContent
          side="right"
          nameText={nameText}
          welcomeText={welcomeText}
          isAr={isAr}
        />
      </div>
    </div>
  );
}
