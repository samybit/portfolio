"use client";

// React wrapper around the carousel. All the WebGL/animation logic lives in
// lib/carousel/engine.js — this component only owns the DOM overlay: the
// heading, the counter, the "View" cursor label and the Close button.
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PROJECTS, ENTRY, UI_ANIM } from "@/lib/carousel/config";
import { createCarousel } from "@/lib/carousel/engine";
import { createCarouselGui } from "@/lib/carousel/gui";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

const CarouselSection = ({ footer }) => {
  const mountRef = useRef(null); // engine mounts its canvas here
  const cursorRef = useRef(null); // trailing "View" label, moved by the engine
  const topTextRef = useRef(null); // brand/desc — GSAP-animated on focus
  const counterRef = useRef(null); // 01/12 counter — GSAP-animated on focus
  const footerOverlayRef = useRef(null); // footer overlay bar — GSAP-animated on focus
  const engineRef = useRef(null); // createCarousel() handle
  const revealPlayedRef = useRef(false); // entry reveal fade runs exactly once

  const isNeumorphic = useNeumorphicTheme();
  const [active, setActive] = useState(0); // index of the centered image
  const [focused, setFocused] = useState(false); // a focus session is open
  const [entryDone, setEntryDone] = useState(false); // entry fully settled

  // ---- keyboard navigation listener ----
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;

      if (e.key === "Escape") {
        engineRef.current?.closeFocus();
      } else if (e.key === "Enter") {
        engineRef.current?.openFocus();
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        engineRef.current?.nextPanel();
      } else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        engineRef.current?.prevPanel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // ---- engine lifecycle ----
  useEffect(() => {
    if (!mountRef.current) return;
    const engine = createCarousel(mountRef.current, {
      cursorElement: cursorRef.current,
      onActiveChange: setActive,
      onFocusChange: setFocused,
      onEntryDone: setEntryDone,
    });
    engineRef.current = engine;
    engine.setTheme({ isNeumorphic });
    const gui = createCarouselGui(engine); // dev panel (hidden by default)
    return () => {
      gui.destroy();
      engine.destroy();
      engineRef.current = null;
    };
  }, [isNeumorphic]);

  // ---- theme change listener ----
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.setTheme({ isNeumorphic });
    }
  }, [isNeumorphic]);

  // ---- overlay text transitions ----
  // GSAP-driven so they share the canvas animations' easing vocabulary.
  useEffect(() => {
    if (!topTextRef.current || !counterRef.current) return;
    if (!entryDone && ENTRY.enabled) {
      gsap.set([topTextRef.current, counterRef.current], { autoAlpha: 0 });
      revealPlayedRef.current = false;
      return; // stay hidden until entry settles
    }
    gsap.set(topTextRef.current, { xPercent: -50 }); // GSAP owns the transform
    gsap.set(counterRef.current, { xPercent: -50 });
    const y = focused ? (UI_ANIM.topShiftVh / 100) * window.innerHeight : 0;

    if (entryDone && !focused && !revealPlayedRef.current) {
      revealPlayedRef.current = true;
      gsap.fromTo(
        topTextRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: UI_ANIM.revealDuration,
          ease: UI_ANIM.revealEase,
        },
      );
      gsap.fromTo(
        counterRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: UI_ANIM.revealDuration,
          ease: UI_ANIM.revealEase,
          delay: UI_ANIM.revealStagger,
        },
      );
      return;
    }

    // focus toggle transitions (quicker)
    gsap.to(topTextRef.current, {
      y,
      autoAlpha: 1,
      duration: UI_ANIM.duration,
      ease: UI_ANIM.ease,
    });
    gsap.to([counterRef.current, footerOverlayRef.current], {
      autoAlpha: focused ? 0 : 1,
      duration: UI_ANIM.duration,
      ease: UI_ANIM.ease,
    });
  }, [focused, entryDone]);

  const controlBadgeStyle = isNeumorphic
    ? "border border-[#a3b1c6] bg-[#e0e5ec] text-[#374151] shadow-[2px_2px_4px_rgba(163,177,198,0.6),_-2px_-2px_4px_rgba(255,255,255,0.5)]"
    : "border border-white/40 bg-zinc-900/90 text-white";

  return (
    <div
      ref={mountRef}
      className={`h-screen relative w-screen touch-pan-y select-none overflow-hidden transition-colors duration-300 ${
        isNeumorphic ? "bg-[#e0e5ec]" : "bg-black"
      }`}
    >
      <div
        ref={topTextRef}
        className={`absolute px-4 left-1/2 -translate-x-1/2 w-[92vw] max-w-2xl top-[12%] sm:top-[15%] text-center z-20 pointer-events-none ${
          isNeumorphic ? "text-[#1f2937]" : "text-white"
        }`}
        style={ENTRY.enabled ? { opacity: 0, visibility: "hidden" } : undefined}
      >
        <div className="flex flex-col items-center justify-center text-center">
          <p className={`text-center text-base sm:text-lg font-bold tracking-wide break-words max-w-full ${
            isNeumorphic ? "text-[#111827]" : "text-white"
          }`}>
            {PROJECTS[active].brand}
          </p>
          <p className={`text-center text-xs sm:text-sm mt-[3px] break-words max-w-lg mx-auto leading-normal ${
            isNeumorphic ? "text-[#4b5563]" : "text-white/80"
          }`}>
            {PROJECTS[active].desc}
          </p>
        </div>
      </div>

      <div
        ref={counterRef}
        className={`absolute px-4 left-1/2 bottom-[16%] text-center whitespace-nowrap z-20 ${
          isNeumorphic ? "text-[#1f2937]" : "text-white"
        }`}
        style={ENTRY.enabled ? { opacity: 0, visibility: "hidden" } : undefined}
      >
        <p className={`text-center text-base font-bold tracking-widest drop-shadow-md ${
          isNeumorphic ? "text-[#111827]" : "text-white"
        }`}>
          {String(active + 1).padStart(2, "0")}/
          {String(PROJECTS.length).padStart(2, "0")}
        </p>

        {/* Desktop Controls Guide */}
        <div className={`mt-2 hidden sm:flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider ${
          isNeumorphic ? "text-[#4b5563]" : "text-white/90"
        }`}>
          <span className={`px-1.5 py-0.5 shadow-xs ${controlBadgeStyle}`}>← / →</span>
          <span className={`px-1.5 py-0.5 shadow-xs ${controlBadgeStyle}`}>A / D</span>
          <span className="opacity-40">•</span>
          <span className={`px-1.5 py-0.5 shadow-xs ${controlBadgeStyle}`}>ENTER</span>
          <span className="opacity-40">•</span>
          <span className={`px-1.5 py-0.5 shadow-xs ${controlBadgeStyle}`}>ESC</span>
        </div>

        {/* Mobile Controls Guide */}
        <div className={`mt-2 sm:hidden flex items-center justify-center gap-2 text-[10px] font-mono font-bold uppercase tracking-wider ${
          isNeumorphic ? "text-[#4b5563]" : "text-white/90"
        }`}>
          <span className={`px-2 py-0.5 shadow-xs ${controlBadgeStyle}`}>SWIPE ← / →</span>
          <span className="opacity-40">•</span>
          <span className={`px-2 py-0.5 shadow-xs ${controlBadgeStyle}`}>TAP TO VIEW</span>
        </div>
      </div>

      <div
        ref={cursorRef}
        className="fixed top-4 left-4 z-50 pointer-events-none text-white text-sm whitespace-nowrap mix-blend-exclusion"
        style={{ willChange: "transform" }}
      >
        View
      </div>

      <button
        type="button"
        onClick={() => engineRef.current?.closeFocus()}
        aria-label="Close image view (press Esc)"
        className={`absolute bottom-20 left-1/2 -translate-x-1/2 sm:bottom-auto sm:left-auto sm:translate-x-0 sm:top-8 sm:right-8 z-40 px-5 py-2.5 sm:px-4 sm:py-2 font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 flex items-center gap-2 cursor-pointer ${
          isNeumorphic
            ? "bg-[#e0e5ec] text-[#111827] border-2 border-[#a3b1c6] shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]"
            : "bg-white text-black border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#ffffff] hover:bg-black hover:text-white hover:border-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#ffffff] active:translate-x-1 active:translate-y-1 active:shadow-none"
        } ${
          focused ? "opacity-100 pointer-events-auto scale-100" : "opacity-0 pointer-events-none scale-95"
        }`}
      >
        <span className="text-base font-black">✕</span>
        <span>CLOSE</span>
        <span className="text-[10px] font-mono opacity-60 hidden sm:inline-block ms-1 border border-current px-1 py-0.5">[ESC]</span>
      </button>

      {footer && (
        <div ref={footerOverlayRef} className="absolute bottom-0 left-0 right-0 z-30 pointer-events-auto">
          {footer}
        </div>
      )}
    </div>
  );
};

export default CarouselSection;
