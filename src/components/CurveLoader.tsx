"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export default function CurveLoader({
  onComplete,
  locale = 'en',
  initialLoaded = false,
}: {
  onComplete?: () => void;
  locale?: string;
  initialLoaded?: boolean;
}) {
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(() => {
    if (initialLoaded) return true;
    if (typeof window !== "undefined") {
      try {
        return document.cookie.includes("cl_loaded=true") || sessionStorage.getItem("cl_initial_loaded") === "true";
      } catch {}
    }
    return false;
  });

  const countRef = useRef(0);
  const countElRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  const handleExitComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        document.cookie = "cl_loaded=true; path=/; SameSite=Lax";
        sessionStorage.setItem("cl_initial_loaded", "true");
      } catch {}
    }
    setIsFinished(true);
  }, []);

  // Single source of truth: handles scroll unlock, CSS class, and onComplete callback once
  useEffect(() => {
    if (isFinished) {
      document.documentElement.style.overflow = "";
      document.documentElement.classList.add("cl-loaded");
      if (onComplete) onComplete();
    }
  }, [isFinished, onComplete]);

  // Step 2: run counter animation if active
  useEffect(() => {
    if (isFinished) return;

    // Lock body scroll while loader is active
    document.documentElement.style.overflow = "hidden";

    const duration = 1500;
    const start = performance.now();
    let exitTimeoutId: ReturnType<typeof setTimeout> | null = null;

    const fallbackTimeoutId = setTimeout(() => {
      setIsExiting(true);
    }, 1600);

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const val = Math.floor(eased * 100);

      const el = countElRef.current || document.getElementById("cl-count");
      if (el && val !== countRef.current) {
        countRef.current = val;
        el.textContent = String(val);
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        if (el) el.textContent = "100";
        exitTimeoutId = setTimeout(() => {
          setIsExiting(true);
        }, 100);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(fallbackTimeoutId);
      if (exitTimeoutId) clearTimeout(exitTimeoutId);
    };
  }, [isFinished]);

  // Safety fallback timer for Framer Motion exit animation completion
  useEffect(() => {
    if (!isExiting || isFinished) return;

    const exitSafetyTimer = setTimeout(() => {
      handleExitComplete();
    }, 900);

    return () => clearTimeout(exitSafetyTimer);
  }, [isExiting, isFinished, handleExitComplete]);

  // Don't render if completed
  if (isFinished) {
    return null;
  }

  const isAr = locale === 'ar';
  const nameText = isAr ? "سامي برسوم" : "SAMY BARSOUM";
  const welcomeText = isAr ? "أهلاً بك" : "WELCOME";

  return (
    <div id="cl-wrapper">
      <style>{`
        /* Brutalist Per-Letter Slam Drop — GPU-only (transform + opacity) */
        .cl-welcome-text {
          display: flex;
          justify-content: center;
          overflow: visible;
        }

        .cl-char {
          display: inline-block;
          opacity: 0;
          transform: translateY(-48px) scaleY(1.6);
          animation: cl-char-slam 0.45s cubic-bezier(0.22, 1, 0.36, 1) calc(0.1s + var(--ci, 0) * 0.055s) forwards;
          will-change: transform, opacity;
          transform-origin: top center;
        }

        @keyframes cl-char-slam {
          0%   { opacity: 0; transform: translateY(-48px) scaleY(1.6); }
          55%  { opacity: 1; transform: translateY(5px)  scaleY(0.88); }
          75%  { transform: translateY(-3px) scaleY(1.04); }
          100% { opacity: 1; transform: translateY(0)    scaleY(1); }
        }

        /* Pure CSS 3D Hardware-Accelerated Scene */
        .cl-3d-scene {
          perspective: 800px;
          perspective-origin: 50% 50%;
        }
        
        .cl-3d-cube {
          width: 64px;
          height: 64px;
          position: relative;
          transform-style: preserve-3d;
          animation: cl-cube-spin 2.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          will-change: transform;
        }

        .cl-3d-scene.exiting {
          animation: cl-scene-exit 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cl-3d-scene.exiting .cl-face {
          animation: cl-face-exit 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .cl-3d-scene.exiting .cl-3d-ring {
          border-color: rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
        }

        .cl-face {
          position: absolute;
          width: 64px;
          height: 64px;
          border: 1.5px solid rgba(255, 255, 255, 0.4);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: monospace;
          font-size: 11px;
          font-weight: bold;
          color: rgba(255, 255, 255, 0.7);
          user-select: none;
        }

        .cl-face-front  { transform: translateZ(32px); }
        .cl-face-back   { transform: rotateY(180deg) translateZ(32px); }
        .cl-face-right  { transform: rotateY(90deg) translateZ(32px); }
        .cl-face-left   { transform: rotateY(-90deg) translateZ(32px); }
        .cl-face-top    { transform: rotateX(90deg) translateZ(32px); }
        .cl-face-bottom { transform: rotateX(-90deg) translateZ(32px); }

        /* Outer 3D Dashed Orbit Ring */
        .cl-3d-ring {
          position: absolute;
          width: 130px;
          height: 130px;
          border: 1.5px dashed rgba(255, 255, 255, 0.25);
          border-radius: 50%;
          transform-style: preserve-3d;
          animation: cl-ring-spin 4s linear infinite;
          will-change: transform, border-color, box-shadow;
          transition: border-color 0.4s ease, box-shadow 0.4s ease;
        }

        @keyframes cl-cube-spin {
          0% {
            transform: rotateX(-20deg) rotateY(0deg) rotateZ(0deg);
          }
          50% {
            transform: rotateX(20deg) rotateY(180deg) rotateZ(15deg);
          }
          100% {
            transform: rotateX(-20deg) rotateY(360deg) rotateZ(0deg);
          }
        }

        @keyframes cl-ring-spin {
          0% {
            transform: rotateX(70deg) rotateZ(0deg);
          }
          100% {
            transform: rotateX(70deg) rotateZ(360deg);
          }
        }

        @keyframes cl-scene-exit {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          40% {
            /* Lifts upward smoothly into top space, subtle expansion pulse */
            transform: translateY(-16px) scale(1.08);
            opacity: 1;
          }
          100% {
            /* Implodes smoothly into quantum point away from text */
            transform: translateY(-26px) scale(0);
            opacity: 0;
          }
        }

        @keyframes cl-face-exit {
          0% {
            border-color: rgba(255, 255, 255, 0.4);
            background: rgba(255, 255, 255, 0.04);
            box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.08);
          }
          40% {
            border-color: rgba(255, 255, 255, 0.95);
            background: rgba(255, 255, 255, 0.2);
            box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.5), 0 0 15px rgba(255, 255, 255, 0.4);
          }
          100% {
            border-color: rgba(255, 255, 255, 0);
            background: rgba(255, 255, 255, 0);
            box-shadow: inset 0 0 0px rgba(255, 255, 255, 0);
          }
        }
      `}</style>

      <motion.div
        className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden px-4 text-center select-none ${
          isExiting ? "pointer-events-none" : ""
        }`}
        animate={isExiting ? { y: "-100%" } : { y: "0%" }}
        transition={isExiting ? { duration: 0.8, ease: [0.76, 0, 0.24, 1] } : { duration: 0 }}
        onAnimationComplete={isExiting ? handleExitComplete : undefined}
      >
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-5">
          {/* Pure CSS 3D Wireframe Monolith Scene */}
          <div className={`cl-3d-scene relative flex items-center justify-center py-2${isExiting ? " exiting" : ""}`}>
            <div className="cl-3d-ring pointer-events-none" />
            <div className="cl-3d-cube">
              <div className="cl-face cl-face-front">+</div>
              <div className="cl-face cl-face-back">+</div>
              <div className="cl-face cl-face-right">+</div>
              <div className="cl-face cl-face-left">+</div>
              <div className="cl-face cl-face-top">+</div>
              <div className="cl-face cl-face-bottom">+</div>
            </div>
          </div>

          {/* Name & Status Tag in Middle */}
          <div className="font-mono text-xs sm:text-sm tracking-[0.25em] text-white/60 uppercase flex items-center justify-center gap-2">
            <span>{nameText}</span>
            <span className="text-white/30">•</span>
            <span className="relative inline-grid grid-cols-1 grid-rows-1 text-start font-bold text-white/80">
              <span className={`col-start-1 row-start-1 transition-opacity duration-300 ${isExiting ? "opacity-0" : "opacity-100"}`}>
                {isAr ? "جاري التحميل" : "LOADING"}
              </span>
              <span className={`col-start-1 row-start-1 transition-opacity duration-300 ${isExiting ? "opacity-100" : "opacity-0"}`}>
                {isAr ? "جاهز" : "READY"}
              </span>
            </span>
          </div>

          {/* Central Welcome Text — Brutalist Per-Letter Slam Drop */}
          <h1 className="cl-welcome-text text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-[0.15em] text-white">
            {welcomeText.split('').map((char, i) => (
              <span
                key={i}
                className="cl-char"
                style={{ '--ci': i } as React.CSSProperties}
              >
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
          </h1>

          {/* Counter in Middle */}
          <div className="font-mono text-white leading-none pt-1 flex items-baseline justify-center">
            <span
              ref={countElRef}
              id="cl-count"
              className="font-black tabular-nums tracking-tighter text-4xl sm:text-5xl md:text-6xl"
            >
              0
            </span>
            <span className="text-lg sm:text-xl opacity-50 font-bold ml-1">%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
