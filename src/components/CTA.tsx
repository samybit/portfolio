"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

// --- 3D INTERACTIVE OBJECT: THE LIQUID ANOMALY LEAK ---
function SystemLeak() {
  const coreRef = useRef<THREE.Mesh>(null);
  const dropsGroupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  // Generate 25 "drops" with random speeds, sizes, and initial offsets
  const dropsData = useMemo(() => {
    return Array.from({ length: 25 }, () => ({
      offsetX: (Math.random() - 0.5) * 1.5,
      offsetY: (Math.random() - 0.5) * 1.5,
      speed: Math.random() * 0.04 + 0.01,
      scale: Math.random() * 0.15 + 0.05,
      rotSpeedX: Math.random() * 0.05,
      rotSpeedY: Math.random() * 0.05,
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    // 1. Assign to local variables so TypeScript locks in their type
    const core = coreRef.current;
    const dropsGroup = dropsGroupRef.current;

    // 2. If either is null (like on the very first frame), skip the math
    if (!core || !dropsGroup) return;

    const targetX = mouse.current.x * 4;
    const targetY = mouse.current.y * 4;

    // 3. Use the local, TypeScript-approved variables
    core.position.x += (targetX - core.position.x) * 0.05;
    core.position.y += (targetY - core.position.y) * 0.05;
    core.rotation.x += 0.01;
    core.rotation.y += 0.02;

    dropsGroup.children.forEach((drop, index) => {
      const data = dropsData[index];

      drop.position.y -= data.speed;
      drop.rotation.x += data.rotSpeedX;
      drop.rotation.y += data.rotSpeedY;

      if (drop.position.y < -5) {
        drop.position.x = core.position.x + data.offsetX;
        drop.position.y = core.position.y + data.offsetY;
      }
    });
  });

  return (
    <>
      {/* The Liquid Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.8, 64, 64]} />
        <MeshDistortMaterial
          color="#E0F0F4"
          distort={0.3}
          speed={1}
          roughness={1}
        />
      </mesh>

      {/* The Leaking Data Drops */}
      <group ref={dropsGroupRef}>
        {dropsData.map((data, i) => (
          // Initialize way off-screen so they spawn naturally
          <mesh key={i} position={[0, -10, 0]} scale={data.scale}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </>
  );
}

// --- 3D INTERACTIVE OBJECT: MASSIVE BACKGROUND KNOT ---
function BackgroundKnot() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Slow, elegant continuous rotation on all axes
    meshRef.current.rotation.x = t * 0.05;
    meshRef.current.rotation.y = t * 0.075;
    meshRef.current.rotation.z = t * 0.05;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -8]}>
      {/* A single, large, highly segmented torus knot for a fine wireframe mesh look */}
      {/* args: [radius, tube, tubularSegments, radialSegments, p, q] */}
      <torusKnotGeometry args={[5, 1.2, 256, 32, 3, 4]} />
      <MeshDistortMaterial color="#ffffff" wireframe={true} transparent={true} opacity={0.25} distort={0.25} speed={1.5} />
    </mesh>
  );
}

export default function CTA() {

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", "/#contact");
    }
  };

  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden border-t-8 border-b-8 border-black group my-24 bg-black">

      {/* --- LAYER 1: BACKGROUND (z-0) --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/11.jpg"
          alt="Classical Art Background"
          fill
          priority
          className="object-cover grayscale contrast-[1.2] brightness-[0.5] group-hover:grayscale-0 group-hover:brightness-[0.65] transition-all duration-700 ease-in-out"
        />
        <div className="absolute inset-0 bg-[radial-gradient(#000_3px,transparent_0)] bg-[size:16px_16px] opacity-50 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* --- LAYER 2: CONTENT BOX (z-10) --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-2xl px-6 pointer-events-none"
      >
        {/* Removed ! modifiers and injected bg-white, text-black, border-black, and brutalist-shadow */}
        <div className="brutalist-container bg-white text-black border-4 border-black p-8 md:p-12 text-center flex flex-col items-center gap-6 brutalist-shadow pointer-events-auto">
          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Ready to build?
          </h2>
          <p className="text-lg md:text-xl max-w-lg font-bold uppercase text-zinc-600">
            Currently open for freelance projects and full-time roles. Let's make something impactful.
          </p>
          <Link
            href="/#contact"
            onClick={handleScroll}
            className="group/btn relative inline-flex items-center justify-center bg-black text-white px-8 py-4 text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors duration-200 mt-4"
          >
            <span>Get in touch</span>
            <ArrowUpRight className="ml-3 w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-200" />
          </Link>
        </div>
      </motion.div>

      {/* --- LAYER 3: 3D SCANNER (z-20) --- */}
      <div className="absolute inset-0 z-20 mix-blend-difference pointer-events-none">
        <Canvas style={{ pointerEvents: "none" }} camera={{ position: [0, 0, 8], fov: 50 }}>

          <ambientLight intensity={2} />
          <directionalLight position={[10, 10, 5]} intensity={3} />

          <SystemLeak />
          
          {/* Massive background wireframe knot */}
          <BackgroundKnot />
        </Canvas>
      </div>

    </section>
  );
}