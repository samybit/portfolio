"use client"

import { useEffect, useRef } from "react"
import type React from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { type RoughAnnotation } from "rough-notation/lib/model"

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket"

interface HighlighterProps {
  children: React.ReactNode
  action?: AnnotationAction
  color?: string
  strokeWidth?: number
  animationDuration?: number
  iterations?: number
  padding?: number
  multiline?: boolean
  isView?: boolean
  show?: boolean
}

export function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  show,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null)
  const annotationRef = useRef<RoughAnnotation | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)
  const isInitialResizeRef = useRef(true)

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  // If show prop is provided, it dictates visibility. Otherwise, fallback to isView logic.
  const shouldShow = show !== undefined ? show : (!isView || isInView)

  const shouldShowRef = useRef(shouldShow)
  shouldShowRef.current = shouldShow

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    // Lazy initialization: Only create annotation when it needs to be shown
    if (!annotationRef.current && shouldShow) {
      const config = {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      }
      annotationRef.current = annotate(element, config)

      // Observe the element for resizing to recalculate annotation bounds
      resizeObserverRef.current = new ResizeObserver(() => {
        // Skip the initial callback invocation of ResizeObserver to prevent double-triggering
        if (isInitialResizeRef.current) {
          isInitialResizeRef.current = false
          return
        }
        if (shouldShowRef.current && annotationRef.current) {
          annotationRef.current.hide()
          annotationRef.current.show()
        }
      })
      resizeObserverRef.current.observe(element)
    }

    // Toggle visibility without tearing down the DOM nodes
    if (annotationRef.current) {
      if (shouldShow) {
        annotationRef.current.show()
      } else {
        annotationRef.current.hide()
      }
    }
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
  ])

  // Clean up resources only on unmount
  useEffect(() => {
    return () => {
      if (annotationRef.current) {
        annotationRef.current.remove()
      }
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
      }
    }
  }, [])

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  )
}

