// src/components/GlitchText.tsx
"use client";

import { useState, useRef, useEffect } from "react";

// Premium Brutalist / Cyberpunk Palette (high-contrast on both white and black backgrounds)
const COLORS = [
  "#FF4F00", // Fiery Orange (Matches Ember Theme)
  "#00B0FF", // Vivid Electric Blue
  "#00E676", // Toxic/Neon Green
  "#BD00FF", // Synthwave Purple
  "#FF2A85", // Neon Rose/Pink
];

let colorIndex = 0;

export default function GlitchText({ text }: { text: string }) {
  const isArabic = /[\u0600-\u06FF]/.test(text);
  const parts = isArabic ? text.split(/(\s+)/) : text.split("");
  return (
    <>
      {parts.map((char, index) => (
        <HoverChar key={index} char={char} />
      ))}
    </>
  );
}

function HoverChar({ char }: { char: string }) {
  const [color, setColor] = useState<string | undefined>(undefined);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastHoverRef = useRef<number>(0);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const now = Date.now();
    if (now - lastHoverRef.current < 150) return; // Prevent repaint infinite render loops
    lastHoverRef.current = now;

    const nextColor = COLORS[colorIndex];
    colorIndex = (colorIndex + 1) % COLORS.length;
    setColor(nextColor);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setColor(undefined);
    }, 2000); // 2-second delay on mouse leave before snapping back
  };

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: color || "inherit",
        // Instant color change on hover, smooth 0.1s transition when the JS timer clears it
        transition: color ? "none" : "color 0.1s ease",
      }}
      className="relative z-10"
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
}