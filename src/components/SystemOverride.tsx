"use client";

import { useEffect, useRef, useState } from "react";
import { playMechanicalClick } from "@/utils/audio";

export default function SystemOverride() {
  const [isActive, setIsActive] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  // We track the mouse position even before the click so the circle spawns exactly on target
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      // If active, update the physical DOM element instantly for zero-lag tracking
      if (cursorRef.current) {
        // -16px offsets it so the dead-center of the 32x32 SVG is exactly on your pointer
        cursorRef.current.style.transform = `translate(${e.clientX - 16}px, ${e.clientY - 16}px)`;
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) { // Middle click
        document.documentElement.classList.add("system-override");
        setIsActive(true);
        // PLAY SNAP (true = press down)
        playMechanicalClick(true);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        document.documentElement.classList.remove("system-override");
        setIsActive(false);
        // PLAY SNAP (false = release)
        playMechanicalClick(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {isActive && (
        <div
          ref={cursorRef}
          // pointer-events-none ensures it doesn't block your clicks
          // z-[9999] forces it to render above literally everything on the site
          className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999]"
          style={{
            transform: `translate(${mousePos.current.x - 16}px, ${mousePos.current.y - 16}px)`,
            willChange: "transform",
          }}
        >
          {/* Our Physical Brutalist Target */}
          <svg width="32" height="32" viewBox="0 0 32 32">
            <circle cx="16" cy="16" r="14" fill="black" stroke="white" strokeWidth="2" />
            <circle cx="16" cy="16" r="4" fill="white" />
          </svg>
        </div>
      )}
    </>
  );
}