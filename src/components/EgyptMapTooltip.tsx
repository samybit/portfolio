"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";

const DottedMap = dynamic(
  () => import("@/components/ui/dotted-map").then((mod) => mod.DottedMap),
  {
    ssr: false,
    loading: () => (
      <span className="flex w-full h-full items-center justify-center bg-white border-2 border-black">
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

  useEffect(() => {
    if (visible) {
      setHasBeenShown(true);
    }
  }, [visible]);

  const show = useCallback(() => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
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
          bg-white border-4 border-black
          shadow-[6px_6px_0px_#000]
          transition-all duration-200 ease-out
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
              dotColor="#000"
              markerColor="#000"
              dotRadius={0.3}
              pulse
              mapSamples={4000}
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
            borderBottom: "10px solid black",
          }}
        />
        <span
          className="absolute sm:hidden left-1/2 -translate-x-1/2 top-[-5px] w-0 h-0"
          style={{
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderBottom: "7px solid white",
          }}
        />
        {/* sm+: down-pointing arrow at the bottom of the tooltip */}
        <span
          className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-[-10px] w-0 h-0"
          style={{
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: "10px solid black",
          }}
        />
        <span
          className="hidden sm:block absolute left-1/2 -translate-x-1/2 bottom-[-5px] w-0 h-0"
          style={{
            borderLeft: "7px solid transparent",
            borderRight: "7px solid transparent",
            borderTop: "7px solid white",
          }}
        />
      </span>
    </span>
  );
}
