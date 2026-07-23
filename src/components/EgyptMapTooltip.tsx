"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";

const DottedMap = dynamic(
  () => import("@/components/ui/dotted-map").then((mod) => mod.DottedMap),
  {
    ssr: false,
    loading: () => (
      <span className="flex w-full h-full items-center justify-center bg-zinc-950 border-2 border-white text-white">
        <span className="text-xs font-black uppercase tracking-wider animate-pulse">
          Loading Map...
        </span>
      </span>
    ),
  }
);

// Cairo, Egypt coordinates
const EGYPT_MARKERS = [
  {
    lat: 30.0444,
    lng: 31.2357,
    size: 2,
    pulse: true,
  },
];

export default function EgyptMapTooltip({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isNeumorphic = useNeumorphicTheme();

  // Pre-warm / pre-mount map in background during idle time after page load
  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      const handle = (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(() => {
        setHasBeenShown(true);
      });
      return () => {
        if ("cancelIdleCallback" in window) {
          (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(handle);
        }
      };
    } else {
      const timer = setTimeout(() => {
        setHasBeenShown(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);

  const show = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setHasBeenShown(true);
    setVisible(true);
  }, []);

  const hide = useCallback(() => {
    // Small delay so the tooltip doesn't flicker when cursor brushes edge
    hideTimeout.current = setTimeout(() => setVisible(false), 120);
  }, []);

  return (
    <span
      className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={hide}
      onTouchStart={(e) => {
        e.preventDefault();
        setVisible((v) => !v);
      }}
      aria-label="Egypt – Cairo location on map"
    >
      {children}

      {/* ── Tooltip ─────────────────────────────────────── */}
      <span
        aria-hidden="true"
        className={`
          egypt-map-tooltip
          pointer-events-none
          absolute z-50
          top-[110%] left-1/2 -translate-x-1/2
          sm:top-auto sm:bottom-[110%]
          w-[240px] sm:w-[280px]
          transition-all duration-200 ease-out
          ${isNeumorphic
            ? "bg-[#e0e5ec] rounded-2xl shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] border border-transparent text-black"
            : "bg-black border-4 border-white shadow-[8px_8px_0px_rgba(255,255,255,0.3)] text-white"
          }
          ${visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 -translate-y-2 scale-95 sm:translate-y-2"
          }
        `}
        style={{ transformOrigin: "top center" }}
      >
        {/* Map */}
        <span className="block p-2" style={{ height: 150 }}>
          {hasBeenShown && (
            <DottedMap
              markers={EGYPT_MARKERS}
              dotColor={isNeumorphic ? "#4b5563" : "#fff"}
              markerColor={isNeumorphic ? "#4b5563" : "#fff"}
              dotRadius={0.35}
              pulse
              mapSamples={3000}
            />
          )}
        </span>

        {/* Arrow notch — points UP on mobile (tooltip below word), DOWN on sm+ (tooltip above word) */}
        {/* Mobile: up-pointing arrow at the top of the tooltip */}
        <span
          className="absolute sm:hidden left-1/2 -translate-x-1/2 top-[-10px] w-0 h-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderBottom: isNeumorphic ? "10px solid transparent" : "10px solid white",
          }}
        />
        <span
          className="absolute sm:hidden left-1/2 -translate-x-1/2 top-[-5px] w-0 h-0"
          style={{
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderBottom: isNeumorphic ? "7px solid #e0e5ec" : "7px solid black",
          }}
        />
        {/* sm+: down-pointing arrow at the bottom of the tooltip */}
        <span
          className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-0 h-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: isNeumorphic ? "10px solid transparent" : "10px solid white",
          }}
        />
        <span
          className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-0 h-0"
          style={{
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: isNeumorphic ? "7px solid #e0e5ec" : "7px solid black",
          }}
        />
      </span>
    </span>
  );
}
