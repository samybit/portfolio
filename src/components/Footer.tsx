"use client";

import { useRef } from "react";
import { createPortal } from "react-dom";
import { useInView } from "framer-motion";
import dynamic from "next/dynamic";
import { useAnimationConfig } from "@/context/AnimationContext";
import { Palette, ArrowUp, Zap, ZapOff, BookOpen, BookText } from "lucide-react";
import SpeedDial from "@/components/animata/fabs/speed-dial";
import { playClack, playTick } from "@/utils/audio";
import { useNeumorphicTheme } from "@/hooks/useNeumorphicTheme";
import { useEmberTheme } from "@/hooks/useEmberTheme";
import { useSyncExternalStore } from "react";

const Footer3D = dynamic(() => import("@/components/Footer3D"), { ssr: false });

export default function Footer({
  dict,
  className = "",
  overlay = false,
}: {
  dict: Record<string, string>;
  className?: string;
  overlay?: boolean;
}) {
  // 1. Hardware Observer: Tracks if the footer is anywhere near the viewport
  const footerRef = useRef<HTMLElement>(null);
  // The margin ensures it wakes up slightly before the user actually sees it
  const isInView = useInView(footerRef, { margin: "200px 0px 200px 0px" });
  const isFooterVisible = useInView(footerRef, { margin: "0px" });

  // useSyncExternalStore: subscribe returns a no-op (DOM doesn't change during the portal check),
  // getSnapshot returns true on client, getServerSnapshot returns false — no setState needed.
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isEmber = useEmberTheme();
  const isNeumorphic = useNeumorphicTheme();

  const { isAnimationsDisabled, toggleAnimations, isReaderMode, toggleReaderMode } = useAnimationConfig();

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
    // useEmberTheme / useNeumorphicTheme hooks react automatically via MutationObserver
  };

  const scrollToTop = () => {
    playTick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const fab = isFooterVisible && (
    <div className="fixed z-50 pointer-events-auto transition-all duration-300 bottom-8 right-8 md:bottom-10 md:right-10">
      <SpeedDial
        direction="up"
        triggerLabel={dict?.openActions || "Open Actions"}
        closeLabel={dict?.closeActions || "Close Actions"}
        className={
          isNeumorphic 
            ? "[&>button]:bg-[#e0e5ec] [&>button]:text-[#4b5563] [&>button]:border-transparent [&>button]:shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] [&>ul>li>button]:bg-[#e0e5ec] [&>ul>li>button]:text-[#4b5563] [&>ul>li>button]:border-transparent [&>ul>li>button]:shadow-[4px_4px_8px_rgba(163,177,198,0.6),_-4px_-4px_8px_rgba(255,255,255,0.5)]"
            : isEmber
              ? "[&>button]:bg-[#1A1716] [&>button]:text-[#FF4F00] [&>button]:border-[#FF4F00] [&>button]:shadow-[4px_4px_0px_#FF4F00] [&>ul>li>button]:bg-[#1A1716] [&>ul>li>button]:text-[#FF4F00] [&>ul>li>button]:border-[#FF4F00] [&>ul>li>button]:shadow-[2px_2px_0px_#FF4F00]"
              : "[&_button]:rounded-none [&>button]:bg-white [&>button]:text-black [&>button]:border-2 [&>button]:border-black [&>button]:shadow-[4px_4px_0px_rgba(255,255,255,0.3)] [&>ul>li>button]:bg-white [&>ul>li>button]:text-black [&>ul>li>button]:border-2 [&>ul>li>button]:border-black [&>ul>li>button]:shadow-[2px_2px_0px_rgba(255,255,255,0.3)]"
        }
        actionButtons={[
          {
            key: "theme",
            label: dict?.cycleTheme || "Cycle Theme",
            icon: <Palette size={20} />,
            action: cycleTheme,
          },
          {
            key: "animations",
            label: isAnimationsDisabled ? (dict?.enableMotion || "Enable Motion") : (dict?.disableMotion || "Disable Motion"),
            icon: isAnimationsDisabled ? <ZapOff size={20} /> : <Zap size={20} />,
            action: toggleAnimations,
          },
          {
            key: "reader",
            label: isReaderMode ? (dict?.exitTextMode || "Exit Text Mode") : (dict?.textOnlyMode || "Text-Only Mode"),
            icon: isReaderMode ? <BookText size={20} /> : <BookOpen size={20} />,
            action: () => { playTick(); toggleReaderMode(); },
          },
          {
            key: "top",
            label: dict?.backToTop || "Back to Top",
            icon: <ArrowUp size={20} />,
            action: scrollToTop,
          }
        ]}
      />
    </div>
  );

  return (
    <footer
      ref={footerRef}
      className={
        overlay
          ? `w-full py-3.5 px-6 border-t-4 border-black/80 bg-black/85 backdrop-blur-md text-white transition-colors duration-300 ${className}`
          : `relative min-h-[20vh] flex items-center justify-center overflow-hidden border-t-8 border-black py-6 px-6 md:py-8 md:px-12 transition-colors duration-300 ${
              isNeumorphic ? "bg-white" : "bg-black"
            } ${className}`
      }
    >
      {/* --- LAYER 1: 3D KNOT BACKGROUND (Only in standalone non-overlay mode) --- */}
      {!overlay && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Footer3D isInView={isInView} isEmber={isEmber} isNeumorphic={isNeumorphic} />
        </div>
      )}

      {/* --- LAYER 2: FOOTER CONTENT --- */}
      <div
        className={
          overlay
            ? "relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left rtl:sm:text-right pointer-events-auto"
            : "relative z-10 text-center flex flex-col items-center justify-center gap-6 pointer-events-none"
        }
      >
        <p
          className={`font-bold uppercase ${
            overlay
              ? isNeumorphic
                ? "text-black bg-white/90 px-3 py-1 text-xs sm:text-sm"
                : "text-white/90 text-xs sm:text-sm tracking-wider"
              : "text-black bg-white px-3 py-1 text-[clamp(0.75rem,3.5vw,1.25rem)]"
          }`}
          suppressHydrationWarning
        >
          {copyrightText}
        </p>

        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            scrollToTop();
          }}
          className={`font-bold uppercase border-b-2 sm:border-b-4 pb-0.5 transition-colors pointer-events-auto cursor-pointer ${
            overlay
              ? isNeumorphic
                ? "border-black text-black hover:bg-black hover:text-white px-2 text-sm sm:text-base"
                : isEmber
                ? "border-[#FF4F00] text-[#FF4F00] hover:bg-[#FF4F00] hover:text-[#1A1716] px-2 text-sm sm:text-base"
                : "border-white text-white hover:bg-white hover:text-black px-2 text-sm sm:text-base"
              : `text-lg border-b-4 ${
                  isNeumorphic
                    ? "border-black text-black hover:bg-black hover:text-white"
                    : isEmber
                    ? "border-[#FF4F00] text-[#FF4F00] hover:bg-[#FF4F00] hover:text-[#1A1716]"
                    : "border-white text-white hover:bg-white hover:text-black"
                }`
          }`}
        >
          {dict?.backToTop || "↑ Back to top"}
        </a>
      </div>

      {/* --- LAYER 3: FLOATING ACTION BUTTON (PORTALED TO BODY) --- */}
      {mounted && typeof document !== "undefined" && createPortal(fab, document.body)}
    </footer>
  );
}