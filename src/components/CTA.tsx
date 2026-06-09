"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";

// --- 3D INTERACTIVE OBJECT: THE LIQUID ANOMALY LEAK ---
function SystemLeak() {
  const coreRef = useRef<THREE.Mesh>(null);
  const dropsGroupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

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
    const core = coreRef.current;
    const dropsGroup = dropsGroupRef.current;

    if (!core || !dropsGroup) return;

    // Massive movement range so it can travel edge-to-edge freely
    const targetX = mouse.current.x * 8;
    const targetY = mouse.current.y * 5;

    // Graceful interpolation to glide towards the cursor rather than snapping instantly
    core.position.x += (targetX - core.position.x) * 0.06;
    core.position.y += (targetY - core.position.y) * 0.06;

    // Smooth rolling effect to match the graceful movement
    const targetRotX = -mouse.current.y * 3;
    const targetRotY = mouse.current.x * 3;

    core.rotation.x += (targetRotX - core.rotation.x) * 0.06 + 0.005;
    core.rotation.y += (targetRotY - core.rotation.y) * 0.06 + 0.01;

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
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.1, 64, 64]} />
        <MeshDistortMaterial
          color="#ffffff"
          distort={0.3}
          speed={1}
          roughness={1}
        />
      </mesh>

      <group ref={dropsGroupRef}>
        {dropsData.map((data, i) => (
          <mesh key={i} position={[0, -10, 0]} scale={data.scale}>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        ))}
      </group>
    </>
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

  const ctaRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let hasSnapped = false;

    const handleScroll = () => {
      if (!ctaRef.current) return;

      const rect = ctaRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how much of the element is visible
      // visibleHeight is the amount of pixels of the element currently on screen
      const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
      const ratio = visibleHeight / windowHeight;

      // Reset the lock if they completely scroll away
      if (ratio < 0.2) {
        hasSnapped = false;
      }

      // We only want to trigger the snap when the user STOPS scrolling.
      clearTimeout(timeoutId);

      // If they are in the magnetic zone (mostly visible but not perfectly centered)
      if (ratio >= 0.55 && ratio < 0.98) {
        if (!hasSnapped) {
          timeoutId = setTimeout(() => {
            if (ctaRef.current) {
              ctaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
              hasSnapped = true;
            }
          }, 150); // Fire 150ms after they stop scrolling
        }
      } else if (ratio >= 0.98) {
        // If they perfectly center it manually, lock it so they don't get trapped leaving
        hasSnapped = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    // Swapped min-h-screen for min-h-[100dvh] and added py-16 so it never touches the screen edges
    <section ref={ctaRef} className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center py-16 overflow-hidden border-t-8 border-b-8 border-black bg-white text-black">

      {/* --- LAYER 1: MECHANICAL ARROW BACKGROUND (z-0) --- */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg stroke='%23000000' stroke-width='6' fill='none' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cline x1='25' y1='75' x2='72' y2='28' /%3E%3Cpolyline points='50,25 75,25 75,50' /%3E%3Cline x1='65' y1='5' x2='95' y2='35' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px"
        }}
      ></div>

      {/* --- LAYER 2: CONTENT BOX (z-10) --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col xl:flex-row items-center justify-between gap-16 pointer-events-none">
        
        {/* LEFT SIDE: The Quote */}
        <div className="flex-1 flex flex-col relative w-full">
          <div className="absolute -top-8 -left-2 md:-top-16 md:-left-8 text-black font-black text-[10rem] md:text-[18rem] leading-none opacity-5 pointer-events-none select-none">
            "
          </div>
          <motion.blockquote 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-7xl font-black uppercase tracking-tighter leading-none relative z-10 bg-white/70 backdrop-blur-sm p-4 -ml-4"
          >
            "It's no use going back to yesterday, because I was a different person then."
          </motion.blockquote>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mt-8 relative z-10 bg-white/70 backdrop-blur-sm p-4 -ml-4 max-w-max"
          >
            {/* Brutalist Divider */}
            <div className="h-2 w-8 sm:w-16 md:w-24 bg-black shrink-0"></div>
            
            {/* Attribution */}
            <span className="text-sm sm:text-base md:text-lg font-bold tracking-widest uppercase text-zinc-600 whitespace-nowrap pr-1">
              [ Alice in Wonderland / Lewis Carroll ]
            </span>
          </motion.div>
        </div>

        {/* RIGHT SIDE: The CTA Box */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full xl:w-auto shrink-0"
        >
          <div className="brutalist-container bg-white text-black border-4 md:border-8 border-black p-8 md:p-12 text-center flex flex-col items-center gap-6 brutalist-shadow pointer-events-auto max-w-lg xl:max-w-xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
              Ready to build?
            </h2>
            <p className="text-base md:text-lg lg:text-xl font-bold uppercase text-zinc-600">
              Currently open for freelance projects and full-time roles. Let's make something impactful.
            </p>
            <Link
              href="/#contact"
              onClick={handleScroll}
              className="group/btn relative inline-flex items-center justify-center bg-black text-white px-8 py-4 text-lg md:text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors duration-200 mt-4"
            >
              <span>Get in touch</span>
              <ArrowUpRight className="ml-3 w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-200" />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* --- LAYER 3: 3D SCANNER (z-20) --- */}
      <div className="absolute inset-0 z-20 mix-blend-difference pointer-events-none">
        <Canvas style={{ pointerEvents: "none" }} camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={2} />
          <directionalLight position={[10, 10, 5]} intensity={3} />
          <SystemLeak />
        </Canvas>
      </div>

    </section>
  );
}