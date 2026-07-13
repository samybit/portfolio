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

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isAnimationsDisabled, setIsAnimationsDisabled] = useState(false);
  const [isReaderMode, setIsReaderMode] = useState(false);

  useEffect(() => {
    const isDisabled = localStorage.getItem("disable-animations") === "true";
    const isReader = localStorage.getItem("reader-mode") === "true";
    setIsAnimationsDisabled(isDisabled);
    setIsReaderMode(isReader);
    if (isDisabled) {
      document.documentElement.classList.add("no-animations");
    } else {
      document.documentElement.classList.remove("no-animations");
    }
  }, []);

  const toggleAnimations = () => {
    setIsAnimationsDisabled((prev) => {
      const newDisabled = !prev;
      localStorage.setItem("disable-animations", newDisabled ? "true" : "false");
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
