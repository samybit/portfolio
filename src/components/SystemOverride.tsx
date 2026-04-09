"use client";

import { useEffect } from "react";

export default function SystemOverride() {
  useEffect(() => {
    // e.button === 1 is the Middle Mouse Button
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 1) {
        e.preventDefault(); // Stops the annoying Windows auto-scroll icon from appearing
        document.documentElement.classList.add("system-override");
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (e.button === 1) {
        document.documentElement.classList.remove("system-override");
      }
    };

    // We add it to the window so it works no matter where your mouse is
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return null; // Pure logic, no UI
}