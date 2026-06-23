"use client"

import { useCallback, useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"

const useMorphingText = (texts: string[], isHovered: boolean, setIsMorphing: (val: boolean) => void) => {
  const text1Ref = useRef<HTMLSpanElement>(null)
  const text2Ref = useRef<HTMLSpanElement>(null)
  const fractionRef = useRef(0)

  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current]
      if (!current1 || !current2) return

      // Target text (texts[1])
      if (fraction === 0) {
        current2.style.filter = "blur(32px)"
        current2.style.opacity = "0%"
      } else {
        current2.style.filter = `blur(${Math.min(8 / fraction - 8, 32)}px)`
        current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`
      }

      // Source text (texts[0])
      const invertedFraction = 1 - fraction
      if (invertedFraction === 0) {
        current1.style.filter = "blur(32px)"
        current1.style.opacity = "0%"
      } else {
        current1.style.filter = `blur(${Math.min(
          8 / invertedFraction - 8,
          32
        )}px)`
        current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`
      }

      current1.textContent = texts[0]
      current2.textContent = texts[1 % texts.length]
    },
    [texts]
  )

  useEffect(() => {
    // Initial setup
    setStyles(fractionRef.current)
  }, [setStyles])

  useEffect(() => {
    let animationFrameId: number
    let lastTime = performance.now()
    const speed = 0.5 // Morph duration in seconds

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate)
      const dt = (time - lastTime) / 1000
      lastTime = time

      const targetFraction = isHovered ? 1 : 0

      if (fractionRef.current !== targetFraction) {
        setIsMorphing(true)
        
        if (targetFraction === 1) {
          fractionRef.current = Math.min(1, fractionRef.current + dt / speed)
        } else {
          fractionRef.current = Math.max(0, fractionRef.current - dt / speed)
        }
        
        setStyles(fractionRef.current)

        if (fractionRef.current === targetFraction) {
          setIsMorphing(false)
        }
      }
    }

    animationFrameId = requestAnimationFrame(animate)
    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isHovered, setStyles, setIsMorphing])

  return { text1Ref, text2Ref }
}

interface MorphingTextProps {
  className?: string
  texts: string[]
}

const Texts: React.FC<Pick<MorphingTextProps, "texts"> & { isHovered: boolean, setIsMorphing: (val: boolean) => void }> = ({ texts, isHovered, setIsMorphing }) => {
  const { text1Ref, text2Ref } = useMorphingText(texts, isHovered, setIsMorphing)
  return (
    <>
      {/* Invisible placeholder to establish dimensions based on the longest text */}
      <span className="invisible block">
        {texts.reduce((a, b) => a.length > b.length ? a : b)}
      </span>
      <span
        className="absolute inset-0 m-auto inline-flex items-center justify-center text-center"
        ref={text1Ref}
      />
      <span
        className="absolute inset-0 m-auto inline-flex items-center justify-center text-center"
        ref={text2Ref}
      />
    </>
  )
}

const SvgFilters: React.FC = () => (
  <svg
    id="filters"
    className="fixed h-0 w-0"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <filter id="threshold">
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
)

export const MorphingText: React.FC<MorphingTextProps> = ({
  texts,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isMorphing, setIsMorphing] = useState(false)

  return (
    <div
      className={cn(
        "relative inline-block transition-all transform-gpu will-change-[filter]",
        isMorphing ? "filter-[url(#threshold)_blur(0.6px)]" : "filter-none",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      <Texts texts={texts} isHovered={isHovered} setIsMorphing={setIsMorphing} />
      <SvgFilters />
    </div>
  )
}
