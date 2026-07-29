"use client";

// React wrapper around the carousel. All the WebGL/animation logic lives in
// lib/carousel/engine.js — this component only owns the DOM overlay: the
// heading, the counter, the "View" cursor label and the Close button.
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { PROJECTS, ENTRY, UI_ANIM } from "@/lib/carousel/config";
import { createCarousel } from "@/lib/carousel/engine";
import { createCarouselGui } from "@/lib/carousel/gui";

// The carousel is a desktop experience (wheel-driven, heavy shader work).
// At this viewport width or below we show a plain black screen instead.
const MIN_VIEWPORT_WIDTH = 1025; // px

const CarouselSection = ({ footer }) => {
  const mountRef = useRef(null); // engine mounts its canvas here
  const cursorRef = useRef(null); // trailing "View" label, moved by the engine
  const topTextRef = useRef(null); // brand/desc — GSAP-animated on focus
  const counterRef = useRef(null); // 01/12 counter — GSAP-animated on focus
  const footerOverlayRef = useRef(null); // footer overlay bar — GSAP-animated on focus
  const engineRef = useRef(null); // createCarousel() handle
  const revealPlayedRef = useRef(false); // entry reveal fade runs exactly once

  const [active, setActive] = useState(0); // index of the centered image
  const [focused, setFocused] = useState(false); // a focus session is open
  const [entryDone, setEntryDone] = useState(false); // entry fully settled
  // "pending" until we know the viewport (SSR-safe), then "ok" | "small"
  const [screen, setScreen] = useState("pending");

  // ---- viewport gate ----
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MIN_VIEWPORT_WIDTH - 1}px)`);
    const update = () => setScreen(mq.matches ? "small" : "ok");
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
    if (screen !== "ok") return; // never boot WebGL on small screens
    const engine = createCarousel(mountRef.current, {
      cursorElement: cursorRef.current,
      onActiveChange: setActive,
      onFocusChange: setFocused,
      onEntryDone: setEntryDone,
    });
    engineRef.current = engine;
    const gui = createCarouselGui(engine); // dev panel (hidden by default)
    return () => {
      gui.destroy();
      engine.destroy();
      engineRef.current = null;
    };
  }, [screen]);

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
      // premium settle reveal: slow gentle fade only (no movement), counter
      // trailing the top text slightly. Runs ONCE after entry — closing focus
      // must not replay it (the heading would blink out and fade back in).
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

  // small screens: a plain black holding screen instead of the carousel.
  // "pending" (first paint, viewport not measured yet) stays black too so
  // mobile users never see a flash of the desktop experience booting.
  if (screen !== "ok") {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        {screen === "small" && (
          <p className="px-8 text-center text-sm text-white/70">
            This experience is designed for larger screens.
            <br />
            Please visit on a display wider than 1024px.
          </p>
        )}
      </div>
    );
  }

  return (
    <div ref={mountRef} className="h-screen relative w-screen bg-white">
      <div
        ref={topTextRef}
        className="absolute px-4 left-1/2 top-[15%] mix-blend-exclusion text-white"
        style={ENTRY.enabled ? { opacity: 0, visibility: "hidden" } : undefined}
      >
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-base">{PROJECTS[active].brand}</p>
          <p className="text-center">{PROJECTS[active].desc}</p>
        </div>
      </div>

      <div
        ref={counterRef}
        className="absolute px-4 left-1/2 bottom-[16%] text-black text-center whitespace-nowrap z-20"
        style={ENTRY.enabled ? { opacity: 0, visibility: "hidden" } : undefined}
      >
        <p className="text-center text-base font-bold">
          {String(active + 1).padStart(2, "0")}/
          {String(PROJECTS.length).padStart(2, "0")}
        </p>
        <div className="mt-2 flex items-center justify-center gap-1.5 text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-black/75">
          <span className="border border-black/60 px-1 py-0.5 bg-white/70 shadow-xs">← / →</span>
          <span className="border border-black/60 px-1 py-0.5 bg-white/70 shadow-xs">A / D</span>
          <span className="opacity-40">•</span>
          <span className="border border-black/60 px-1 py-0.5 bg-white/70 shadow-xs">ENTER</span>
          <span className="opacity-40">•</span>
          <span className="border border-black/60 px-1 py-0.5 bg-white/70 shadow-xs">ESC</span>
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
        className={`absolute top-6 right-6 sm:top-8 sm:right-8 z-40 px-4 py-2 bg-white text-black font-black text-xs sm:text-sm uppercase tracking-wider border-3 sm:border-4 border-black shadow-[4px_4px_0px_0px_#000000] hover:bg-black hover:text-white hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all duration-200 flex items-center gap-2 cursor-pointer ${
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
