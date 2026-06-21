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
    <div className="fixed inset-0 w-full h-[100svh] overflow-hidden bg-black">
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
              <div 
                className="w-full h-full overflow-y-auto hide-scrollbar pr-4 md:pr-6 lg:pr-8"
                onWheel={(e) => {
                  const target = e.currentTarget;
                  const isAtTop = target.scrollTop <= 0;
                  const isAtBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <= 2;

                  if (Math.abs(e.deltaY) < 5) return; // ignore tiny inertial trackpad ticks

                  if (e.deltaY < 0 && isAtTop) {
                    if (!isScrolling.current && currentIndex > 0) {
                      isScrolling.current = true;
                      goToPrev();
                      setTimeout(() => isScrolling.current = false, 1000);
                    }
                  } else if (e.deltaY > 0 && isAtBottom) {
                    if (!isScrolling.current && currentIndex < totalSections - 1) {
                      isScrolling.current = true;
                      goToNext();
                      setTimeout(() => isScrolling.current = false, 1000);
                    }
                  }
                }}
                onTouchStart={(e) => {
                  touchStartY.current = e.touches[0].clientY;
                  touchStartX.current = e.touches[0].clientX;
                }}
                onTouchMove={(e) => {
                  const target = e.currentTarget;
                  const isAtTop = target.scrollTop <= 0;
                  const isAtBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <= 2;

                  const touchEndY = e.touches[0].clientY;
                  const touchEndX = e.touches[0].clientX;
                  const deltaY = touchStartY.current - touchEndY;
                  const deltaX = touchStartX.current - touchEndX;

                  if (Math.abs(deltaX) > Math.abs(deltaY)) return; // horizontal swipe

                  if (deltaY < -30 && isAtTop) {
                    // Swipe down at the top -> previous section
                    if (!isScrolling.current && currentIndex > 0) {
                      isScrolling.current = true;
                      goToPrev();
                      setTimeout(() => isScrolling.current = false, 1000);
                    }
                  } else if (deltaY > 30 && isAtBottom) {
                    // Swipe up at the bottom -> next section
                    if (!isScrolling.current && currentIndex < totalSections - 1) {
                      isScrolling.current = true;
                      goToNext();
                      setTimeout(() => isScrolling.current = false, 1000);
                    }
                  }
                }}
              >
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
