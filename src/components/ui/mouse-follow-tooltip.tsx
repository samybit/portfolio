"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

interface MouseFollowTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}

export function MouseFollowTooltip({ children, content, className }: MouseFollowTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const isNeumorphic = useNeumorphicTheme();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={className || "inline-flex items-stretch relative"}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {mounted && isHovered && createPortal(
        <div
          style={{
            position: "fixed",
            left: `${pos.x + 14}px`,
            top: `${pos.y + 18}px`,
            pointerEvents: "none",
            zIndex: 99999,
          }}
          className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider whitespace-nowrap pointer-events-none transition-opacity duration-75 ${
            isNeumorphic
              ? "bg-[#e0e5ec] text-[#1e293b] border-2 border-black rounded-xl shadow-[4px_4px_8px_rgba(163,177,198,0.6)]"
              : "bg-black text-white border-2 border-white shadow-[4px_4px_0px_rgba(255,255,255,0.4)]"
          }`}
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  );
}
