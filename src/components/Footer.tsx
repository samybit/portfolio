"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "framer-motion";

// --- 3D INTERACTIVE OBJECT: MASSIVE BACKGROUND KNOT ---
function BackgroundKnot({ isEmber, isNeumorphic }: { isEmber: boolean; isNeumorphic: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Slow, elegant continuous rotation on all axes
    meshRef.current.rotation.x = t * 0.05;
    meshRef.current.rotation.y = t * 0.075;
    meshRef.current.rotation.z = t * 0.05;
  });

  let knotColor = "#000000";
  let knotOpacity = 0.15;

  if (isEmber) {
    knotColor = "#FF4F00";
    knotOpacity = 0.2;
  } else if (isNeumorphic) {
    knotColor = "#ffffff";
    knotOpacity = 0.4;
  }

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      <torusKnotGeometry args={[5, 1.2, 256, 32, 3, 4]} />
      <MeshDistortMaterial 
        color={knotColor} 
        wireframe={true} 
        transparent={true} 
        opacity={knotOpacity} 
        distort={0.25} 
        speed={1.5} 
      />
    </mesh>
  );
}

export default function Footer() {
  // 1. Hardware Observer: Tracks if the footer is anywhere near the viewport
  const footerRef = useRef<HTMLElement>(null);
  // The margin ensures it wakes up slightly before the user actually sees it
  const isInView = useInView(footerRef, { margin: "200px 0px 200px 0px" });

  const [isEmber, setIsEmber] = useState(false);
  const [isNeumorphic, setIsNeumorphic] = useState(false);

  useEffect(() => {
    const checkTheme = () => {
      setIsEmber(document.documentElement.classList.contains("theme-color"));
      setIsNeumorphic(document.documentElement.classList.contains("theme-neumorphic"));
    };
    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} className="relative overflow-hidden bg-white border-t-8 border-black p-6 md:p-12">
      {/* --- LAYER 1: 3D KNOT BACKGROUND (z-0) --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* 2. The Engine Killswitch: 'never' pauses the GPU completely */}
        <Canvas
          frameloop={isInView ? "always" : "never"}
          camera={{ position: [0, 0, 8], fov: 50 }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[10, 10, 5]} intensity={3} />
          <BackgroundKnot isEmber={isEmber} isNeumorphic={isNeumorphic} />
        </Canvas>
      </div>

      {/* --- LAYER 2: FOOTER CONTENT (z-10) --- */}
      <div className="relative z-10 text-center flex flex-col items-center justify-center gap-4 pointer-events-none">
        <div className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
          Samy Barsoum
        </div>
        <p className="text-xl font-bold uppercase text-black bg-white px-3 py-1" suppressHydrationWarning>
          © {new Date().getFullYear()} SAMYBIT // WITH NEXT.JS & BRUTALISM.
        </p>
        <a
          href="#"
          className="mt-4 text-lg font-bold uppercase border-b-4 border-black pb-1 hover:bg-black hover:text-white transition-colors pointer-events-auto"
        >
          ↑ Back to top
        </a>
      </div>
    </footer>
  );
}