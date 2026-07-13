// src/context/AnimationContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MotionConfig } from "framer-motion";

interface AnimationContextType {
  isAnimationsDisabled: boolean;
  toggleAnimations: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: React.ReactNode }) {
  const [isAnimationsDisabled, setIsAnimationsDisabled] = useState(false);

  useEffect(() => {
    // Check initial state from document.documentElement or localStorage
    const isDisabled = localStorage.getItem("disable-animations") === "true";
    setIsAnimationsDisabled(isDisabled);
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

  return (
    <AnimationContext.Provider value={{ isAnimationsDisabled, toggleAnimations }}>
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
