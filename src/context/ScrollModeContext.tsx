"use client";

import React, { createContext, useContext, useState, useEffect, useLayoutEffect } from "react";

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

interface ScrollModeContextType {
  isCurtainMode: boolean;
  toggleScrollMode: () => void;
}

const ScrollModeContext = createContext<ScrollModeContextType | undefined>(undefined);

export function ScrollModeProvider({ children }: { children: React.ReactNode }) {
  const [isCurtainMode, setIsCurtainMode] = useState(false);

  useEffect(() => {
    // Optional: Load preference from localStorage
    const savedMode = localStorage.getItem("scrollMode");
    if (savedMode === "curtain") {
      setIsCurtainMode(true);
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (isCurtainMode) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isCurtainMode]);

  const toggleScrollMode = () => {
    setIsCurtainMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("scrollMode", newMode ? "curtain" : "standard");
      return newMode;
    });
  };

  return (
    <ScrollModeContext.Provider value={{ isCurtainMode, toggleScrollMode }}>
      {children}
    </ScrollModeContext.Provider>
  );
}

export function useScrollMode() {
  const context = useContext(ScrollModeContext);
  if (context === undefined) {
    throw new Error("useScrollMode must be used within a ScrollModeProvider");
  }
  return context;
}
