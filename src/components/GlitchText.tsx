// src/components/GlitchText.tsx
"use client";

import { useState, useRef, useEffect } from "react";

// Brutalist & Industrial Palette
const COLORS = [
  "#FF0000", // Pure Red
  "#0000FF", // Pure Blue
  "#FFFF00", // Pure Yellow
  "#FF4F00", // Fiery Orange (Matches your Ember Theme)
  "#00FF00", // Terminal Green
];

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

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setColor(randomColor);
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