"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";


// Rose-curve flower configuration to shape the constellation
const ICON_COUNT = 24; // 24 plus signs outlining the flower shape
const PETALS = 6;      // 6-petal flower
const BASE_RADIUS = 100;
const AMPLITUDE = 45;   // Modulates radius between 55px and 145px (compact spread)

// Precompute icon positions in a flower shape path
const RING_ITEMS = Array.from({ length: ICON_COUNT }, (_, i) => {
  const angleRad = (i / ICON_COUNT) * 2 * Math.PI - (Math.PI / 2); // Start from N
  const modulatedRadius = BASE_RADIUS + AMPLITUDE * Math.cos(PETALS * angleRad);
  
  // Stagger delay based on angle to draw the flower around in a circle
  const delay = 0.2 + (i * 0.03); 

  return {
    key: `flower-${i}`,
    x: Math.cos(angleRad) * modulatedRadius,
    y: Math.sin(angleRad) * modulatedRadius,
    delay,
    size: 10, // Constant clean techy size
  };
});

export default function CurveLoader({ onComplete }: { onComplete?: () => void }) {
  const [isExiting, setIsExiting] = useState(false);
  const countRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Direct DOM manipulation for counter - 60fps with zero React overhead
    const el = document.getElementById("cl-count");
    if (!el) return;
    const start = performance.now();
    const duration = 1500; // 1.5s

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      const val = Math.floor(eased * 100);
      if (val !== countRef.current) {
        countRef.current = val;
        el.textContent = String(val);
      }
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        el.textContent = "100";
        setTimeout(() => setIsExiting(true), 150);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const handleExitComplete = () => {
    document.documentElement.style.overflow = "";
    if (onComplete) onComplete();
  };

  return (
    <>
      <style>{`
        @keyframes cl-pulse {
          0%, 100% { transform: scale(0.15); }
          50%       { transform: scale(0.22); }
        }
        @keyframes cl-icon-in {
          from { opacity: 0; transform: translate(calc(var(--ix) * 0.2), calc(var(--iy) * 0.2)) scale(0); }
          to   { opacity: 0.7; transform: translate(var(--ix), var(--iy)) scale(1); }
        }
        @keyframes cl-icon-out {
          from { opacity: 0.7; transform: translate(var(--ix), var(--iy)) scale(1); }
          to   { opacity: 0; transform: translate(calc(var(--ix) * 3), calc(var(--iy) * 3)) scale(0); }
        }
        @keyframes cl-fadein {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cl-squish-exit {
          0% {
            transform: scale(0.15, 0.15);
            background-color: #ffffff;
            opacity: 1;
          }
          40% {
            transform: scale(0.3, 0.01); /* Squish flat horizontally */
            background-color: #000000;  /* Fade/melt into black background */
            opacity: 0.5;
          }
          100% {
            transform: scale(0, 0);
            background-color: #000000;
            opacity: 0;
          }
        }
        .cl-circle {
          transform: scale(0.15);
          animation: cl-pulse 1s ease-in-out infinite;
          will-change: transform;
        }
        .cl-circle-exit {
          animation: cl-squish-exit 0.4s cubic-bezier(0.76, 0, 0.24, 1) forwards;
        }
        .cl-icon {
          position: absolute;
          left: 50%; top: 50%;
          will-change: transform, opacity;
          animation: cl-icon-in 0.5s cubic-bezier(0.16,1,0.3,1) both;
          animation-delay: var(--d);
        }
        .cl-icon.exiting {
          animation: cl-icon-out 0.4s cubic-bezier(0.76,0,0.24,1) forwards;
          animation-delay: 0s;
        }
        .cl-ui {
          animation: cl-fadein 0.4s ease both;
        }
      `}</style>

      <motion.div
        className="fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden"
        animate={isExiting ? { y: "-100%" } : { y: "0%" }}
        transition={isExiting ? { duration: 0.9, ease: [0.76, 0, 0.24, 1] } : { duration: 0 }}
        onAnimationComplete={isExiting ? handleExitComplete : undefined}
      >
        {/* Constellation of small plus icons in concentric rings */}
        {RING_ITEMS.map(({ key, x, y, delay, size }) => (
          <div
            key={key}
            className={`cl-icon${isExiting ? " exiting" : ""}`}
            style={{
              "--ix": `${x}px`,
              "--iy": `${y}px`,
              "--d": `${delay}s`,
            } as React.CSSProperties}
          >
            <span
              style={{
                fontSize: `${size}px`,
                color: "white",
                fontFamily: "monospace",
                fontWeight: "bold",
                lineHeight: 1,
                userSelect: "none",
                textShadow: "0 0 4px rgba(255,255,255,0.4)",
              }}
            >
              +
            </span>
          </div>
        ))}

        {/* Central pulsing circle */}
        <div
          className={`rounded-full bg-white absolute${isExiting ? " cl-circle-exit" : " cl-circle"}`}
          style={{ width: "40vmin", height: "40vmin" }}
        />

        {/* Counter */}
        <div className="cl-ui fixed bottom-8 left-8 font-mono text-white select-none leading-none"
          style={{ animationDelay: "0.1s" }}>
          <span id="cl-count" className="font-bold tabular-nums tracking-tighter"
            style={{ fontSize: "10vmin" }}>0</span>
          <span style={{ fontSize: "3vmin", opacity: 0.5, marginLeft: 4 }}>%</span>
        </div>

        {/* Site name */}
        <div className="cl-ui fixed top-8 left-8 text-white font-bold uppercase select-none"
          style={{ letterSpacing: "0.3em", fontSize: "clamp(10px,1.2vw,14px)", animationDelay: "0.2s" }}>
          SAMY BARSOUM
        </div>

        {/* Status */}
        <div className="cl-ui fixed top-8 right-8 text-white font-mono uppercase select-none"
          style={{ fontSize: "clamp(9px,1vw,12px)", letterSpacing: "0.15em", opacity: 0.5, animationDelay: "0.3s" }}>
          {isExiting ? "READY" : "LOADING"}
        </div>
      </motion.div>
    </>
  );
}
