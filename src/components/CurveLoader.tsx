"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { DiaTextReveal } from "@/components/ui/dia-text-reveal";

export default function CurveLoader({ onComplete, locale = 'en' }: { onComplete?: () => void; locale?: string }) {
  const [isExiting, setIsExiting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const countRef = useRef(0);
  const countElRef = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const duration = 1500; // 1.5s
    const start = performance.now();
    let exitTimeoutId: ReturnType<typeof setTimeout> | null = null;

    // Guaranteed Safety Fallback Timer: triggers exit at 1800ms even if RAF or hydration fails
    const fallbackTimeoutId = setTimeout(() => {
      setIsExiting(true);
    }, 1800);

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
        }, 150);
      }
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      clearTimeout(fallbackTimeoutId);
      if (exitTimeoutId) clearTimeout(exitTimeoutId);
    };
  }, []);

  const handleExitComplete = () => {
    document.documentElement.style.overflow = "";
    setIsFinished(true);
    if (onComplete) onComplete();
  };

  if (isFinished) {
    return null;
  }

  const isAr = locale === 'ar';
  const nameText = isAr ? "سامي برسوم" : "SAMY BARSOUM";
  const statusText = isExiting ? (isAr ? "جاهز" : "READY") : (isAr ? "جاري التحميل" : "LOADING");

  return (
    <>
      <style>{`
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

        .cl-3d-cube.exiting {
          animation: cl-cube-exit 0.8s cubic-bezier(0.76, 0, 0.24, 1) forwards;
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
          will-change: transform;
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

        @keyframes cl-cube-exit {
          0% {
            transform: scale(1) translateZ(0);
            opacity: 1;
          }
          100% {
            transform: scale(2.8) translateZ(350px);
            opacity: 0;
          }
        }
      `}</style>

      <motion.div
        className={`fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden px-4 text-center select-none ${
          isExiting ? "pointer-events-none" : ""
        }`}
        animate={isExiting ? { y: "-100%" } : { y: "0%" }}
        transition={isExiting ? { duration: 0.9, ease: [0.76, 0, 0.24, 1] } : { duration: 0 }}
        onAnimationComplete={isExiting ? handleExitComplete : undefined}
      >
        <div className="flex flex-col items-center justify-center space-y-4 md:space-y-5">
          {/* Pure CSS 3D Wireframe Monolith Scene */}
          <div className="cl-3d-scene relative flex items-center justify-center py-2">
            <div className="cl-3d-ring pointer-events-none" />
            <div className={`cl-3d-cube${isExiting ? " exiting" : ""}`}>
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
            <span className="text-white/80 font-bold">{statusText}</span>
          </div>

          {/* Central Welcome Text with DiaTextReveal */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-[0.15em] text-white">
            <DiaTextReveal
              text={isAr ? "أهلاً بك" : "Welcome"}
              textColor="#ffffff"
              colors={["#ffffff", "#888888", "#ffffff", "#aaaaaa", "#ffffff"]}
              duration={1.2}
              delay={0.2}
            />
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
    </>
  );
}
