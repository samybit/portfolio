"use client";

import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

// The characters used for the scrambling effect
const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

export default function DecryptText({
  text,
  className = ""
}: {
  text: string;
  className?: string;
}) {
  const [displayText, setDisplayText] = useState(text);
  const ref = useRef<HTMLSpanElement>(null);

  // Triggers once when the element comes into the viewport
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  useEffect(() => {
    if (!isInView) return;

    let iteration = 0;
    let interval: NodeJS.Timeout;

    const startDecrypt = () => {
      clearInterval(interval);

      // Runs every 30 milliseconds for a rapid, mechanical flicker
      interval = setInterval(() => {
        setDisplayText((oldText) => {
          return text
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
            .join("");
        });

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
  }, [text, isInView]);

  return (
    <span ref={ref} className={className}>
      {displayText}
    </span>
  );
}