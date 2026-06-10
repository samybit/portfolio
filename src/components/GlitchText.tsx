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
  const [hasHovered, setHasHovered] = useState(false);

  const handleMouseEnter = () => {
    // Pick a random brutalist color
    const randomColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setColor(randomColor);
    setHasHovered(true);
  };

  const handleMouseLeave = () => {
    // Clear the color state so it falls back to inherit
    setColor(undefined);
  };

  const handleTransitionEnd = (e: React.TransitionEvent) => {
    if (e.propertyName === "color" && !color) {
      setHasHovered(false);
    }
  };

  return (
    <span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTransitionEnd={handleTransitionEnd}
      style={{
        color: color || "inherit",
        // Only apply the 2s transition delay if this specific character has been hovered
        // AND we are currently transitioning back (color is undefined).
        // Otherwise, no transition (instant switch) to avoid theme toggles lagging!
        transition: color
          ? "color 0.05s ease"
          : hasHovered
            ? "color 0.1s ease 2s"
            : "none",
      }}
      className="inline-block"
    >
      {char === " " ? "\u00A0" : char}
    </span>
  );
}