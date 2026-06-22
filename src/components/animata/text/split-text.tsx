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

  const letterClassName =
    "block h-1/2 select-none [clip-path:inset(0_-100%)] leading-none transition-transform duration-300 ease-out whitespace-pre";

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
        {text.split("").map((letter, index) => {
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
              <span className={letterClassName + topTranslate}>
                {letter}
              </span>

              {/** bottom half */}
              <span className={letterClassName + bottomTranslate}>
                <span className="absolute -translate-y-1/2 leading-none">{letter}</span>
              </span>
            </span>
          );
        })}
      </span>
    </span>
  );
}
