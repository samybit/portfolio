"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function MouseFollower() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouch] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  });

  useEffect(() => {
    if (isTouch) return;

    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      // Offset position +16px right and +16px down so it floats to the bottom-right of the cursor
      targetPos.current = { x: e.clientX + 16, y: e.clientY + 16 };
      if (!isVisible) setIsVisible(true);
    };

    const onMouseLeave = () => {
      setIsVisible(false);
    };

    const onMouseEnter = () => {
      setIsVisible(true);
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest(
        'a, button, input, select, textarea, label, [role="button"], [data-cursor="pointer"]'
      );
      
      const computedCursor = window.getComputedStyle(target).cursor;
      const isPointerCursor = interactive !== null || computedCursor === "pointer";

      setIsPointer(isPointerCursor);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    window.addEventListener("mouseenter", onMouseEnter, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });

    // Smooth trailing animation loop (60-120 FPS)
    const render = () => {
      const lerp = 0.2;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp;

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mouseenter", onMouseEnter);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible, isTouch]);

  if (isTouch) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 pointer-events-none z-[999999] transition-opacity duration-200 ease-out ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        willChange: "transform",
        top: 0,
        left: 0,
      }}
    >
      <div className="relative w-10 h-10 md:w-11 md:h-11">
        {/* Default Cursor Follower PNG */}
        <Image
          src="/cursor/cursor-default.png"
          alt=""
          width={146}
          height={150}
          priority
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-200 ${
            isPointer ? "opacity-0 scale-75" : "opacity-100 scale-100"
          }`}
        />

        {/* Pointer Cursor Follower PNG */}
        <Image
          src="/cursor/cursor-pointer.png"
          alt=""
          width={146}
          height={150}
          priority
          className={`absolute inset-0 w-full h-full object-contain transition-all duration-200 ${
            isPointer ? "opacity-100 scale-100" : "opacity-0 scale-75"
          }`}
        />
      </div>
    </div>
  );
}
