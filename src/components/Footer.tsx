"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useScrollMode } from "@/context/ScrollModeContext";
import FallingLayersIcon from "./FallingLayersIcon";
import { CustomTooltip } from "@/components/ui/tooltip";
import { Palette, ArrowUp } from "lucide-react";
import SpeedDial from "@/components/animata/fabs/speed-dial";
import { playClack, playTick } from "@/utils/audio";

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

  const cycleTheme = () => {
    playClack();
    const html = document.documentElement;

    if (html.classList.contains("invert-theme")) {
      html.classList.remove("invert-theme");
      html.classList.add("theme-color");
    } else if (html.classList.contains("theme-color")) {
      html.classList.remove("theme-color");
      html.classList.add("theme-neumorphic");
    } else if (html.classList.contains("theme-neumorphic")) {
      html.classList.remove("theme-neumorphic");
    } else {
      html.classList.add("invert-theme");
    }
    
    setIsEmber(html.classList.contains("theme-color"));
    setIsNeumorphic(html.classList.contains("theme-neumorphic"));
  };

  const scrollToTop = () => {
    playTick();
    if (isCurtainMode) {
      window.dispatchEvent(new CustomEvent('curtainNavigate', { detail: 0 }));
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const fab = isFooterVisible && (
    <div className={`fixed z-50 pointer-events-auto transition-all duration-300 ${
      isCurtainMode ? 'bottom-8 right-16 md:bottom-10 md:right-20' : 'bottom-8 right-8 md:bottom-10 md:right-10'
    }`}>
      <SpeedDial
        direction="up"
        triggerLabel="Open Actions"
        className={
          isNeumorphic 
            ? "[&>button]:bg-[#e0e5ec] [&>button]:text-[#4b5563] [&>button]:border-transparent [&>button]:shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] [&>ul>li>button]:bg-[#e0e5ec] [&>ul>li>button]:text-[#4b5563] [&>ul>li>button]:border-transparent [&>ul>li>button]:shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)]"
            : isEmber
              ? "[&>button]:bg-[#1A1716] [&>button]:text-[#FF4F00] [&>button]:border-[#FF4F00] [&>button]:shadow-[4px_4px_0px_#FF4F00] [&>ul>li>button]:bg-[#1A1716] [&>ul>li>button]:text-[#FF4F00] [&>ul>li>button]:border-[#FF4F00] [&>ul>li>button]:shadow-[2px_2px_0px_#FF4F00]"
              : "[&>button]:bg-white [&>button]:text-black [&>button]:border-2 [&>button]:border-black [&>button]:shadow-[4px_4px_0px_#000] [&>ul>li>button]:bg-white [&>ul>li>button]:text-black [&>ul>li>button]:border-2 [&>ul>li>button]:border-black [&>ul>li>button]:shadow-[2px_2px_0px_#000]"
        }
        actionButtons={[
          {
            key: "scrollMode",
            label: isCurtainMode ? "Normal Scroll" : "Curtain Scroll",
            icon: <FallingLayersIcon isCurtainMode={isCurtainMode} />,
            action: toggleScrollMode,
          },
          {
            key: "theme",
            label: "Cycle Theme",
            icon: <Palette size={20} />,
            action: cycleTheme,
          },
          {
            key: "top",
            label: "Back to Top",
            icon: <ArrowUp size={20} />,
            action: scrollToTop,
          }
        ]}
      />
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