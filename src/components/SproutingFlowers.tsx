"use client";

import { motion } from "framer-motion";

// Brutalist Geometric Nodes
const BRUTAL_NODES = [
  // --- TOP (Shooting Up from exact center) ---
  { id: 1, anchor: "top-[50%] left-[15%] rotate-0", tilt: -25, h: "clamp(80px, 14vw, 160px)", delay: 0.1, icon: "✖" },
  { id: 2, anchor: "top-[50%] left-[50%] rotate-0", tilt: 5, h: "clamp(100px, 18vw, 220px)", delay: 0, icon: "■" },
  { id: 3, anchor: "top-[50%] left-[85%] rotate-0", tilt: 25, h: "clamp(90px, 15vw, 180px)", delay: 0.2, icon: "▲" },

  // --- RIGHT (Shooting Right from exact center) ---
  { id: 4, anchor: "top-[50%] left-[85%] rotate-90", tilt: 20, h: "clamp(80px, 12vw, 150px)", delay: 0.15, icon: "✚" },
  { id: 5, anchor: "top-[50%] left-[85%] rotate-90", tilt: -15, h: "clamp(60px, 10vw, 110px)", delay: 0.25, icon: "◆" },

  // --- BOTTOM (Shooting Down from exact center) ---
  { id: 6, anchor: "top-[50%] left-[30%] rotate-180", tilt: 20, h: "clamp(90px, 15vw, 170px)", delay: 0.3, icon: "■" },
  { id: 7, anchor: "top-[50%] left-[70%] rotate-180", tilt: -20, h: "clamp(80px, 12vw, 140px)", delay: 0.2, icon: "✖" },

  // --- LEFT (Shooting Left from exact center) ---
  { id: 8, anchor: "top-[50%] left-[15%] -rotate-90", tilt: -20, h: "clamp(80px, 12vw, 150px)", delay: 0.1, icon: "▲" },
];

export default function SproutingFlowers({ isHovered }: { isHovered: boolean }) {
  return (
    <>
      {BRUTAL_NODES.map((f) => (
        // 1. The Anchor Point
        <div
          key={f.id}
          className={`absolute w-0 h-0 flex justify-center items-end pointer-events-none z-[-1] ${f.anchor}`}
        >
          {/* 2. The Rebar Stem & Growth Animation */}
          <motion.div
            className="absolute bottom-0 origin-bottom flex justify-center"
            initial={{ height: 0, opacity: 0, rotate: 0 }}
            animate={{
              height: isHovered ? f.h : 0,
              opacity: isHovered ? 1 : 0,
              rotate: isHovered ? f.tilt : 0
            }}
            transition={{
              duration: 0.4,
              delay: isHovered ? f.delay : 0,
              ease: [0.34, 1.56, 0.64, 1], // Heavy mechanical bounce
            }}
          >
            {/* 3. The Geometric Head - Pinned perfectly to the exact top edge using absolute translation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{
                scale: isHovered ? 1 : 0,
              }}
              transition={{
                duration: 0.4,
                delay: isHovered ? f.delay + 0.1 : 0,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="absolute top-0 -translate-y-1/2 flex items-center justify-center z-10 text-4xl md:text-5xl text-black leading-none"
            >
              {f.icon}
            </motion.div>

            {/* 4. Heavy Industrial Stem */}
            <div className="w-2 md:w-3 h-full bg-black" />
          </motion.div>
        </div>
      ))}
    </>
  );
}