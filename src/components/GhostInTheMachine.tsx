"use client";

import { useEffect, useState } from "react";

export default function GhostInTheMachine() {
  const [isTriggered, setIsTriggered] = useState(false);
  const [keyBuffer, setKeyBuffer] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [showAuthor, setShowAuthor] = useState(false);

  const SECRET_CODE = "soren";
  const QUOTE = "Purity of heart is to will one thing.";
  const AUTHOR = "— Søren Kierkegaard";

  // --- THE KEYLOGGER ---
  useEffect(() => {
    if (isTriggered) return; // Stop listening if already active

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore modifier keys to prevent weird buffer states
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      setKeyBuffer((prev) => {
        // Keep only the last 5 characters (length of "exist")
        const newBuffer = (prev + e.key.toLowerCase()).slice(-SECRET_CODE.length);

        if (newBuffer === SECRET_CODE) {
          setIsTriggered(true);
          setKeyBuffer(""); // Clear buffer
        }
        return newBuffer;
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTriggered]);

  // --- THE TYPEWRITER EFFECT & SELF-DESTRUCT ---
  useEffect(() => {
    if (!isTriggered) return;

    // Lock the body scroll when active
    document.body.style.overflow = "hidden";

    let currentIndex = 0;

    // 1. Type out the quote character by character
    const typingInterval = setInterval(() => {
      if (currentIndex <= QUOTE.length) {
        setDisplayedText(QUOTE.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);

        // 2. Reveal the author 500ms after the quote finishes
        setTimeout(() => setShowAuthor(true), 500);

        // 3. Initiate Self-Destruct Sequence (Give them 4 seconds to read it)
        setTimeout(() => {
          setIsTriggered(false);
          setDisplayedText("");
          setShowAuthor(false);
          document.body.style.overflow = "auto";
        }, 3000);
      }
    }, 70); // Speed of typing (100ms per character)

    // Allow the user to press Escape to manually abort
    const handleAbort = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsTriggered(false);
        setDisplayedText("");
        setShowAuthor(false);
        document.body.style.overflow = "auto";
      }
    };

    window.addEventListener("keydown", handleAbort);

    return () => {
      clearInterval(typingInterval);
      window.removeEventListener("keydown", handleAbort);
      document.body.style.overflow = "auto";
    };
  }, [isTriggered]);

  if (!isTriggered) return null;

  return (
    <div className="fixed inset-0 z-[999999] bg-black text-[#00ff00] font-mono flex flex-col items-center justify-center p-6 cursor-none selection:bg-[#00ff00] selection:text-black">

      {/* CRT Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-20"></div>

      <div className="relative z-20 max-w-3xl w-full">
        <p className="text-2xl md:text-4xl leading-relaxed">
          {displayedText}
          <span className="animate-pulse inline-block w-3 h-8 bg-[#00ff00] ml-2 align-middle"></span>
        </p>

        {showAuthor && (
          <p className="text-lg md:text-xl mt-8 text-zinc-500 animate-slide-up">
            {AUTHOR}
          </p>
        )}
      </div>

      <div className="absolute bottom-8 right-8 text-zinc-700 text-xs tracking-widest uppercase">
        Press [ESC] to abort sequence
      </div>
    </div>
  );
}