// src/context/AnimationContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MotionConfig } from "framer-motion";

interface AnimationContextType {
  isAnimationsDisabled: boolean;
  toggleAnimations: () => void;
  isReaderMode: boolean;
  toggleReaderMode: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({
  children,
  initialDisabled = false,
}: {
  children: React.ReactNode;
  initialDisabled?: boolean;
}) {
  const [isAnimationsDisabled, setIsAnimationsDisabled] = useState(() => {
    // On the server, fall back to the SSR-provided cookie value.
    if (typeof window === "undefined") return initialDisabled;
    // On the client, localStorage is the authoritative source for the toggle.
    const stored = localStorage.getItem("disable-animations");
    return stored !== null ? stored === "true" : initialDisabled;
  });

  const [isReaderMode, setIsReaderMode] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("reader-mode") === "true";
  });

  // If the value derived from localStorage differs from what the server stamped
  // on <html>, reconcile the DOM class. This is the only side-effect needed on mount.
  useEffect(() => {
    if (isAnimationsDisabled) {
      document.documentElement.classList.add("no-animations");
    } else {
      document.documentElement.classList.remove("no-animations");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleAnimations = () => {
    setIsAnimationsDisabled((prev) => {
      const newDisabled = !prev;
      localStorage.setItem("disable-animations", newDisabled ? "true" : "false");
      // Mirror to a cookie so the server can read it during SSR and apply
      // the `no-animations` class directly on <html> without any inline script.
      const cookieValue = newDisabled ? "true" : "false";
      document.cookie = `disable-animations=${cookieValue}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
      const html = document.documentElement;
      if (newDisabled) {
        html.classList.add("no-animations");
      } else {
        html.classList.remove("no-animations");
      }
      return newDisabled;
    });
  };

  const toggleReaderMode = () => {
    setIsReaderMode((prev) => {
      const next = !prev;
      localStorage.setItem("reader-mode", next ? "true" : "false");
      return next;
    });
  };

  return (
    <AnimationContext.Provider value={{ isAnimationsDisabled, toggleAnimations, isReaderMode, toggleReaderMode }}>
      <MotionConfig reducedMotion={isAnimationsDisabled ? "always" : "user"}>
        {children}
      </MotionConfig>
    </AnimationContext.Provider>
  );
}

export function useAnimationConfig() {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error("useAnimationConfig must be used within an AnimationProvider");
  }
  return context;
}
