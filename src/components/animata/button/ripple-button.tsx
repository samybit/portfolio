"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import "./ripple-button.css";

interface RippleButtonProps {
  children: React.ReactNode;
  as?: "button" | typeof Link | "a";
  href?: string;
  className?: string;
  onClick?: (e: any) => void;
  onHoverChange?: (hovered: boolean) => void;
}

export default function RippleButton({ children, as: Component = "button", href, className, onClick, onHoverChange, ...props }: RippleButtonProps) {
  const buttonRef = useRef<any>(null);
  const rippleRef = useRef<HTMLSpanElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const setHoverState = (hovered: boolean) => {
    setIsHovered(hovered);
    if (onHoverChange) onHoverChange(hovered);
  };

  const getCoordinates = (event: React.MouseEvent | React.TouchEvent) => {
    if ("touches" in event && event.touches.length > 0) {
      return { clientX: event.touches[0].clientX, clientY: event.touches[0].clientY };
    }
    return { clientX: (event as React.MouseEvent).clientX, clientY: (event as React.MouseEvent).clientY };
  };

  const createRipple = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (isHovered || !buttonRef.current || !rippleRef.current) return;
      setHoverState(true);

      const button = buttonRef.current;
      const ripple = rippleRef.current;
      const rect = button.getBoundingClientRect();
      rectRef.current = rect;
      const size = Math.max(rect.width, rect.height) * 2.5; // Made slightly larger to ensure full coverage
      const { clientX, clientY } = getCoordinates(event);
      const x = clientX - rect.left - size / 2;
      const y = clientY - rect.top - size / 2;

      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      ripple.classList.remove("ripple-leave");
      ripple.classList.add("ripple-enter");
    },
    [isHovered, onHoverChange],
  );

  const removeRipple = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!buttonRef.current || !rippleRef.current) return;
    setHoverState(false);

    const button = buttonRef.current;
    const ripple = rippleRef.current;
    const rect = rectRef.current || button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2.5;
    
    let clientX, clientY;
    if ("changedTouches" in event && event.changedTouches.length > 0) {
      clientX = event.changedTouches[0].clientX;
      clientY = event.changedTouches[0].clientY;
    } else if ("clientX" in event) {
      clientX = (event as React.MouseEvent).clientX;
      clientY = (event as React.MouseEvent).clientY;
    } else {
      clientX = rect.left + rect.width / 2;
      clientY = rect.top + rect.height / 2;
    }

    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;

    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    ripple.classList.remove("ripple-enter");
    ripple.classList.add("ripple-leave");

    const handleAnimationEnd = () => {
      if (ripple) {
        ripple.classList.remove("ripple-leave");
        ripple.removeEventListener("animationend", handleAnimationEnd);
      }
    };

    ripple.addEventListener("animationend", handleAnimationEnd);
  }, [onHoverChange]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (!buttonRef.current || !rippleRef.current || !isHovered) return;

      const button = buttonRef.current;
      const ripple = rippleRef.current;
      const rect = rectRef.current;
      if (!rect) return;
      const size = Math.max(rect.width, rect.height) * 2.5;
      const { clientX, clientY } = getCoordinates(event);
      const x = clientX - rect.left - size / 2;
      const y = clientY - rect.top - size / 2;

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
    },
    [isHovered],
  );

  return (
    <Component
      ref={buttonRef}
      href={href as string}
      className={`relative overflow-hidden ${className || ""}`}
      onMouseEnter={createRipple}
      onMouseLeave={removeRipple}
      onMouseMove={handleMouseMove}
      onTouchStart={createRipple}
      onTouchEnd={removeRipple}
      onTouchMove={handleMouseMove}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center w-full h-full pointer-events-none">{children}</span>
      <span ref={rippleRef} className="ripple" />
    </Component>
  );
}
