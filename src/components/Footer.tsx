"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useScrollMode } from "@/context/ScrollModeContext";
import FallingLayersIcon from "./FallingLayersIcon";
import { CustomTooltip } from "@/components/ui/tooltip";

const Footer3D = dynamic(() => import("@/components/Footer3D"), { ssr: false });

export default function Footer({ dict }: { dict: Record<string, string> }) {
  // 1. Hardware Observer: Tracks if the footer is anywhere near the viewport
  const footerRef = useRef<HTMLElement>(null);
  // The margin ensures it wakes up slightly before the user actually sees it
  const isInView = useInView(footerRef, { margin: "200px 0px 200px 0px" });
  const isFooterVisible = useInView(footerRef, { margin: "0px" });

  const [isEmber, setIsEmber] = useState(false);
  const [isNeumorphic, setIsNeumorphic] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { isCurtainMode, toggleScrollMode } = useScrollMode();

  useEffect(() => {
    setMounted(true);
    const checkTheme = () => {
      setIsEmber(document.documentElement.classList.contains("theme-color"));
      setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  const currentYear = new Date().getFullYear();
  const copyrightText = (dict?.copyright || "© {year} SAMYBIT // WITH NEXT.JS & BRUTALISM.").replace('{year}', currentYear.toString());

  const fab = isFooterVisible && (
    <div className={`fixed z-50 pointer-events-auto transition-all duration-300 ${
      isCurtainMode ? 'bottom-6 right-16 md:right-18 lg:right-20' : 'bottom-6 right-6'
    }`}>
      <CustomTooltip content={isCurtainMode ? "Switch to Normal Scroll" : "Switch to Curtain Scroll"} side="left">
        <button
          onClick={toggleScrollMode}
          aria-label="Toggle Scroll Mode"
          className={`group flex items-center justify-center p-4 rounded-none border-4 transition-all duration-300 ${
            isNeumorphic 
              ? "bg-[#e0e5ec] text-[#4b5563] border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] hover:bg-[#d1d9e6] hover:text-[#1e293b]"
              : isEmber
                ? "bg-[#1A1716] text-[#FF4F00] border-[#1A1716] shadow-[4px_4px_0px_#FF4F00] hover:bg-[#FF4F00] hover:text-[#1A1716] hover:shadow-[2px_2px_0px_#FF4F00] hover:translate-x-[2px] hover:translate-y-[2px]"
                : "bg-white text-black border-black brutalist-shadow hover:bg-black hover:text-white"
          }`}
        >
          <FallingLayersIcon isCurtainMode={isCurtainMode} />
        </button>
      </CustomTooltip>
    </div>
  );

  return (
    <footer ref={footerRef} className="relative min-h-[20vh] flex items-center justify-center overflow-hidden bg-white border-t-8 border-black py-6 px-6 md:py-8 md:px-12">
      {/* --- LAYER 1: 3D KNOT BACKGROUND (z-0) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 2. The Engine Killswitch: 'never' pauses the GPU completely */}
        <Footer3D isInView={isInView} isEmber={isEmber} isNeumorphic={isNeumorphic} />
      </div>

      {/* --- LAYER 2: FOOTER CONTENT (z-10) --- */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-6 pointer-events-none">
        <p className="text-[clamp(0.75rem,3.5vw,1.25rem)] whitespace-nowrap font-bold uppercase text-black bg-white px-3 py-1" suppressHydrationWarning>
          {copyrightText}
        </p>

        <a
          href="#"
          onClick={(e) => {
            if (isCurtainMode) {
              e.preventDefault();
              window.dispatchEvent(new CustomEvent('curtainNavigate', { detail: 0 }));
            }
          }}
          className="text-lg font-bold uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors pointer-events-auto"
        >
          {dict?.backToTop || "↑ Back to top"}
        </a>
      </div>

      {/* --- LAYER 3: FLOATING ACTION BUTTON (PORTALED TO BODY) --- */}
      {mounted && typeof document !== "undefined" && createPortal(fab, document.body)}
    </footer>
  );
}