"use client"

import React, { useCallback, useRef } from "react"
import { Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

export type TransitionVariant =
  | "circle"
  | "square"
  | "triangle"
  | "diamond"
  | "hexagon"
  | "rectangle"
  | "star"

interface AnimatedThemeTogglerProps extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
  variant?: TransitionVariant
  /** When true, the transition expands from the viewport center instead of the button center. */
  fromCenter?: boolean
  /** Custom toggle logic */
  onToggle?: () => void
  /** Custom children for the button */
  children?: React.ReactNode
}

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
  const pairs = Array.from(
    { length: vertexCount },
    () => `${cx}px ${cy}px`
  ).join(", ")
  return `polygon(${pairs})`
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): [string, string] {
  // Overscan factor ensures every corner of the screen is fully covered well before cleanup()
  const overscan = 1.35

  switch (variant) {
    case "circle":
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius * 1.25}px at ${cx}px ${cy}px)`,
      ]
    case "square": {
      const halfW = Math.max(cx, viewportWidth - cx)
      const halfH = Math.max(cy, viewportHeight - cy)
      const halfSide = Math.max(halfW, halfH) * overscan
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`]
    }
    case "triangle": {
      const scale = maxRadius * 2.8
      const dx = (Math.sqrt(3) / 2) * scale
      const verts = [
        `${cx}px ${cy - scale}px`,
        `${cx + dx}px ${cy + 0.5 * scale}px`,
        `${cx - dx}px ${cy + 0.5 * scale}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`]
    }
    case "diamond": {
      const R = maxRadius * Math.SQRT2 * 1.25
      const end = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`]
    }
    case "hexagon": {
      const R = maxRadius * Math.SQRT2 * 1.25
      const verts: string[] = []
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`)
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(", ")})`]
    }
    case "rectangle": {
      // Vector projection from (cx, cy) toward each viewport corner with 35% overscan
      const x0 = cx + (0 - cx) * overscan
      const y0 = cy + (0 - cy) * overscan
      const x1 = cx + (viewportWidth - cx) * overscan
      const y1 = cy + (0 - cy) * overscan
      const x2 = cx + (viewportWidth - cx) * overscan
      const y2 = cy + (viewportHeight - cy) * overscan
      const x3 = cx + (0 - cx) * overscan
      const y3 = cy + (viewportHeight - cy) * overscan

      const end = [
        `${x0}px ${y0}px`,
        `${x1}px ${y1}px`,
        `${x2}px ${y2}px`,
        `${x3}px ${y3}px`,
      ].join(", ")
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`]
    }
    case "star": {
      const R = maxRadius * Math.SQRT2 * 1.25
      const innerRatio = 0.42
      const starPolygon = (radius: number) => {
        const verts: string[] = []
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5
          verts.push(
            `${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`
          )
          const innerA = outerA + Math.PI / 5
          verts.push(
            `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`
          )
        }
        return `polygon(${verts.join(", ")})`
      }
      const startR = Math.max(2, R * 0.025)
      return [starPolygon(startR), starPolygon(R)]
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius * 1.25}px at ${cx}px ${cy}px)`,
      ]
  }
}

export const AnimatedThemeToggler = React.forwardRef<HTMLButtonElement, AnimatedThemeTogglerProps>(({
  className,
  duration = 400,
  variant,
  fromCenter = false,
  onToggle,
  children,
  onClick,
  ...props
}, ref) => {
  const shape = variant ?? "circle"
  // Use a local ref for logic, but also sync with forwarded ref if needed
  const localRef = useRef<HTMLButtonElement>(null)
  const isTransitioningRef = useRef(false)
  const activeAnimRef = useRef<Animation | null>(null)
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Expose the ref to parent (e.g. Tooltip Trigger)
  const setRefs = useCallback(
    (node: HTMLButtonElement) => {
      localRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    },
    [ref]
  )

  const toggleTheme = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent rapid concurrent clicks while a view transition is active to avoid browser STATUS_BREAKPOINT crash
    if (isTransitioningRef.current) {
      e.preventDefault()
      e.stopPropagation()
      return
    }

    const button = localRef.current
    if (!button) return

    // Call parent onClick if provided by Tooltip or user
    if (onClick) {
      onClick(e)
    }

    const viewportWidth = window.visualViewport?.width ?? window.innerWidth
    const viewportHeight = window.visualViewport?.height ?? window.innerHeight

    let x: number
    let y: number
    if (fromCenter) {
      x = viewportWidth / 2
      y = viewportHeight / 2
    } else {
      const { top, left, width, height } = button.getBoundingClientRect()
      x = left + width / 2
      y = top + height / 2
    }

    const maxRadius = Math.hypot(
      Math.max(x, viewportWidth - x),
      Math.max(y, viewportHeight - y)
    )

    const applyTheme = () => {
      if (onToggle) {
        onToggle()
      } else {
        // Fallback standard dark mode toggle
        document.documentElement.classList.toggle("dark")
      }
    }

    if (typeof document.startViewTransition !== "function") {
      applyTheme()
      return
    }

    // Lock transition and disable pointer-events on the button during transition
    isTransitioningRef.current = true
    button.style.pointerEvents = "none"

    // Cancel any previous active animation
    if (activeAnimRef.current) {
      try {
        activeAnimRef.current.cancel()
      } catch {
        // ignore cancellation error
      }
      activeAnimRef.current = null
    }

    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current)
    }

    const clipPath = getThemeTransitionClipPaths(
      shape,
      x,
      y,
      maxRadius,
      viewportWidth,
      viewportHeight
    )

    const root = document.documentElement
    root.dataset.magicuiThemeVt = "active"
    root.style.setProperty(
      "--magicui-theme-toggle-vt-duration",
      `${duration}ms`
    )
    root.style.setProperty("--magicui-theme-vt-clip-from", clipPath[0])

    let isCleanedUp = false
    const cleanup = () => {
      if (isCleanedUp) return
      isCleanedUp = true

      delete root.dataset.magicuiThemeVt
      root.style.removeProperty("--magicui-theme-toggle-vt-duration")
      root.style.removeProperty("--magicui-theme-vt-clip-from")

      if (button) {
        button.style.pointerEvents = ""
      }

      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current)
        lockTimerRef.current = null
      }

      // Small 50ms buffer after animation completes before allowing another theme click
      setTimeout(() => {
        isTransitioningRef.current = false
      }, 50)
    }

    // Fail-safe backup timer in case browser aborts or fails to fire animation events
    lockTimerRef.current = setTimeout(cleanup, duration + 150)

    try {
      const transition = document.startViewTransition(() => {
        flushSync(applyTheme)
      })

      const ready = transition?.ready
      if (ready && typeof ready.then === "function") {
        ready
          .then(() => {
            try {
              const anim = document.documentElement.animate(
                {
                  clipPath,
                },
                {
                  duration,
                  // Star: linear avoids easing overshoot that fights polygon interpolation at t→1; VT group duration is synced above.
                  easing: shape === "star" ? "linear" : "ease-in-out",
                  fill: "forwards",
                  pseudoElement: "::view-transition-new(root)",
                }
              )
              activeAnimRef.current = anim
              anim.onfinish = cleanup
              anim.oncancel = cleanup
            } catch {
              cleanup()
            }
          })
          .catch(() => {
            cleanup()
          })
      } else {
        cleanup()
      }
    } catch {
      applyTheme()
      cleanup()
    }
  }, [shape, fromCenter, duration, onToggle, onClick])

  return (
    <button
      type="button"
      ref={setRefs}
      onClick={toggleTheme}
      className={cn(className)}
      {...props}
    >
      {children || <Sun />}
    </button>
  )
})
AnimatedThemeToggler.displayName = "AnimatedThemeToggler"
