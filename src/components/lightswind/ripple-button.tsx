"use client";

import React, { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

interface RippleButtonProps {
  children: React.ReactNode;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

// Theme detection hook (mirrors InteractiveHoverButton pattern)
const subscribe = (callback: () => void) => {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
};

const getSnapshot = () => {
  if (typeof document === "undefined") return "brutalist";
  const cl = document.documentElement.classList;
  if (cl.contains("theme-neumorphic")) return "neumorphic";
  return "brutalist";
};

const getServerSnapshot = () => "brutalist";

export function RippleButton({
  children,
  href,
  target,
  rel,
  className,
  onClick,
}: RippleButtonProps) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isNeumorphic = theme === "neumorphic";

  // Circle background color: black for brutalist, dark slate for neumorphic
  const circleColor = isNeumorphic ? "#4b5563" : "#000000";

  const sharedProps = {
    onClick,
    className: cn(
      "ripple-btn group relative overflow-hidden select-none",
      className
    ),
  };

  const inner = (
    <>
      <span className="ripple-circle circle1" style={{ backgroundColor: circleColor }}></span>
      <span className="ripple-circle circle2" style={{ backgroundColor: circleColor }}></span>
      <span className="ripple-circle circle3" style={{ backgroundColor: circleColor }}></span>
      <span className="ripple-circle circle4" style={{ backgroundColor: circleColor }}></span>
      <span className="ripple-circle circle5" style={{ backgroundColor: circleColor }}></span>
      <span className="ripple-text">{children}</span>

      <style>{`
        .ripple-btn {
          position: relative;
          overflow: hidden;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        /* Target all circle spans */
        .ripple-btn > .ripple-circle {
          position: absolute;
          left: 50%;
          top: 50%;
          height: 30px;
          width: 30px;
          border-radius: 50%;
          transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease;
          pointer-events: none;
          z-index: 1;
          opacity: 0;
          will-change: transform, opacity; /* GPU acceleration to prevent UI lag */
        }

        .ripple-btn > .ripple-text {
          position: relative;
          z-index: 10;
          transition: color 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: inherit;
        }

        /* Initial offset positioning and scale(0) for circles */
        .ripple-btn > .circle1 {
          transform: translate(-3.3em, -4em) scale(0);
        }

        .ripple-btn > .circle2 {
          transform: translate(-6em, 1.3em) scale(0);
        }

        .ripple-btn > .circle3 {
          transform: translate(-0.2em, 1.8em) scale(0);
        }

        .ripple-btn > .circle4 {
          transform: translate(3.5em, 1.4em) scale(0);
        }

        .ripple-btn > .circle5 {
          transform: translate(3.5em, -3.8em) scale(0);
        }

        /* Hover effect wrapped in hover media query to prevent sticky states on mobile */
        @media (hover: hover) {
          .ripple-btn:hover > .ripple-circle {
            transform: translate(-50%, -50%) scale(5.3);
            opacity: 0.95;
            transition: transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease;
          }

          .ripple-btn:hover > .ripple-text {
            color: #ffffff !important;
          }
        }

        /* Touch support active states for mobile compatibility */
        @media (hover: none) {
          .ripple-btn:active > .ripple-circle {
            transform: translate(-50%, -50%) scale(5.3);
            opacity: 0.95;
            transition: transform 1.2s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.4s ease;
          }
          .ripple-btn:active > .ripple-text {
            color: #ffffff !important;
          }
        }
      `}</style>
    </>
  );

  if (href) {
    return (
      <a
        {...(sharedProps as React.ComponentPropsWithoutRef<"a">)}
        href={href}
        target={target}
        rel={rel}
      >
        {inner}
      </a>
    );
  }

  return (
    <button {...(sharedProps as React.ComponentPropsWithoutRef<"button">)}>
      {inner}
    </button>
  );
}

export default RippleButton;
