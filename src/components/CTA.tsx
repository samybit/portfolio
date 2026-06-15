"use client";

import { motion, useInView } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef, useEffect, useMemo, useState } from "react";
import * as THREE from "three";

// --- 3D INTERACTIVE OBJECT: THE LIQUID ANOMALY LEAK ---
function SystemLeak({ isCanvasInView }: { isCanvasInView: boolean }) {
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

  const coreRef = useRef<THREE.Mesh>(null);
  const dropsGroupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  let anomalyColor = "#ffffff";
  if (isEmber) {
    anomalyColor = "#FF3300";
  } else if (isNeumorphic) {
    anomalyColor = "#3d3426"; // Renders as the Neumorphic shadow color #a3b1c6, turns deep navy over text
  }

  const boxGeom = useMemo(() => new THREE.BoxGeometry(1.5, 1.5, 1.5), []);
  const boxMat = useMemo(() => new THREE.MeshBasicMaterial({ color: anomalyColor }), [anomalyColor]);

  useEffect(() => {
    return () => {
      boxGeom.dispose();
    };
  }, [boxGeom]);

  useEffect(() => {
    return () => {
      boxMat.dispose();
    };
  }, [boxMat]);

  const [dropsData] = useState(() => {
    return Array.from({ length: 25 }, () => ({
      offsetX: (Math.random() - 0.5) * 1.5,
      offsetY: (Math.random() - 0.5) * 1.5,
      speed: Math.random() * 0.04 + 0.01,
      scale: Math.random() * 0.15 + 0.05,
      rotSpeedX: Math.random() * 0.05,
      rotSpeedY: Math.random() * 0.05,
    }));
  });

  useEffect(() => {
    if (!isCanvasInView) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isCanvasInView]);

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

      // Move down at the original graceful slow speed
      drop.position.y -= data.speed;

      // Slowly rotate
      drop.rotation.x += data.rotSpeedX;
      drop.rotation.y += data.rotSpeedY;

      // Calculate vertical distance from the core center
      const distanceY = core.position.y - drop.position.y;
      const startBuddingDist = 1.0; // starts growing inside the core
      const fullGrowthDist = 2.3; // fully grown and detached when it clears the core boundary

      let scaleFactor = 0;
      if (distanceY > startBuddingDist) {
        scaleFactor = Math.min((distanceY - startBuddingDist) / (fullGrowthDist - startBuddingDist), 1);
      }

      // Smoothstep easing for organic scale growth
      const easedScale = scaleFactor * scaleFactor * (3 - 2 * scaleFactor);
      drop.scale.set(data.scale * easedScale, data.scale * easedScale, data.scale * easedScale);

      // Resolve dynamic offset for Neumorphic width adjustments
      const offsetX = drop.userData.offsetX !== undefined ? drop.userData.offsetX : data.offsetX;
      const offsetZ = drop.userData.offsetZ !== undefined ? drop.userData.offsetZ : 0;

      // Cling to the core's horizontal movement while budding
      if (distanceY < fullGrowthDist) {
        const attachFactor = 1 - (distanceY - startBuddingDist) / (fullGrowthDist - startBuddingDist);
        const clampedAttach = Math.max(0, Math.min(1, attachFactor));
        // Interpolate horizontal position towards core + offset
        drop.position.x += (core.position.x + offsetX - drop.position.x) * clampedAttach * 0.15;
        drop.position.z += (core.position.z + offsetZ - drop.position.z) * clampedAttach * 0.15;
      }

      // Reset when falling past the bottom boundary of the canvas
      if (drop.position.y < -5) {
        const radius = 2.1;
        // Spans a very wide bottom hemisphere (almost equator to equator) for a wide rain effect
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        drop.userData.offsetX = Math.cos(angle) * radius * 0.95;
        drop.userData.offsetZ = (Math.random() - 0.5) * 2.5;

        drop.position.x = core.position.x + drop.userData.offsetX;
        drop.position.y = core.position.y + Math.sin(angle) * radius * 0.95;
        drop.position.z = core.position.z + drop.userData.offsetZ;
      }
    });
  });

  return (
    <>
      <mesh ref={coreRef}>
        <sphereGeometry args={[2.1, 32, 32]} />
        <MeshDistortMaterial
          color={anomalyColor}
          distort={0.3}
          speed={1}
          roughness={1}
        />
      </mesh>

      <group ref={dropsGroupRef}>
        {dropsData.map((data, i) => (
          <mesh
            key={i}
            position={[0, -10, 0]}
            scale={data.scale}
            geometry={boxGeom}
            material={boxMat}
          />
        ))}
      </group>
    </>
  );
}

// --- 3D INTERACTIVE OBJECT: MECHANICAL ARROW ---
function MechanicalArrow({ isCanvasInView }: { isCanvasInView: boolean }) {
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

  const coreRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  let anomalyColor = "#ffffff";
  if (isEmber) {
    anomalyColor = "#FF3300";
  } else if (isNeumorphic) {
    anomalyColor = "#3d3426";
  }

  const boxGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const boxMat = useMemo(() => new THREE.MeshBasicMaterial({ color: anomalyColor }), [anomalyColor]);

  useEffect(() => {
    return () => {
      boxGeom.dispose();
    };
  }, [boxGeom]);

  useEffect(() => {
    return () => {
      boxMat.dispose();
    };
  }, [boxMat]);

  useEffect(() => {
    if (!isCanvasInView) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isCanvasInView]);

  useFrame(() => {
    const core = coreRef.current;
    if (!core) return;

    const targetX = mouse.current.x * 8;
    const targetY = mouse.current.y * 5;

    // Graceful interpolation
    core.position.x += (targetX - core.position.x) * 0.06;
    core.position.y += (targetY - core.position.y) * 0.06;

    const targetRotX = -mouse.current.y * 1.5;
    const targetRotY = mouse.current.x * 1.5;

    core.rotation.x += (targetRotX - core.rotation.x) * 0.06 + 0.005;
    core.rotation.y += (targetRotY - core.rotation.y) * 0.06 + 0.01;
  });

  return (
    <group ref={coreRef} rotation={[0, 0, -Math.PI / 4]}>
      {/* Shaft */}
      <mesh position={[0, -0.5, 0]} scale={[0.4, 6, 0.4]} geometry={boxGeom} material={boxMat} />
      {/* Arrowhead Left Fin */}
      <mesh position={[-0.8, 1.7, 0]} scale={[0.4, 2.5, 0.4]} rotation={[0, 0, Math.PI / 4]} geometry={boxGeom} material={boxMat} />
      {/* Arrowhead Right Fin */}
      <mesh position={[0.8, 1.7, 0]} scale={[0.4, 2.5, 0.4]} rotation={[0, 0, -Math.PI / 4]} geometry={boxGeom} material={boxMat} />

      {/* Decorative floating mechanical bits */}
      <mesh position={[-2, -3, 0]} scale={[0.3, 0.3, 0.3]} geometry={boxGeom} material={boxMat} />
      <mesh position={[2, -2, 1]} scale={[0.4, 0.4, 0.4]} geometry={boxGeom} material={boxMat} />
    </group>
  );
}

// --- 3D INTERACTIVE OBJECT: BRUTAL CROSS ---
function BrutalCross({ isCanvasInView }: { isCanvasInView: boolean }) {
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

  const coreRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });

  let anomalyColor = "#ffffff";
  if (isEmber) {
    anomalyColor = "#FF3300";
  } else if (isNeumorphic) {
    anomalyColor = "#3d3426";
  }

  const boxGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const boxMat = useMemo(() => new THREE.MeshBasicMaterial({ color: anomalyColor }), [anomalyColor]);

  useEffect(() => {
    return () => {
      boxGeom.dispose();
    };
  }, [boxGeom]);

  useEffect(() => {
    return () => {
      boxMat.dispose();
    };
  }, [boxMat]);

  useEffect(() => {
    if (!isCanvasInView) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isCanvasInView]);

  useFrame(() => {
    const core = coreRef.current;
    if (!core) return;

    const targetX = mouse.current.x * 8;
    const targetY = mouse.current.y * 5;

    core.position.x += (targetX - core.position.x) * 0.06;
    core.position.y += (targetY - core.position.y) * 0.06;

    const targetRotX = -mouse.current.y * 1.5;
    const targetRotY = mouse.current.x * 1.5;

    core.rotation.x += (targetRotX - core.rotation.x) * 0.06 + 0.005;
    core.rotation.y += (targetRotY - core.rotation.y) * 0.06 + 0.01;
    core.rotation.z += 0.005; // Slow ambient spin
  });

  return (
    <group ref={coreRef}>
      <mesh position={[0, 0, 0]} scale={[1.2, 5, 1.2]} geometry={boxGeom} material={boxMat} />
      <mesh position={[0, 0, 0]} scale={[5, 1.2, 1.2]} geometry={boxGeom} material={boxMat} />
    </group>
  );
}

// --- 3D INTERACTIVE OBJECT: WIREFRAME MONOLITH ---
function WireframeMonolith({ isCanvasInView }: { isCanvasInView: boolean }) {
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

  const coreRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });

  let anomalyColor = "#ffffff";
  if (isEmber) {
    anomalyColor = "#FF3300";
  } else if (isNeumorphic) {
    anomalyColor = "#3d3426";
  }

  const boxGeom = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const wireMat = useMemo(() => new THREE.MeshBasicMaterial({ color: anomalyColor, wireframe: true }), [anomalyColor]);
  const solidMat = useMemo(() => new THREE.MeshBasicMaterial({ color: anomalyColor }), [anomalyColor]);

  useEffect(() => {
    return () => {
      boxGeom.dispose();
    };
  }, [boxGeom]);

  useEffect(() => {
    return () => {
      wireMat.dispose();
      solidMat.dispose();
    };
  }, [wireMat, solidMat]);

  useEffect(() => {
    if (!isCanvasInView) return;
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isCanvasInView]);

  useFrame(() => {
    const core = coreRef.current;
    const inner = innerRef.current;
    if (!core || !inner) return;

    const targetX = mouse.current.x * 8;
    const targetY = mouse.current.y * 5;

    core.position.x += (targetX - core.position.x) * 0.06;
    core.position.y += (targetY - core.position.y) * 0.06;

    const targetRotX = -mouse.current.y * 1.5;
    const targetRotY = mouse.current.x * 1.5;

    core.rotation.x += (targetRotX - core.rotation.x) * 0.06 + 0.005;
    core.rotation.y += (targetRotY - core.rotation.y) * 0.06 + 0.01;

    // Counter-rotate the inner solid core for a cool effect
    inner.rotation.x -= 0.01;
    inner.rotation.y += 0.015;
  });

  return (
    <group ref={coreRef}>
      <mesh scale={[4, 4, 4]} geometry={boxGeom} material={wireMat} />
      <mesh ref={innerRef} scale={[1, 1, 1]} geometry={boxGeom} material={solidMat} />
    </group>
  );
}

export default function CTA({ dict }: { dict: Record<string, string> }) {
  const [isEmber, setIsEmber] = useState(false);
  const [isNeumorphic, setIsNeumorphic] = useState(false);

  const anomalies = ['arrow', 'cross', 'wireframe', 'leak'] as const;
  const [anomalyIndex, setAnomalyIndex] = useState(1);
  const activeAnomaly = anomalies[anomalyIndex];

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

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
      const currentLocale = window.location.pathname.split('/')[1] || 'en';
      window.history.pushState(null, "", `/${currentLocale}#contact`);
    }
  };

  const ctaRef = useRef<HTMLElement>(null);

  // 1. Hardware Observer: GPU Killswitch to prevent massive lag when offscreen
  const isCanvasInView = useInView(ctaRef, { margin: "0px 0px 0px 0px" });

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let hasSnapped = false;

    const handleScroll = () => {
      // We only want to evaluate the layout and trigger the snap when the user STOPS scrolling.
      // This completely eliminates layout thrashing and scroll lag.
      clearTimeout(timeoutId);

      timeoutId = setTimeout(() => {
        if (!ctaRef.current) return;

        const rect = ctaRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate how much of the element is visible
        const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
        const ratio = visibleHeight / windowHeight;

        // Reset the lock if they completely scroll away
        if (ratio < 0.2) {
          hasSnapped = false;
        }

        // If they are in the magnetic zone (mostly visible but not perfectly centered)
        if (ratio >= 0.55 && ratio < 0.98) {
          if (!hasSnapped) {
            ctaRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
            hasSnapped = true;
          }
        } else if (ratio >= 0.98) {
          // If they perfectly center it manually, lock it so they don't get trapped leaving
          hasSnapped = true;
        }
      }, 150); // Evaluate 150ms after they stop scrolling
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    // Swapped min-h-screen for min-h-[100dvh] and added py-16 so it never touches the screen edges
    <section
      ref={ctaRef}
      onClick={() => setAnomalyIndex(prev => (prev + 1) % anomalies.length)}
      className="relative w-full min-h-[100dvh] flex flex-col items-center justify-center py-16 overflow-hidden border-t-8 border-b-8 border-black bg-white text-black"
    >

      {/* --- LAYER 1: MECHANICAL ARROW BACKGROUND (z-0) --- */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg stroke='${isNeumorphic ? "%23a3b1c6" : "%23000000"}' stroke-width='6' fill='none' stroke-linecap='square' stroke-linejoin='miter'%3E%3Cline x1='25' y1='75' x2='72' y2='28' /%3E%3Cpolyline points='50,25 75,25 75,50' /%3E%3Cline x1='65' y1='5' x2='95' y2='35' /%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: "100px 100px"
        }}
      ></div>

      {/* --- LAYER 2: CONTENT BOX (z-10) --- */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col xl:flex-row items-center justify-between gap-16 pointer-events-none">

        {/* LEFT SIDE: The Quote */}
        <div className="flex-1 flex flex-col relative w-full">
          <div className="absolute -top-8 -left-2 md:-top-16 md:-left-8 text-black font-black text-[10rem] md:text-[18rem] leading-none opacity-5 pointer-events-none select-none rtl:-left-auto rtl:-right-2 rtl:md:-right-8">
            &quot;
          </div>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.5rem] xl:text-7xl font-black uppercase tracking-tighter leading-none relative z-10 bg-white/70 backdrop-blur-sm p-4 -ms-4 quote-backdrop"
          >
            &quot;{dict?.quote || "It's no use going back to yesterday, because I was a different person then."}&quot;
          </motion.blockquote>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4 mt-8 relative z-10 bg-white/70 backdrop-blur-sm p-4 -ms-4 max-w-max quote-backdrop"
          >
            {/* Brutalist Divider */}
            <div className="h-2 w-8 sm:w-16 md:w-24 bg-black shrink-0"></div>

            {/* Attribution */}
            <span className="text-[10px] sm:text-sm md:text-lg font-bold tracking-widest uppercase text-zinc-600 whitespace-nowrap pe-1">
              {dict?.attribution || "[ Alice in Wonderland / Lewis Carroll ]"}
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
              {dict?.title || "Ready to build?"}
            </h2>
            <p className="text-base md:text-lg lg:text-xl font-bold uppercase text-zinc-600">
              {dict?.description || "Currently open for freelance projects and full-time roles. Let's make something impactful."}
            </p>
            <Link
              href="#contact"
              onClick={handleScroll}
              className="group/btn relative inline-flex items-center justify-center bg-black text-white px-8 py-4 text-lg md:text-xl font-black uppercase tracking-widest border-4 border-black hover:bg-white hover:text-black transition-colors duration-200 mt-4"
            >
              <span>{dict?.button || "Get in touch"}</span>
              <ArrowUpRight className="ms-3 w-6 h-6 group-hover/btn:rotate-90 transition-transform duration-200 rtl:-scale-x-100 rtl:group-hover/btn:-rotate-90" />
            </Link>
          </div>
        </motion.div>

      </div>

      {/* --- LAYER 3: 3D SCANNER (z-20) --- */}
      {/* <div className="absolute inset-0 z-20 mix-blend-difference pointer-events-none">
        <Canvas
          frameloop={isCanvasInView ? "always" : "never"}
          dpr={[1, 1.5]}
          style={{ pointerEvents: "none" }}
          camera={{ position: [0, 0, 8], fov: 50 }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[10, 10, 5]} intensity={3} />
          <directionalLight position={[-10, -10, 2]} intensity={1.5} />
          {activeAnomaly === 'arrow' && <MechanicalArrow isCanvasInView={isCanvasInView} />}
          {activeAnomaly === 'cross' && <BrutalCross isCanvasInView={isCanvasInView} />}
          {activeAnomaly === 'wireframe' && <WireframeMonolith isCanvasInView={isCanvasInView} />}
          {activeAnomaly === 'leak' && <SystemLeak isCanvasInView={isCanvasInView} />}
        </Canvas>
      </div> */}

    </section>
  );
}