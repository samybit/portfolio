"use client";

import React from "react";

interface FallingLayersIconProps {
  isCurtainMode: boolean;
}

export default function FallingLayersIcon({ isCurtainMode }: FallingLayersIconProps) {
  if (isCurtainMode) {
    // If in curtain mode, maybe show a different icon or a reverse animation?
    // User originally used <List />. Let's make an animated List icon.
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6 text-inherit"
      >
        <line x1="8" y1="6" x2="21" y2="6" className="group-hover:translate-x-1 transition-transform duration-300" />
        <line x1="8" y1="12" x2="21" y2="12" className="group-hover:translate-x-1 transition-transform duration-300 delay-75" />
        <line x1="8" y1="18" x2="21" y2="18" className="group-hover:translate-x-1 transition-transform duration-300 delay-150" />
        <line x1="3" y1="6" x2="3.01" y2="6" className="group-hover:opacity-50 transition-opacity duration-300" />
        <line x1="3" y1="12" x2="3.01" y2="12" className="group-hover:opacity-50 transition-opacity duration-300 delay-75" />
        <line x1="3" y1="18" x2="3.01" y2="18" className="group-hover:opacity-50 transition-opacity duration-300 delay-150" />
      </svg>
    );
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-6 h-6 text-inherit relative overflow-visible"
    >
      <style>
        {`
          .group:hover .layer-1 {
            animation: fallTop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          .group:hover .layer-2 {
            animation: fallMiddle 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s forwards;
          }
          .group:hover .layer-3 {
            animation: fallBottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s forwards;
          }

          @keyframes fallTop {
            0% { transform: translateY(-10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes fallMiddle {
            0% { transform: translateY(-10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes fallBottom {
            0% { transform: translateY(-10px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
      <polygon points="12 2 2 7 12 12 22 7 12 2" className="layer-1 transform-origin-center" />
      <polyline points="2 12 12 17 22 12" className="layer-2 transform-origin-center" />
      <polyline points="2 17 12 22 22 17" className="layer-3 transform-origin-center" />
    </svg>
  );
}
