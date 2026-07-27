"use client";

import { useRef, useState, useEffect } from "react";

import { cn } from "@/lib/utils";

export default function SplitText({
  text = "SAMY",
  className,
}: {
  text: string;
  className?: string;
}) {
  const [activeIndex, setIndex] = useState<number>();
  const timer = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const baseLetterClassName =
    "block h-1/2 select-none leading-none transition-transform duration-300 ease-out whitespace-pre";

  return (
    <span
      className={cn(
        "relative inline-block",
        className,
      )}
    >
      {/** add hidden text so that we maintain the size for any text */}
      <span className="invisible leading-none block">{text}</span>
      <span className="absolute top-0 flex h-full">
        {(/[\u0600-\u06FF]/.test(text) ? text.split(/(\s+)/) : text.split("")).map((letter, index) => {
          const distance = activeIndex !== undefined ? Math.abs(index - activeIndex) : null;
          const topTranslate = distance === 0 ? " -translate-y-5" : distance === 1 ? " -translate-y-3" : distance === 2 ? " -translate-y-1" : "";
          const bottomTranslate = distance === 0 ? " translate-y-5" : distance === 1 ? " translate-y-3" : distance === 2 ? " translate-y-1" : "";

          return (
            <span
              onMouseEnter={() => {
                if (timer.current) {
                  clearTimeout(timer.current);
                }
                setIndex(index);
              }}
              onMouseLeave={() => {
                timer.current = setTimeout(() => {
                  setIndex(undefined);
                });
              }}
              key={`${letter}-${index}`}
              className="relative inline-flex h-full flex-col leading-none"
              aria-hidden
            >
              {/** top half */}
              <span 
                className={`${baseLetterClassName}${topTranslate}`}
                style={{ clipPath: "inset(-100% -100% -0.5px -100%)" }}
              >
                {letter}
              </span>

              {/** bottom half */}
              <span 
                className={`${baseLetterClassName}${bottomTranslate}`}
                style={{ clipPath: "inset(-0.5px -100% -100% -100%)" }}
              >
                <span className="absolute -translate-y-1/2 leading-none">{letter}</span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
