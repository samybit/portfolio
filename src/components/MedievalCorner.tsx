"use client";
import React from "react";

/**
 * MedievalCorner
 *
 * A small SVG corner ornament in pure black (currentColor).
 * Positioned 14px OUTSIDE the section's border-box so the
 * diamond boss visibly protrudes past the card boundary.
 *
 * The white cover rect erases the CSS outline / box-shadow
 * at the corner, and the three arm rects redraw the triple
 * border lines from the boss junction outward.
 */
export default function MedievalCorner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const flipX = pos === "tr" || pos === "br";
  const flipY = pos === "bl" || pos === "br";

  // SVG-space mirror so one design covers all 4 corners
  const groupTransform = `translate(${flipX ? 60 : 0},${flipY ? 60 : 0}) scale(${flipX ? -1 : 1},${flipY ? -1 : 1})`;

  const posStyle: React.CSSProperties = {
    position: "absolute",
    overflow: "visible",
    pointerEvents: "none",
    zIndex: 10,
    width: 60,
    height: 60,
    top:    pos === "tl" || pos === "tr" ? -14 : undefined,
    bottom: pos === "bl" || pos === "br" ? -14 : undefined,
    left:   pos === "tl" || pos === "bl" ? -14 : undefined,
    right:  pos === "tr" || pos === "br" ? -14 : undefined,
  };

  return (
    <svg
      viewBox="0 0 60 60"
      width={60}
      height={60}
      aria-hidden="true"
      style={posStyle}
    >
      <g transform={groupTransform}>

        {/* ── Cover ──
            Erase CSS outline + box-shadow in the corner zone.
            Fill class overridden per-theme in globals.css. */}
        <rect x="0" y="0" width="52" height="52" className="med-corner-bg" />

        {/* ── Diamond Boss ──
            Center at SVG(0,0) = 14px outside the section border-box.
            Each tip is 20px from center → top/left tip is 34px outside the card. */}
        <polygon
          points="0,-20 20,0 0,20 -20,0"
          fill="currentColor"
        />

        {/* ── Small miter triangle ──
            Fills the gap between outer-thin corner and main-border corner. */}
        <polygon points="7,7 14,7 7,14" fill="currentColor" />

        {/* ── Bracket Arms ──
            Three sets: outer thin | main thick | inner thin.
            Positions computed from section border geometry:
              outline 1.5px at SVG y ≈ 7  (7px outside border)
              border  4px   at SVG y = 14–18
              shadow  1.5px at SVG y ≈ 26 (8px inside border-inner) */}

        {/* Outer thin (matching CSS outline) */}
        <rect x="2"    y="6.25"  width="58"   height="1.5" fill="currentColor" />
        <rect x="6.25" y="2"     width="1.5"  height="58"  fill="currentColor" />

        {/* Main thick (matching CSS border-4) */}
        <rect x="14" y="14" width="46" height="4" fill="currentColor" />
        <rect x="14" y="14" width="4" height="46" fill="currentColor" />

        {/* Inner thin (matching CSS box-shadow inner line) */}
        <rect x="26"   y="25.25" width="34"   height="1.5" fill="currentColor" />
        <rect x="25.25" y="26"   width="1.5"  height="34"  fill="currentColor" />

        {/* ── Inner-corner accent diamond ──
            Small decorative diamond where the inner thin lines meet. */}
        <polygon points="26,22 30,26 26,30 22,26" fill="currentColor" />

      </g>
    </svg>
  );
}
