// src/components/GlitchText.tsx
"use client";

import { useState } from "react";

// Brutalist & Industrial Palette
const COLORS = [
  "#FF0000", // Pure Red
  "#0000FF", // Pure Blue
  "#FFFF00", // Pure Yellow
  "#FF4F00", // Fiery Orange (Matches your Ember Theme)
  "#00FF00", // Terminal Green
];

export default function GlitchText({ text }: { text: string }) {
  return (
    <>
      {text.split("").map((char, index) => (
        <HoverChar key={index} char={char} />
      ))}
    </>
  );
}

function HoverChar({ char }: { char: string }) {
  const [color, setColor] = useState<string | undefined>(undefined);

  const handleMouseEnter = () => {
    // Pick a random brutalist color
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setColor(randomColor);
  };

  const handleMouseLeave = () => {
    // Clear the color state so it falls back to inherit instantly
    setColor(undefined);
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        color: color || "inherit",
        // Instant brutalist timing snap change
        transition: "none",
      }}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
}