"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

// --- 3D INTERACTIVE OBJECT ---
function BrutalistGeometry() {
  const meshRef = useRef<THREE.Mesh>(null);

  // We track the mouse directly from the window so it works even when the canvas 
  // is set to pointer-events-none to let you click the button underneath it.
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates to Three.js standards (-1 to +1)
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    // Constant slow, aggressive rotation
    meshRef.current.rotation.x += 0.002;
    meshRef.current.rotation.y += 0.003;

    // Multiply by 3 to give it that exaggerated, heavy swing
    const targetX = mouse.current.x * 3;
    const targetY = mouse.current.y * 3;

    meshRef.current.position.x += (targetX - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.05;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[2.5, 0.6, 128, 16]} />
      {/* Must be pure white (#ffffff) for the difference blend mode to invert colors perfectly */}
      <meshBasicMaterial color="#ffffff" wireframe={true} />
    </mesh>
  );
}

export default function CTA() {

  // Custom scroll handler to force the browser to scroll down 
  // even if the URL already says #contact
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      // Update the URL without reloading the page
      window.history.pushState(null, "", "/#contact");
    }
  };

  return (
    <section className="relative w-full min-h-[80vh] flex flex-col items-center justify-center overflow-hidden border-t-8 border-b-8 border-black group my-24 bg-black">

      {/* --- LAYER 1: THE CANVAS AND TEXTURE (z-0) --- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/painting4.jpg"
          alt="Classical Art Background"
          fill
          className="object-cover grayscale contrast-[1.2] brightness-[0.35] group-hover:grayscale-0 group-hover:brightness-[0.6] transition-all duration-700 ease-in-out"
        />
        {/* Aggressive dot grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#000_3px,transparent_0)] bg-[size:16px_16px] opacity-50 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* --- LAYER 2: THE CONTENT BOX (z-10) --- */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative z-10 w-full max-w-2xl px-6 pointer-events-none"
      >
        <div className="brutalist-container !bg-white !text-black p-8 md:p-12 text-center flex flex-col items-center gap-6 shadow-[16px_16px_0px_0px_#000000] pointer-events-auto">

          <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            Ready to build?
          </h2>

          <p className="text-lg md:text-xl max-w-lg font-bold uppercase text-zinc-600">
            Currently open for freelance projects and full-time roles. Let's make something impactful.
          </p>

          {/* Added onClick handler to hijack the default routing */}
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

      {/* --- LAYER 3: THE 3D INVERSION SCANNER (z-20) --- */}
      {/* 1. mix-blend-difference forces the white wireframe to invert everything behind it.
        2. pointer-events-none ensures it doesn't block the button clicks.
      */}
      <div className="absolute inset-0 z-20 mix-blend-difference pointer-events-none">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <BrutalistGeometry />
        </Canvas>
      </div>

    </section>
  );
}