"use client";

import { motion } from "framer-motion";
import { useEffect, useState, useId, useRef } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function SproutingFlowers({ isHovered }: { isHovered: boolean }) {
  const [init, setInit] = useState(false);
  const [isNeumorphic, setIsNeumorphic] = useState(false);
  const [isEmber, setIsEmber] = useState(false);
  const id = useId().replace(/:/g, "");
  const particlesContainer = useRef<any>(null);

  useEffect(() => {
    // Track if the Neumorphic or Ember theme is active
    const checkTheme = () => {
      setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
      setIsEmber(document.documentElement.classList.contains("theme-color"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // Hard-pause particles when not hovered to save 100% of CPU/GPU overhead
  useEffect(() => {
    if (particlesContainer.current) {
      if (isHovered) {
        particlesContainer.current.play();
      } else {
        // Delay pausing slightly to allow the fade-out animation to complete smoothly
        const timeout = setTimeout(() => {
          particlesContainer.current?.pause();
        }, 500);
        return () => clearTimeout(timeout);
      }
    }
  }, [isHovered]);

  const particlesLoaded = async (container: any) => {
    particlesContainer.current = container;
    if (!isHovered) {
      container.pause();
    }
  };

  // Theme configuration overrides
  let particleColors = ["#9333ea", "#e11d48", "#4c1d95", "#f43f5e"];
  let linkColor = "#e11d48";
  let bgClass = "bg-black";
  let borderClass = "border-[3px] md:border-[6px] border-black";
  let structuralLineClass = "bg-black";
  let nodeClass = "bg-black";
  let blendMode = "mix-blend-screen";

  if (isNeumorphic) {
    particleColors = ["#4b5563", "#3b82f6", "#6366f1"];
    linkColor = "#64748b";
    bgClass = "bg-[#e0e5ec] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),inset_-4px_-4px_8px_rgba(255,255,255,0.5)] rounded-2xl";
    borderClass = "border-[3px] md:border-[6px] border-white/60 shadow-[4px_4px_12px_rgba(163,177,198,0.4)] rounded-2xl";
    structuralLineClass = "bg-[#a3b1c6]";
    nodeClass = "bg-white shadow-sm rounded-full";
    blendMode = "mix-blend-normal opacity-100";
  } else if (isEmber) {
    particleColors = ["#FF4F00", "#FF7A00", "#FF2A00", "#E63E00"];
    linkColor = "#FF4F00";
    bgClass = "bg-[#1A1716]";
    borderClass = "border-[3px] md:border-[6px] border-[#FF4F00]";
    structuralLineClass = "bg-[#FF4F00]";
    nodeClass = "bg-[#FF4F00]";
    blendMode = "mix-blend-screen";
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
      {/* 1. Main solid background block with moving void network */}
      <motion.div
        className={`absolute -inset-x-1 -inset-y-0 md:-inset-x-4 md:-inset-y-1 overflow-hidden transition-colors duration-300 ${bgClass}`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        style={{ originY: 0.5 }}
      >
        {init && (
          <motion.div
            className="absolute inset-[-50%] blur-[1px]"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ 
              opacity: isHovered ? 1 : 0,
              scale: isHovered ? 1 : 0.8,
              rotate: isHovered ? 0 : -5
            }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Particles
              id={`void-network-${id}`}
              particlesLoaded={particlesLoaded}
              options={{
                fullScreen: { enable: false },
                fpsLimit: 120,
                particles: {
                  number: {
                    value: 80,
                    density: { enable: true, width: 400, height: 400 },
                  },
                  color: { value: particleColors },
                  shape: { type: "circle" },
                  opacity: {
                    value: { min: 0.3, max: 0.9 },
                    animation: { enable: true, speed: 1.5, sync: false },
                  },
                  size: {
                    value: { min: 1.5, max: 5 },
                    animation: { enable: true, speed: 3, sync: false },
                  },
                  links: {
                    enable: true,
                    distance: 120,
                    color: linkColor,
                    opacity: isNeumorphic ? 0.9 : 0.6,
                    width: 1.5,
                  },
                  move: {
                    enable: true,
                    speed: { min: 1, max: 3.5 },
                    direction: "none",
                    random: true,
                    straight: false,
                    outModes: "out",
                  },
                },
              }}
              className={`w-full h-full ${blendMode}`}
            />
          </motion.div>
        )}
      </motion.div>

      {/* 2. Outer Wireframe Box */}
      <motion.div
        className={`absolute -inset-x-2 -inset-y-1 md:-inset-x-8 md:-inset-y-4 transition-colors duration-300 ${borderClass}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.95 }}
        transition={{ duration: 0.4, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Corner Nodes */}
        <div className={`absolute -top-[6px] -left-[6px] md:-top-[11px] md:-left-[11px] w-3 h-3 md:w-5 md:h-5 ${nodeClass}`} />
        <div className={`absolute -top-[6px] -right-[6px] md:-top-[11px] md:-right-[11px] w-3 h-3 md:w-5 md:h-5 ${nodeClass}`} />
        <div className={`absolute -bottom-[6px] -left-[6px] md:-bottom-[11px] md:-left-[11px] w-3 h-3 md:w-5 md:h-5 ${nodeClass}`} />
        <div className={`absolute -bottom-[6px] -right-[6px] md:-bottom-[11px] md:-right-[11px] w-3 h-3 md:w-5 md:h-5 ${nodeClass}`} />
      </motion.div>

      {/* 3. Structural Line (Horizontal) */}
      <motion.div
        className={`absolute top-1/2 left-1/2 h-[3px] md:h-[6px] -translate-y-1/2 -translate-x-1/2 transition-colors duration-300 ${structuralLineClass}`}
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "120%" : "0%" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* 4. Structural Line (Vertical) */}
      <motion.div
        className={`absolute top-1/2 left-1/2 w-[3px] md:w-[6px] -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 ${structuralLineClass}`}
        initial={{ height: "0%" }}
        animate={{ height: isHovered ? "130%" : "0%" }}
        transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}