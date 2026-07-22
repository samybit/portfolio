"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// ─── Constants ──────────────────────────────────────────────────────────────
/** How long (ms) of no scroll events before the thumb disappears when idle. */
const IDLE_TIMEOUT_MS = 800;

// ─── Component ──────────────────────────────────────────────────────────────
export default function LenisProvider({ children }: { children: React.ReactNode }) {
  const thumbRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const isDraggingRef = useRef(false);
  const dragOffsetRef = useRef(0);

  useEffect(() => {
    // ── Suppress Three.js internal deprecation/unmount warnings ────────────
    if (typeof window !== "undefined") {
      const originalLog = console.log;
      const originalWarn = console.warn;

      console.log = (...args: unknown[]) => {
        if (
          typeof args[0] === "string" &&
          args[0].includes("THREE.WebGLRenderer: Context Lost")
        ) {
          return;
        }
        originalLog(...args);
      };

      console.warn = (...args: unknown[]) => {
        if (
          typeof args[0] === "string" &&
          (args[0].includes("THREE.WebGLRenderer: Context Lost") ||
           args[0].includes("THREE.Clock"))
        ) {
          return;
        }
        originalWarn(...args);
      };
    }

    // ── 1. Initialise Lenis ─────────────────────────────────────────────────
    const lenis = new Lenis({
      // Smooth wheel scrolling; do not override native touch inertia
      smoothWheel: true,
      // lerp controls the "glide" feel — 0.1 is the Lenis default
      lerp: 0.1,
    });
    lenisRef.current = lenis;

    // ── 2. RAF loop (official Lenis pattern) ────────────────────────────────
    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // ── 3. Scrollbar thumb position + instant opacity via DOM refs ──────────
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!thumb || !track) return;

    const showThumb = () => {
      thumb.style.opacity = "1";
    };

    const hideThumb = () => {
      if (!isDraggingRef.current) {
        thumb.style.opacity = "0";
      }
    };

    const resetIdleTimer = () => {
      if (idleTimerRef.current !== null) {
        clearTimeout(idleTimerRef.current);
      }
      if (!isDraggingRef.current) {
        idleTimerRef.current = setTimeout(hideThumb, IDLE_TIMEOUT_MS);
      }
    };

    // Lenis fires the 'scroll' event on every RAF frame while scrolling.
    lenis.on("scroll", ({ progress }: { progress: number }) => {
      // Position the thumb proportionally.
      // The thumb itself is 12% of viewport height; we map progress [0,1]
      // to the range [0, 88%] of viewport height so it stays fully on-screen.
      const thumbHeightPercent = 12;
      const travelPercent = (100 - thumbHeightPercent) * progress;
      thumb.style.transform = `translateY(${travelPercent}vh)`;

      showThumb();
      resetIdleTimer();
    });

    // ── 4. Drag & Track Click Handling ─────────────────────────────────────
    const updateScrollFromPointer = (clientY: number) => {
      if (!lenisRef.current) return;
      const thumbHeightPx = window.innerHeight * 0.12;
      const availableTrackHeight = window.innerHeight - thumbHeightPx;
      if (availableTrackHeight <= 0) return;

      const targetThumbTop = clientY - dragOffsetRef.current;
      const progress = Math.max(0, Math.min(1, targetThumbTop / availableTrackHeight));
      const targetScroll = progress * lenisRef.current.limit;

      lenisRef.current.scrollTo(targetScroll, { immediate: true });
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      showThumb();
      updateScrollFromPointer(e.clientY);
    };

    const handlePointerUp = () => {
      if (!isDraggingRef.current) return;
      isDraggingRef.current = false;
      document.body.classList.remove("is-scrolling-drag");

      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);

      resetIdleTimer();
    };

    const handlePointerDown = (e: PointerEvent) => {
      // Ignore touch events to prevent touch scroll conflicts on mobile/tablet touchscreens
      if (e.pointerType === "touch") return;

      e.preventDefault();
      isDraggingRef.current = true;
      showThumb();
      if (idleTimerRef.current !== null) clearTimeout(idleTimerRef.current);

      document.body.classList.add("is-scrolling-drag");

      const thumbRect = thumb.getBoundingClientRect();
      const thumbHeightPx = window.innerHeight * 0.12;

      // Clicked on thumb vs clicked on track
      if (e.clientY >= thumbRect.top && e.clientY <= thumbRect.bottom) {
        dragOffsetRef.current = e.clientY - thumbRect.top;
      } else {
        dragOffsetRef.current = thumbHeightPx / 2;
      }

      updateScrollFromPointer(e.clientY);

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    };

    const handlePointerEnter = () => {
      showThumb();
    };

    const handlePointerLeave = () => {
      if (!isDraggingRef.current) {
        resetIdleTimer();
      }
    };

    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointerenter", handlePointerEnter);
    track.addEventListener("pointerleave", handlePointerLeave);

    // ── 5. Cleanup ──────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;

      if (idleTimerRef.current !== null) {
        clearTimeout(idleTimerRef.current);
      }

      document.body.classList.remove("is-scrolling-drag");

      track.removeEventListener("pointerdown", handlePointerDown);
      track.removeEventListener("pointerenter", handlePointerEnter);
      track.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  return (
    <>
      {children}

      {/*
        ── Brutalist Floating Scrollbar ──────────────────────────────────────
        Fixed interactive overlay on desktop (md+ / fine pointers).
        Hidden on mobile touch screens to prevent touch scroll conflicts.
        z-[9998] keeps it below the CurveLoader (z-[9999]) and Navbar (z-50).
      */}
      <div
        ref={trackRef}
        id="brutalist-scrollbar-track"
        aria-hidden="true"
        className="hidden md:block fixed top-0 right-0 h-screen z-[9998] pointer-events-auto cursor-grab active:cursor-grabbing select-none"
        style={{ width: "16px" }}
      >
        {/* Thumb */}
        <div
          ref={thumbRef}
          id="brutalist-scrollbar-thumb"
          className="absolute top-0 right-0 w-full cursor-grab active:cursor-grabbing"
          style={{
            // 12vh thumb height — bold brutalist floating bar
            height: "12vh",
            // Start hidden — opacity toggled directly via DOM ref without CSS transition
            opacity: 0,
          }}
        />
      </div>
    </>
  );
}
