"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BrutalistScrollbar from "./BrutalistScrollbar";

interface CurtainScrollerProps {
  children: React.ReactNode;
}

export default function CurtainScroller({ children }: CurtainScrollerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sections = React.Children.toArray(children);
  const totalSections = sections.length;
  
  const isScrolling = useRef(false);
  const touchStartY = useRef(0);
  const touchStartX = useRef(0);

  const goToNext = () => {
    if (currentIndex < totalSections - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (isScrolling.current) return;
    
    // Ignore if it's more horizontal than vertical (e.g., swiping a slider inside Projects)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

    isScrolling.current = true;
    if (e.deltaY > 50) {
      goToNext();
    } else if (e.deltaY < -50) {
      goToPrev();
    }
    
    // Throttle to prevent rapid skipping
    setTimeout(() => {
      isScrolling.current = false;
    }, 1000); 
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isScrolling.current) return;

    const touchEndY = e.touches[0].clientY;
    const touchEndX = e.touches[0].clientX;
    const deltaY = touchStartY.current - touchEndY;
    const deltaX = touchStartX.current - touchEndX;

    // Ignore horizontal swipes
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;

    if (deltaY > 50) { // Swipe up -> next
      goToNext();
      isScrolling.current = true;
      setTimeout(() => isScrolling.current = false, 1000);
    } else if (deltaY < -50) { // Swipe down -> prev
      goToPrev();
      isScrolling.current = true;
      setTimeout(() => isScrolling.current = false, 1000);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;
      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        isScrolling.current = true;
        goToNext();
        setTimeout(() => isScrolling.current = false, 1000);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        isScrolling.current = true;
        goToPrev();
        setTimeout(() => isScrolling.current = false, 1000);
      }
    };

    window.addEventListener("keydown", handleKeyDown, { passive: false });
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, totalSections]);

  useEffect(() => {
    const handleCurtainNavigate = (e: Event) => {
      const customEvent = e as CustomEvent<number>;
      if (typeof customEvent.detail === 'number') {
        setCurrentIndex(customEvent.detail);
      }
    };
    window.addEventListener('curtainNavigate', handleCurtainNavigate);
    return () => window.removeEventListener('curtainNavigate', handleCurtainNavigate);
  }, []);

  return (
    <div 
      className="fixed inset-0 w-full h-[100svh] overflow-hidden bg-black"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
    >
      <AnimatePresence>
        {sections.map((section, index) => {
          // Sections are stacked. 
          // The first section has the highest z-index, the last has the lowest.
          const zIndex = (totalSections - index) * 10;
          
          // If a section is "past" (index < currentIndex), it lifts up (-100%) to reveal what's under.
          // If a section is active or upcoming, it remains at 0%.
          const isPast = index < currentIndex;

          return (
            <motion.div
              key={index}
              className="absolute inset-0 w-full h-full bg-white shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              style={{ zIndex }}
              initial={false}
              animate={{ 
                y: isPast ? "-100%" : "0%"
              }}
              transition={{ 
                duration: 1.2, 
                ease: [0.76, 0, 0.24, 1] // Super smooth Apple-like bezier curve
              }}
            >
              {/* Added h-full and overflow-y-auto so content inside the section can still scroll if it's taller than 100svh */}
              <div className="w-full h-full overflow-y-auto hide-scrollbar pr-4 md:pr-6 lg:pr-8">
                {section}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      <BrutalistScrollbar 
        totalSections={totalSections} 
        currentIndex={currentIndex} 
        onSeek={setCurrentIndex} 
      />
    </div>
  );
}
