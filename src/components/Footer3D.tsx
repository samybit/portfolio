"use client";

import { useEffect, useRef } from "react";

interface FooterArtProps {
  isInView: boolean;
  isEmber: boolean;
  isNeumorphic: boolean;
}

export default function Footer3D({ isInView, isEmber, isNeumorphic }: FooterArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    // Track mouse for interactive particle repulsion
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Particle setup
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 32 : 65;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * (width || 800),
      y: Math.random() * (height || 400),
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.8 + 1.2,
      baseAlpha: Math.random() * 0.5 + 0.3,
    }));

    let time = 0;

    const render = () => {
      if (!isInView) return;

      time += 0.012;
      ctx.clearRect(0, 0, width, height);

      // Determine color palette based on active theme
      let primaryColor = "255, 255, 255";
      let accentColor = "0, 240, 255";
      let gridAlpha = 0.14;

      if (isEmber) {
        primaryColor = "255, 79, 0";
        accentColor = "255, 140, 0";
        gridAlpha = 0.22;
      } else if (isNeumorphic) {
        primaryColor = "55, 65, 81";
        accentColor = "31, 41, 55";
        gridAlpha = 0.16;
      }

      // 1. Draw Kinetic Horizon Waves (3D Perspective Waves)
      ctx.save();
      ctx.lineWidth = 1;
      const horizonY = height * 0.35;
      const rows = 12;

      for (let i = 0; i < rows; i++) {
        const progress = i / rows;
        const y = horizonY + Math.pow(progress, 1.8) * (height - horizonY);
        const lineAlpha = (1 - Math.abs(progress - 0.5) * 1.4) * gridAlpha;

        ctx.strokeStyle = `rgba(${primaryColor}, ${Math.max(0, lineAlpha)})`;
        ctx.beginPath();

        const step = isMobile ? 24 : 14;
        for (let x = 0; x <= width; x += step) {
          const wave = Math.sin(time + x * 0.007 + i * 0.45) * (4 + i * 1.3);
          if (x === 0) {
            ctx.moveTo(x, y + wave);
          } else {
            ctx.lineTo(x, y + wave);
          }
        }
        ctx.stroke();
      }
      ctx.restore();

      // 2. Draw Perspective Converging Grid Lines
      ctx.save();
      const perspectiveCols = isMobile ? 12 : 24;
      const centerX = width / 2;
      ctx.lineWidth = 1;
      ctx.strokeStyle = `rgba(${primaryColor}, ${gridAlpha * 0.75})`;

      for (let i = 0; i <= perspectiveCols; i++) {
        const xFactor = (i / perspectiveCols - 0.5) * 2;
        const startX = centerX + xFactor * (width * 0.22);
        const endX = centerX + xFactor * (width * 0.95);

        ctx.beginPath();
        ctx.moveTo(startX, horizonY);
        ctx.lineTo(endX, height);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Update & Render Interactive Particle Constellation Nodes
      const mouse = mouseRef.current;
      const connectionDist = isMobile ? 85 : 125;
      const mouseDistThreshold = 130;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // Position physics update
        p.x += p.vx;
        p.y += p.vy;

        // Screen boundary wrapping
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interactive mouse attraction / collection physics
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);

        if (dist < mouseDistThreshold && dist > 2) {
          const force = (1 - dist / mouseDistThreshold) * 1.8;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Draw laser connection lines directly from particle to mouse cursor
        if (dist < mouseDistThreshold) {
          const mouseAlpha = (1 - dist / mouseDistThreshold) * 0.45;
          ctx.strokeStyle = `rgba(${accentColor}, ${mouseAlpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }

        // Draw particle node
        const pulse = Math.sin(time * 2 + i) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(${primaryColor}, ${p.baseAlpha * pulse})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Connect nearby nodes with dynamic laser lines
        for (let j = i + 1; j < particleCount; j++) {
          const p2 = particles[j];
          const pDistance = Math.hypot(p.x - p2.x, p.y - p2.y);

          if (pDistance < connectionDist) {
            const alpha = (1 - pDistance / connectionDist) * 0.22;
            ctx.strokeStyle = `rgba(${accentColor}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isInView, isEmber, isNeumorphic]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block pointer-events-auto"
      style={{ touchAction: "none" }}
    />
  );
}
