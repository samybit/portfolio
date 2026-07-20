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

  return (
    <motion.div
      className={`fixed inset-0 z-[9999] bg-black flex items-center justify-center overflow-hidden ${
        isExiting ? "pointer-events-none" : ""
      }`}
      animate={isExiting ? { y: "-100%" } : { y: "0%" }}
      transition={isExiting ? { duration: 0.9, ease: [0.76, 0, 0.24, 1] } : { duration: 0 }}
      onAnimationComplete={isExiting ? handleExitComplete : undefined}
    >
      {/* Central Welcome Text with DiaTextReveal */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10">
        <h1 className="text-4xl md:text-7xl font-black uppercase tracking-[0.2em] text-white">
          <DiaTextReveal
            text={locale === 'ar' ? "أهلاً بك" : "Welcome"}
            textColor="#ffffff"
            colors={["#ffffff", "#888888", "#ffffff", "#aaaaaa", "#ffffff"]}
            duration={1.2}
            delay={0.2}
          />
        </h1>
      </div>

      {/* Counter */}
      <div className="fixed bottom-8 left-8 font-mono text-white select-none leading-none opacity-80">
        <span
          ref={countElRef}
          id="cl-count"
          className="font-bold tabular-nums tracking-tighter"
          style={{ fontSize: "10vmin" }}
        >
          0
        </span>
        <span style={{ fontSize: "3vmin", opacity: 0.5, marginLeft: 4 }}>%</span>
      </div>

      {/* Site name */}
      <div
        className="fixed top-8 left-8 text-white font-bold uppercase select-none opacity-80"
        style={{ letterSpacing: "0.3em", fontSize: "clamp(10px,1.2vw,14px)" }}
      >
        {locale === 'ar' ? "سامي برسوم" : "SAMY BARSOUM"}
      </div>

      {/* Status */}
      <div
        className="fixed top-8 right-8 text-white font-mono uppercase select-none"
        style={{ fontSize: "clamp(9px,1vw,12px)", letterSpacing: "0.15em", opacity: 0.5 }}
      >
        {isExiting ? (locale === 'ar' ? "جاهز" : "READY") : (locale === 'ar' ? "جاري التحميل" : "LOADING")}
      </div>
    </motion.div>
  );
}
