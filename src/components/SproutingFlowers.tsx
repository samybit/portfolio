"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useId } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function SproutingFlowers({ isHovered }: { isHovered: boolean }) {
  const [init, setInit] = useState(false);
  const id = useId().replace(/:/g, "");

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
      {/* 1. Main solid background block with moving void network */}
      <motion.div
        className="absolute -inset-x-1 -inset-y-0 md:-inset-x-4 md:-inset-y-1 bg-black overflow-hidden"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ originY: 0.5 }}
      >
        {init && (
          <div
            className={`absolute inset-[-50%] transition-opacity duration-500 blur-[1px] ${
              isHovered ? "opacity-100 delay-150" : "opacity-0"
            }`}
          >
            <Particles
              id={`void-network-${id}`}
              options={{
                fullScreen: { enable: false },
                fpsLimit: 60,
                particles: {
                  number: {
                    value: 30,
                    density: { enable: true, width: 400, height: 400 },
                  },
                  color: { value: ["#9333ea", "#e11d48", "#4c1d95"] },
                  shape: { type: "circle" },
                  opacity: {
                    value: { min: 0.1, max: 0.8 },
                    animation: { enable: true, speed: 1.5, sync: false },
                  },
                  size: {
                    value: { min: 1, max: 4 },
                    animation: { enable: true, speed: 2, sync: false },
                  },
                  links: {
                    enable: true,
                    distance: 50,
                    color: "#e11d48",
                    opacity: 0.4,
                    width: 1,
                  },
                  move: {
                    enable: true,
                    speed: { min: 0.5, max: 1.5 },
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: "bounce",
                  },
                },
              }}
              className="w-full h-full mix-blend-screen"
            />
          </div>
        )}
      </motion.div>

      {/* 2. Outer Wireframe Box */}
      <motion.div
        className="absolute -inset-x-2 -inset-y-1 md:-inset-x-8 md:-inset-y-4 border-[3px] md:border-[6px] border-black"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.95 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Corner Nodes */}
        <div className="absolute -top-[6px] -left-[6px] md:-top-[11px] md:-left-[11px] w-3 h-3 md:w-5 md:h-5 bg-black" />
        <div className="absolute -top-[6px] -right-[6px] md:-top-[11px] md:-right-[11px] w-3 h-3 md:w-5 md:h-5 bg-black" />
        <div className="absolute -bottom-[6px] -left-[6px] md:-bottom-[11px] md:-left-[11px] w-3 h-3 md:w-5 md:h-5 bg-black" />
        <div className="absolute -bottom-[6px] -right-[6px] md:-bottom-[11px] md:-right-[11px] w-3 h-3 md:w-5 md:h-5 bg-black" />
      </motion.div>

      {/* 3. Structural Line (Horizontal) */}
      <motion.div
        className="absolute top-1/2 left-1/2 h-[3px] md:h-[6px] bg-black -translate-y-1/2 -translate-x-1/2"
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "120%" : "0%" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* 4. Structural Line (Vertical) */}
      <motion.div
        className="absolute top-1/2 left-1/2 w-[3px] md:w-[6px] bg-black -translate-x-1/2 -translate-y-1/2"
        initial={{ height: "0%" }}
        animate={{ height: isHovered ? "130%" : "0%" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}