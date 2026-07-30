"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";
import { useAnimationConfig } from "@/context/AnimationContext";

// The characters used for the scrambling effect
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function DecryptText({
  text,
  className = ""
}: {
  text: string;
  className?: string;
}) {
  const [scrambledText, setScrambledText] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);
  const { isAnimationsDisabled } = useAnimationConfig();
  const isArabic = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(text);

  // Triggers once when the element comes into the viewport
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    // Skip animation for Arabic text (to prevent breaking cursive letter connection) or when animations are disabled
    if (isArabic || isAnimationsDisabled || !isInView) return;

    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startDecrypt = () => {
      clearInterval(interval);

      // Runs every 30 milliseconds for a rapid, mechanical flicker
      interval = setInterval(() => {
        setScrambledText(
          text
            .split("")
            .map((letter, index) => {
              // Ignore spaces to keep word structure intact
              if (letter === " ") return " ";

              // Reveal the actual character if the iteration has passed its index
              if (index < iteration) {
                return text[index];
              }

              // Otherwise, show a random scrambling character
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        // Stop the interval when the whole word is revealed
        if (iteration >= text.length) {
          clearInterval(interval);
        }

        // Increase iteration (lower number = slower reveal)
        iteration += 1 / 3;
      }, 30);
    };

    startDecrypt();

    return () => clearInterval(interval);
  }, [text, isInView, isAnimationsDisabled, isArabic]);

  if (isArabic) {
    return (
      <span ref={ref} className={`inline-block ${className}`}>
        {text}
      </span>
    );
  }

  // Derived: when animations are disabled (or not yet in view), always show the real text.
  const displayText = isAnimationsDisabled ? text : scrambledText;

  return (
    <span ref={ref} className={`inline-flex items-baseline ${className}`}>
      {text.split("").map((realChar, index) => {
        if (realChar === " ") {
          return (
            <span key={index} className="inline-block whitespace-pre">
              {" "}
            </span>
          );
        }

        const currentChar = displayText[index] || realChar;

        return (
          <span
            key={index}
            className="relative inline-block align-baseline select-none"
          >
            {/* Ghost invisible element: locks the exact layout width of this character */}
            <span className="invisible opacity-0 pointer-events-none" aria-hidden="true">
              {realChar}
            </span>

            {/* Scrambled element: absolute top-0 left-0 cannot affect container layout width */}
            <span className="absolute top-0 left-0 whitespace-nowrap">
              {currentChar}
            </span>
          </span>
        );
      })}
    </span>
  );
}