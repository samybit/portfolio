"use client";

import React, { useRef, useState, useEffect } from "react";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

interface BrutalistScrollbarProps {
  totalSections: number;
  currentIndex: number;
  onSeek: (index: number) => void;
}

export default function BrutalistScrollbar({ totalSections, currentIndex, onSeek }: BrutalistScrollbarProps) {
  const isNeumorphic = useNeumorphicTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const thumbHeight = 100 / totalSections;
  const thumbTop = currentIndex * thumbHeight;

  const calculateIndexFromY = (clientY: number) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    let percentage = relativeY / rect.height;
    percentage = Math.max(0, Math.min(1, percentage));
    const index = Math.floor(percentage * totalSections);
    return Math.min(index, totalSections - 1);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    const newIndex = calculateIndexFromY(e.clientY);
    if (newIndex !== undefined && newIndex !== currentIndex) {
      onSeek(newIndex);
    }
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging) return;
    const newIndex = calculateIndexFromY(e.clientY);
    if (newIndex !== undefined && newIndex !== currentIndex) {
      onSeek(newIndex);
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    } else {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, currentIndex, onSeek]); // Included onSeek

  return (
    <div 
      className="absolute right-0 top-0 h-full w-4 md:w-6 lg:w-8 z-[100] flex flex-col justify-center"
      style={{ pointerEvents: 'none' }}
    >
      <div 
        ref={trackRef}
        onPointerDown={handlePointerDown}
        style={{ pointerEvents: 'auto' }}
        className={`relative h-full w-full cursor-pointer transition-colors duration-300 ${
          isNeumorphic
            ? "bg-[#e0e5ec] border-l border-white/50 shadow-[inset_4px_0_8px_rgba(163,177,198,0.5)]"
            : "bg-white border-l-4 border-black brutalist-shadow-static"
        }`}
      >
        <div 
          className={`absolute left-0 right-0 transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] ${
            isNeumorphic
              ? "bg-[#d1d9e6] border-y border-transparent shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)]"
              : "bg-black"
          }`}
          style={{
            top: `${thumbTop}%`,
            height: `${thumbHeight}%`,
          }}
        >
          {/* Thumb decor */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
            <div className={`w-1/2 h-0.5 ${isNeumorphic ? 'bg-zinc-400' : 'bg-white'}`} />
            <div className={`w-1/2 h-0.5 ${isNeumorphic ? 'bg-zinc-400' : 'bg-white'}`} />
            <div className={`w-1/2 h-0.5 ${isNeumorphic ? 'bg-zinc-400' : 'bg-white'}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
