import { ArrowUpRight } from "lucide-react";
import React, { useSyncExternalStore, useState } from "react";
import { cn } from "@/lib/utils";

interface InteractiveHoverButtonProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLElement>;
}

const subscribe = (callback: () => void) => {
  if (typeof document === "undefined") return () => {};
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
};

const getSnapshot = () => {
  if (typeof document === "undefined") return "brutalist";
  const cl = document.documentElement.classList;
  if (cl.contains("theme-neumorphic")) return "neumorphic";
  if (cl.contains("theme-color")) return "ember";
  return "brutalist";
};

const getServerSnapshot = () => "brutalist";

export function InteractiveHoverButton({
  children,
  className,
  text,
  href,
  target,
  rel,
  icon,
  ...props
}: InteractiveHoverButtonProps & Omit<React.ComponentPropsWithoutRef<"button">, keyof InteractiveHoverButtonProps> & Omit<React.ComponentPropsWithoutRef<"a">, keyof InteractiveHoverButtonProps>) {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const content = text || children;
  const [isHovered, setIsHovered] = useState(false);

  let baseClass = "";
  let dotClass = "";
  let textClass = "";
  let arrowClass = "";
  let borderRadiusClass = "";
  let dotRoundingClass = "";

  if (theme === "neumorphic") {
    baseClass = "group bg-[#e0e5ec] text-[#4b5563] border-transparent shadow-[6px_6px_12px_rgba(163,177,198,0.6),_-6px_-6px_12px_rgba(255,255,255,0.5)] data-[hover=true]:shadow-[8px_8px_16px_rgba(163,177,198,0.7),_-8px_-8px_16px_rgba(255,255,255,0.6)] active:shadow-[inset_4px_4px_8px_rgba(163,177,198,0.6),_inset_-4px_-4px_8px_rgba(255,255,255,0.5)]";
    dotClass = "bg-[#4b5563]";
    textClass = "text-[#4b5563] group-data-[hover=true]:text-[#e0e5ec]";
    arrowClass = "text-[#e0e5ec]";
    borderRadiusClass = "rounded-full";
    dotRoundingClass = "rounded-full";
  } else if (theme === "ember") {
    baseClass = "group bg-transparent text-[#1A1716] border-4 border-[#1A1716] data-[hover=true]:bg-[#1A1716] data-[hover=true]:text-[#FF4F00] data-[hover=true]:border-[#1A1716] active:bg-[#1A1716] active:text-[#FF4F00] active:border-[#1A1716]";
    dotClass = "bg-[#1A1716]";
    textClass = "text-[#1A1716] group-data-[hover=true]:text-[#FF4F00]";
    arrowClass = "text-[#FF4F00]";
    borderRadiusClass = "rounded-none";
    dotRoundingClass = "rounded-none";
  } else {
    baseClass = "group bg-transparent text-white border-4 border-white data-[hover=true]:bg-white data-[hover=true]:text-black data-[hover=true]:border-white active:bg-white active:text-black active:border-white";
    dotClass = "bg-white";
    textClass = "text-white group-data-[hover=true]:text-black";
    arrowClass = "text-black";
    borderRadiusClass = "rounded-none";
    dotRoundingClass = "rounded-none";
  }

  // Set uniform width by default (w-full on mobile, sm:w-48 on desktop)
  const commonClass = cn(
    "relative w-full sm:w-48 cursor-pointer overflow-hidden p-3 px-6 text-center text-xl font-black uppercase transition-all duration-300 ease-in-out",
    borderRadiusClass,
    baseClass,
    className
  );

  const innerContent = (
    <div className="relative z-10 flex items-center justify-center w-full h-full">
      {/* Wrapper that smoothly slides left to make room for the arrow without layout thrashing */}
      <div className="flex items-center gap-2.5 relative transition-transform duration-300 ease-in-out group-data-[hover=true]:-translate-x-3">
        {/* The Inline Dot or Icon */}
        {icon ? (
          <div className="relative flex items-center justify-center shrink-0 z-10">
            {/* Invisible expanding dot behind the icon */}
            <div 
              className={cn(
                "absolute inset-0 m-auto h-2.5 w-2.5 transition-transform duration-300 ease-in-out scale-0 group-data-[hover=true]:scale-[100.8] group-data-[hover=true]:duration-700 group-data-[hover=true]:ease-out origin-center shrink-0 z-[-1]", 
                dotRoundingClass,
                dotClass
              )}
            ></div>
            {/* The Static Icon */}
            <span className={cn("relative z-10 flex items-center justify-center w-5 h-5 transition-colors duration-300", textClass)}>
              {icon}
            </span>
          </div>
        ) : (
          <div 
            className={cn(
              "relative z-0 h-2.5 w-2.5 transition-transform duration-300 ease-in-out group-data-[hover=true]:scale-[100.8] group-data-[hover=true]:duration-700 group-data-[hover=true]:ease-out origin-center shrink-0", 
              dotRoundingClass,
              dotClass
            )}
          ></div>
        )}

        {/* The Text (Only one instance, smooth color change, smooth fallback on unhover/untouch) */}
        <span className={cn("relative z-10 transition-colors duration-300 ease-in-out group-data-[hover=true]:duration-450 select-none whitespace-nowrap", textClass)}>
          {content}
        </span>

        {/* Arrow - Absolute positioned to avoid layout recalculation (prevents 'shaky' text) */}
        <div 
          className={cn(
            "absolute left-full ml-2 z-10 flex items-center transition-all duration-300 ease-in-out group-data-[hover=true]:duration-450 group-data-[hover=true]:ease-out opacity-0 -translate-x-2 group-data-[hover=true]:translate-x-0 group-data-[hover=true]:opacity-100 shrink-0",
            arrowClass
          )}
        >
          <ArrowUpRight className="w-6 h-6 transition-transform duration-300 group-data-[hover=true]:translate-x-0.5 group-data-[hover=true]:-translate-y-0.5" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={cn("inline-block", commonClass)}
        data-hover={isHovered}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => setIsHovered(false)}
        {...(props as any)}
      >
        {innerContent}
      </a>
    );
  }

  return (
    <button 
      className={commonClass} 
      data-hover={isHovered}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
      {...(props as any)}
    >
      {innerContent}
    </button>
  );
}






