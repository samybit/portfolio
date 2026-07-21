"use client"

import React, { ReactNode, useEffect, useRef } from "react"

export interface BaseParticle {
  element: HTMLElement | SVGSVGElement
  left: number
  size: number
  top: number
}

export interface BaseParticleOptions {
  particle?: string
  size?: number
}

export interface CoolParticle extends BaseParticle {
  direction: number
  speedHorz: number
  speedUp: number
  spinSpeed: number
  spinVal: number
}

export interface CoolParticleOptions extends BaseParticleOptions {
  particleCount?: number
  speedHorz?: number
  speedUp?: number
}

const SVG_NS = "http://www.w3.org/2000/svg"

const getContainer = () => {
  const id = "_coolMode_effect"
  const existingContainer = document.getElementById(id)

  if (existingContainer) {
    return existingContainer
  }

  const container = document.createElement("div")
  container.setAttribute("id", id)
  container.setAttribute(
    "style",
    "overflow:hidden; position:fixed; height:100%; top:0; left:0; right:0; bottom:0; pointer-events:none; z-index:2147483647"
  )

  document.body.appendChild(container)

  return container
}

let instanceCounter = 0

const applyParticleEffect = (
  element: HTMLElement,
  options?: CoolParticleOptions
): (() => void) => {
  instanceCounter++

  const defaultParticle = "circle"
  const particleType = options?.particle || defaultParticle
  const sizes = [28, 34, 40]
  const limit = 45

  let particles: CoolParticle[] = []
  let autoAddParticle = false
  let mouseX = 0
  let mouseY = 0

  const container = getContainer()

  const appendCircleParticle = (particle: HTMLDivElement, size: number) => {
    const circleSVG = document.createElementNS(SVG_NS, "svg")
    const circle = document.createElementNS(SVG_NS, "circle")

    circle.setAttributeNS(null, "cx", (size / 2).toString())
    circle.setAttributeNS(null, "cy", (size / 2).toString())
    circle.setAttributeNS(null, "r", (size / 2).toString())
    circle.setAttributeNS(null, "fill", `hsl(${Math.random() * 360}, 70%, 50%)`)

    circleSVG.appendChild(circle)
    circleSVG.setAttribute("width", size.toString())
    circleSVG.setAttribute("height", size.toString())

    particle.appendChild(circleSVG)
  }

  const appendImageParticle = (
    particle: HTMLDivElement,
    imageSrc: string,
    size: number
  ) => {
    const image = document.createElement("img")
    image.src = imageSrc
    image.width = size
    image.height = size
    image.alt = ""
    image.style.borderRadius = "50%"

    particle.appendChild(image)
  }

  const appendTextParticle = (
    particle: HTMLDivElement,
    particleContent: string,
    size: number
  ) => {
    const content = document.createElement("div")

    content.textContent = particleContent
    content.style.fontSize = `${size}px`
    content.style.lineHeight = "1"
    content.style.textAlign = "center"
    content.style.width = `${size}px`
    content.style.height = `${size}px`
    content.style.display = "flex"
    content.style.alignItems = "center"
    content.style.justifyContent = "center"

    particle.appendChild(content)
  }

  const appendBrutalistFileSvgParticle = (particle: HTMLDivElement, size: number) => {
    const isDark = Math.random() <= 0.5
    const mainColor = isDark ? "#000000" : "#ffffff"
    const strokeColor = isDark ? "#ffffff" : "#000000"
    const shadowColor = isDark ? "#ffffff" : "#000000"

    const svg = document.createElementNS(SVG_NS, "svg")
    svg.setAttribute("width", size.toString())
    svg.setAttribute("height", Math.round(size * 1.25).toString())
    svg.setAttribute("viewBox", "0 0 32 40")
    svg.setAttribute("fill", "none")

    svg.style.filter = `drop-shadow(2px 2px 0px ${shadowColor})`

    const page = document.createElementNS(SVG_NS, "path")
    page.setAttribute("d", "M 3 2 H 21 L 29 10 V 38 H 3 Z")
    page.setAttribute("fill", mainColor)
    page.setAttribute("stroke", strokeColor)
    page.setAttribute("stroke-width", "2.5")
    page.setAttribute("stroke-linejoin", "miter")

    const fold = document.createElementNS(SVG_NS, "path")
    fold.setAttribute("d", "M 21 2 V 10 H 29")
    fold.setAttribute("fill", "none")
    fold.setAttribute("stroke", strokeColor)
    fold.setAttribute("stroke-width", "2.5")
    fold.setAttribute("stroke-linejoin", "miter")

    const line1 = document.createElementNS(SVG_NS, "line")
    line1.setAttribute("x1", "8")
    line1.setAttribute("y1", "17")
    line1.setAttribute("x2", "23")
    line1.setAttribute("y2", "17")
    line1.setAttribute("stroke", strokeColor)
    line1.setAttribute("stroke-width", "2.5")
    line1.setAttribute("stroke-linecap", "square")

    const line2 = document.createElementNS(SVG_NS, "line")
    line2.setAttribute("x1", "8")
    line2.setAttribute("y1", "24")
    line2.setAttribute("x2", "23")
    line2.setAttribute("y2", "24")
    line2.setAttribute("stroke", strokeColor)
    line2.setAttribute("stroke-width", "2.5")
    line2.setAttribute("stroke-linecap", "square")

    const line3 = document.createElementNS(SVG_NS, "line")
    line3.setAttribute("x1", "8")
    line3.setAttribute("y1", "31")
    line3.setAttribute("x2", "17")
    line3.setAttribute("y2", "31")
    line3.setAttribute("stroke", strokeColor)
    line3.setAttribute("stroke-width", "2.5")
    line3.setAttribute("stroke-linecap", "square")

    svg.appendChild(page)
    svg.appendChild(fold)
    svg.appendChild(line1)
    svg.appendChild(line2)
    svg.appendChild(line3)

    particle.appendChild(svg)
  }

  function generateParticle() {
    const size =
      options?.size || sizes[Math.floor(Math.random() * sizes.length)]
    const speedHorz = options?.speedHorz || Math.random() * 3
    const speedUp = options?.speedUp || Math.random() * 8 + 4
    const spinVal = Math.random() * 360
    const spinSpeed = Math.random() * 20 * (Math.random() <= 0.5 ? -1 : 1)
    const top = mouseY - size / 2
    const left = mouseX - size / 2
    const direction = Math.random() <= 0.5 ? -1 : 1

    const particle = document.createElement("div")

    if (particleType === "brutalist-cv" || particleType === "brutalist-file") {
      appendBrutalistFileSvgParticle(particle, size)
    } else if (particleType === "circle") {
      appendCircleParticle(particle, size)
    } else if (
      particleType.startsWith("http") ||
      particleType.startsWith("/")
    ) {
      appendImageParticle(particle, particleType, size)
    } else {
      appendTextParticle(particle, particleType, size)
    }

    particle.style.position = "absolute"
    particle.style.transform = `translate3d(${left}px, ${top}px, 0px) rotate(${spinVal}deg)`

    container.appendChild(particle)

    particles.push({
      direction,
      element: particle,
      left,
      size,
      speedHorz,
      speedUp,
      spinSpeed,
      spinVal,
      top,
    })
  }

  function refreshParticles() {
    particles.forEach((p) => {
      p.left = p.left - p.speedHorz * p.direction
      p.top = p.top - p.speedUp
      // Smooth gravity curve: float up then drift down gracefully (capped at -5px/frame)
      p.speedUp = Math.max(-5, p.speedUp - 0.25)
      p.spinVal = p.spinVal + p.spinSpeed

      if (
        p.top >=
        Math.max(window.innerHeight, document.body.clientHeight) + p.size
      ) {
        particles = particles.filter((o) => o !== p)
        p.element.remove()
      }

      p.element.setAttribute(
        "style",
        [
          "position:absolute",
          "will-change:transform",
          `top:${p.top}px`,
          `left:${p.left}px`,
          `transform:rotate(${p.spinVal}deg)`,
        ].join(";")
      )
    })
  }

  let animationFrame: number | undefined

  let lastParticleTimestamp = 0
  const particleGenerationDelay = 30

  function loop() {
    const currentTime = performance.now()
    if (
      autoAddParticle &&
      particles.length < limit &&
      currentTime - lastParticleTimestamp > particleGenerationDelay
    ) {
      generateParticle()
      lastParticleTimestamp = currentTime
    }

    refreshParticles()
    animationFrame = requestAnimationFrame(loop)
  }

  loop()

  const isTouchInteraction = "ontouchstart" in window

  const tap = isTouchInteraction ? "touchstart" : "mousedown"
  const tapEnd = isTouchInteraction ? "touchend" : "mouseup"
  const move = isTouchInteraction ? "touchmove" : "mousemove"

  const updateMousePosition = (e: MouseEvent | TouchEvent) => {
    if ("touches" in e) {
      mouseX = e.touches?.[0].clientX
      mouseY = e.touches?.[0].clientY
    } else {
      mouseX = e.clientX
      mouseY = e.clientY
    }
  }

  const tapHandler = (e: MouseEvent | TouchEvent) => {
    updateMousePosition(e)
    autoAddParticle = true
  }

  const disableAutoAddParticle = () => {
    autoAddParticle = false
  }

  element.addEventListener(move, updateMousePosition, { passive: true })
  element.addEventListener(tap, tapHandler, { passive: true })
  element.addEventListener(tapEnd, disableAutoAddParticle, { passive: true })
  element.addEventListener("mouseleave", disableAutoAddParticle, {
    passive: true,
  })

  return () => {
    element.removeEventListener(move, updateMousePosition)
    element.removeEventListener(tap, tapHandler)
    element.removeEventListener(tapEnd, disableAutoAddParticle)
    element.removeEventListener("mouseleave", disableAutoAddParticle)

    const interval = setInterval(() => {
      if (animationFrame && particles.length === 0) {
        cancelAnimationFrame(animationFrame)
        clearInterval(interval)

        if (--instanceCounter === 0) {
          container.remove()
        }
      }
    }, 500)
  }
}

interface CoolModeProps {
  children: ReactNode
  options?: CoolParticleOptions
  className?: string
}

export const CoolMode: React.FC<CoolModeProps> = ({ children, options, className }) => {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const element = ref.current
    let cleanup: (() => void) | null = null

    if (element) {
      cleanup = applyParticleEffect(element, options)
    }

    return () => {
      if (cleanup) {
        cleanup()
      }
    }
  }, [options])

  return <span ref={ref} className={className || "w-full block"}>{children}</span>
}
