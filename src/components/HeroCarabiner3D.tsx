"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";

// --- THE TACTICAL CARABINER COMPONENT ---
function CarabinerModel() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Use React Three Fiber's internal size state to get pixel width for responsive scaling
  const { size } = useThree();
  const responsiveScale = size.width < 768 ? 0.65 : 1;

  // Physics simulation for tension and resisting ropes
  useFrame((state) => {
    if (!groupRef.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Very subtle, slow secondary motion to simulate gentle, soft tension
    const jitterX = Math.sin(time * 3) * 0.005 + Math.cos(time * 4) * 0.005;
    const jitterY = Math.cos(time * 2.5) * 0.005 + Math.sin(time * 3.5) * 0.005;
    const jitterZ = Math.sin(time * 3.2) * 0.005;
    
    // Slow, soft pulling in varying directions from the ropes
    const pullX = Math.sin(time * 0.8) * 0.04;
    const pullY = Math.cos(time * 0.6) * 0.04;
    const pullZ = Math.sin(time * 0.5) * 0.02;
    
    // Apply rotation tension
    groupRef.current.rotation.x = pullX + jitterX;
    groupRef.current.rotation.y = pullY + jitterY;
    groupRef.current.rotation.z = pullZ + jitterZ;

    // Apply slight physical displacement (getting pulled slightly off-center)
    groupRef.current.position.x = pullX * 2 + jitterX * 1.5;
    groupRef.current.position.y = pullY * 2 + jitterY * 1.5;
  });

  // Math for the triangle
  const R = 2.5; // Radius of the triangle
  const thickness = 0.3; // Tube thickness
  
  const p1 = new THREE.Vector3(0, R, 0); // Top
  const p2 = new THREE.Vector3(R * Math.cos(-Math.PI / 6), R * Math.sin(-Math.PI / 6), 0); // Bottom Right
  const p3 = new THREE.Vector3(-R * Math.cos(-Math.PI / 6), R * Math.sin(-Math.PI / 6), 0); // Bottom Left

  // Helper to calculate cylinder position and rotation between two points
  const getCylinderProps = (v1: THREE.Vector3, v2: THREE.Vector3) => {
    const distance = v1.distanceTo(v2);
    const position = v1.clone().lerp(v2, 0.5);
    
    // Create a matrix to align the cylinder (which points up Y by default) along the vector
    const direction = new THREE.Vector3().subVectors(v2, v1).normalize();
    const quaternion = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    
    return { position, quaternion, length: distance };
  };

  const side1 = getCylinderProps(p1, p2);
  const side2 = getCylinderProps(p2, p3);
  const side3 = getCylinderProps(p3, p1);

  // Procedurally generate a rugged, scratched texture for the metal using a Canvas
  const scratchedTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    if (!context) return null;
    
    // Base roughness
    context.fillStyle = "#888888";
    context.fillRect(0, 0, 1024, 1024);
    
    // Draw procedural scratches
    for (let i = 0; i < 2000; i++) {
      context.beginPath();
      // White scratches increase roughness, dark decrease it
      const isDeep = Math.random() > 0.8;
      context.strokeStyle = isDeep ? "#ffffff" : "#444444"; 
      context.lineWidth = isDeep ? Math.random() * 3 : Math.random() * 1.5;
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const len = Math.random() * 80 + 10;
      const angle = Math.random() * Math.PI * 2;
      context.moveTo(x, y);
      context.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      context.stroke();
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  }, []);

  // Procedurally generate a twisted rope fabric texture
  const ropeColorTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return null;
    
    // Base fabric color
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, 256, 256);
    
    // Draw thick spiral shadow lines to create twisted rope segments
    context.strokeStyle = "#cccccc";
    context.lineWidth = 16;
    for (let i = -256; i < 512; i += 48) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i + 256, 256);
      context.stroke();
    }
    
    // Add thin fibrous threads following the spiral
    context.strokeStyle = "#eeeeee";
    context.lineWidth = 2;
    for (let i = -256; i < 512; i += 6) {
      context.beginPath();
      context.moveTo(i, 0);
      context.lineTo(i + 256, 256);
      context.stroke();
    }
    
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    // Repeat along the cylinder to compress the spirals into tight twisted rope strands
    tex.repeat.set(2, 60); 
    return tex;
  }, []);

  // Materials (Rugged, tactical, scratched metal)
  const metalMaterial = <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.7} roughnessMap={scratchedTexture || undefined} bumpMap={scratchedTexture || undefined} bumpScale={0.015} />;
  const darkMetalMaterial = <meshStandardMaterial color="#3f3f46" metalness={0.8} roughness={0.75} roughnessMap={scratchedTexture || undefined} bumpMap={scratchedTexture || undefined} bumpScale={0.01} />;
  const yellowMaterial = <meshStandardMaterial color="#eab308" roughness={0.8} />;
  
  // Adjust the texture mapping for the complex 3D knot
  const knotColorTexture = useMemo(() => {
    if (!ropeColorTexture) return null;
    const tex = ropeColorTexture.clone();
    tex.repeat.set(2, 12); // Adjusted for the length of the complex knot curve
    return tex;
  }, [ropeColorTexture]);

  // Mathematically define a realistic 3D wrapped knot (like a Clove Hitch or Barrel Knot)
  const knotCurve = useMemo(() => {
    const r = thickness * 1.25; // Loop radius (wrapping tightly around the carabiner bar)
    const points = [
      // Entering rope tucking under the loops
      new THREE.Vector3(0, -0.1, r * 1.5),
      new THREE.Vector3(0, 0.05, r * 1.05),
      
      // Loop 1 (top wrap)
      new THREE.Vector3(-r, 0.15, 0),
      new THREE.Vector3(0, 0.2, -r),
      new THREE.Vector3(r, 0.2, 0),
      new THREE.Vector3(0, 0.15, r),
      
      // Crossing over the front diagonally
      new THREE.Vector3(-r * 0.8, 0.05, r * 1.4),
      
      // Loop 2 (bottom wrap)
      new THREE.Vector3(0, -0.05, r),
      new THREE.Vector3(r, -0.15, 0),
      new THREE.Vector3(0, -0.2, -r),
      
      // Exiting
      new THREE.Vector3(-r * 1.5, -0.1, 0),
    ];
    // Create a smooth 3D spline through these points
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  // A simpler single-wrap knot curve
  const simpleWrapCurve = useMemo(() => {
    const r = thickness * 1.25;
    const points = [
      new THREE.Vector3(0, 0, r * 1.5), // enter
      new THREE.Vector3(0, 0, r), // front
      new THREE.Vector3(-r, 0.1, 0), // left
      new THREE.Vector3(0, 0.1, -r), // back
      new THREE.Vector3(r, 0.1, 0), // right
      new THREE.Vector3(0, 0, r * 1.2), // crossing over front
      new THREE.Vector3(-r * 1.5, -0.1, 0), // exit
    ];
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  // A chaotic, messy tangled knot curve
  const messyKnotCurve = useMemo(() => {
    const r = thickness * 1.25;
    const points = [
      new THREE.Vector3(0, -0.2, r * 1.5), // enter
      
      new THREE.Vector3(0, -0.25, r), // front
      new THREE.Vector3(r, -0.2, 0), // right
      new THREE.Vector3(0, -0.15, -r), // back
      new THREE.Vector3(-r, -0.1, 0), // left
      
      new THREE.Vector3(0, 0, r * 1.1), // cross over front
      new THREE.Vector3(r, 0.1, 0), // right
      new THREE.Vector3(0, 0.2, -r), // back
      new THREE.Vector3(-r, 0.25, 0), // left
      
      new THREE.Vector3(0, 0.15, r * 1.2), // cross over front again
      new THREE.Vector3(r, 0.05, 0), // right
      new THREE.Vector3(0, -0.05, -r), // back
      new THREE.Vector3(-r, -0.1, 0), // left
      
      new THREE.Vector3(-r * 1.5, -0.1, 0), // exit
    ];
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  // Fabric Rope Materials (Lambert material with a spiraling twisted fiber texture map)
  const yellowRopeMaterial = <meshLambertMaterial color="#facc15" map={ropeColorTexture || undefined} />;
  const silverRopeMaterial = <meshLambertMaterial color="#e5e7eb" map={ropeColorTexture || undefined} />;

  const yellowKnotMaterial = <meshLambertMaterial color="#facc15" map={knotColorTexture || undefined} />;
  const silverKnotMaterial = <meshLambertMaterial color="#e5e7eb" map={knotColorTexture || undefined} />;

  // Rope Helper
  const Rope = ({ 
    position, 
    barQuaternion, 
    pullRotation, 
    isYellow = false,
    knotType = 'clove'
  }: { 
    position: THREE.Vector3, 
    barQuaternion: THREE.Quaternion, 
    pullRotation: [number, number, number], 
    isYellow?: boolean,
    knotType?: 'clove' | 'wrap' | 'messy'
  }) => {
    // We create a very long cylinder so it always stretches off-screen
    const ropeLength = 20;
    
    let activeKnotCurve = knotCurve;
    if (knotType === 'wrap') activeKnotCurve = simpleWrapCurve;
    if (knotType === 'messy') activeKnotCurve = messyKnotCurve;

    return (
      <group position={position}>
        {/* The realistic 3D woven knot around the carabiner bar */}
        <group quaternion={barQuaternion}>
          <mesh>
            <tubeGeometry args={[activeKnotCurve, 64, 0.08, 16, false]} />
            {isYellow ? yellowKnotMaterial : silverKnotMaterial}
          </mesh>
        </group>
        
        {/* The main rope stretching outward in its specific pull direction */}
        {/* We position it by half its length so the origin is exactly at the tie-off point! */}
        <group rotation={pullRotation}>
          <mesh position={[0, ropeLength / 2, 0]}>
            <cylinderGeometry args={[0.08, 0.08, ropeLength, 16]} />
            {isYellow ? yellowRopeMaterial : silverRopeMaterial}
          </mesh>
        </group>
      </group>
    );
  };

  const getPointOnLine = (v1: THREE.Vector3, v2: THREE.Vector3, t: number) => v1.clone().lerp(v2, t);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={responsiveScale}>
        
        {/* --- CARABINER JOINTS (Smooth corners) --- */}
        <mesh position={p1}>{metalMaterial}<sphereGeometry args={[thickness, 32, 32]} /></mesh>
        <mesh position={p2}>{metalMaterial}<sphereGeometry args={[thickness, 32, 32]} /></mesh>
        <mesh position={p3}>{metalMaterial}<sphereGeometry args={[thickness, 32, 32]} /></mesh>

        {/* --- CARABINER SIDES --- */}
        {/* Right Side */}
        <mesh position={side1.position} quaternion={side1.quaternion}>
          {metalMaterial}
          <cylinderGeometry args={[thickness, thickness, side1.length, 32]} />
        </mesh>
        
        {/* Bottom Side (The Locking Gate) */}
        <mesh position={side2.position} quaternion={side2.quaternion}>
          {metalMaterial}
          <cylinderGeometry args={[thickness, thickness, side2.length, 32]} />
          {/* Locking Mechanism details */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[thickness * 1.3, thickness * 1.3, side2.length * 0.4, 32]} />
            {darkMetalMaterial}
          </mesh>
          <mesh position={[0, side2.length * 0.25, 0]}>
            <cylinderGeometry args={[thickness * 1.1, thickness * 1.1, side2.length * 0.2, 32]} />
            <meshStandardMaterial color="#6b7280" metalness={0.9} roughness={0.5} />
          </mesh>
        </mesh>

        {/* Left Side (with Yellow Tape) */}
        <mesh position={side3.position} quaternion={side3.quaternion}>
          {metalMaterial}
          <cylinderGeometry args={[thickness, thickness, side3.length, 32]} />
          {/* Yellow Safety Tape wrapped around */}
          <mesh position={[0, -0.5, 0]}>
            <cylinderGeometry args={[thickness * 1.05, thickness * 1.05, 1.5, 32]} />
            {yellowMaterial}
          </mesh>
        </mesh>

        {/* --- DYNAMIC ROPES --- */}
        {/* Because these are inside the group, they automatically pivot when the carabiner rotates! */}
        
        {/* Right Side Ropes */}
        <Rope position={getPointOnLine(p1, p2, 0.25)} barQuaternion={side1.quaternion} pullRotation={[0, 0, -Math.PI / 3.5]} isYellow knotType="clove" />
        <Rope position={getPointOnLine(p1, p2, 0.8)} barQuaternion={side1.quaternion} pullRotation={[0, 0, -Math.PI / 1.7]} knotType="messy" />

        {/* Bottom Side Ropes */}
        <Rope position={getPointOnLine(p2, p3, 0.2)} barQuaternion={side2.quaternion} pullRotation={[0, 0, -Math.PI * 0.85]} isYellow knotType="wrap" />
        <Rope position={getPointOnLine(p2, p3, 0.75)} barQuaternion={side2.quaternion} pullRotation={[0, 0, Math.PI * 0.85]} knotType="clove" />

        {/* Left Side Ropes */}
        <Rope position={getPointOnLine(p3, p1, 0.35)} barQuaternion={side3.quaternion} pullRotation={[0, 0, Math.PI / 1.8]} knotType="messy" />
        <Rope position={getPointOnLine(p3, p1, 0.85)} barQuaternion={side3.quaternion} pullRotation={[0, 0, Math.PI / 3.5]} isYellow knotType="wrap" />

      </group>
    </Float>
  );
}

// --- MAIN WRAPPER COMPONENT ---
export default function HeroCarabiner3D() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      
      {/* Topographic 2D Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.05]" 
        style={{ backgroundImage: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, currentColor 40px, currentColor 41px)' }} 
      />

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true }}>
        {/* Lighting to highlight the metal */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4b5563" />
        <spotLight position={[0, 0, 10]} intensity={1} penumbra={1} />
        
        {/* Environment Map for ultra-realistic metal reflections */}
        <Environment preset="city" />

        {/* The 3D Scene */}
        <CarabinerModel />
      </Canvas>

      {/* 2D Tech/Arknights style UI text floating over the 3D scene */}
      <div className="absolute inset-0 pointer-events-none text-black opacity-60 font-mono text-[10px] hidden sm:block">
        <div className="absolute top-[30%] left-[30%]">
          RENEW \ LIMIT 4 AG40<br/>
          UID 00046321840 KTM<br/>
          UN VER.1.1.6
        </div>
        <div className="absolute top-[30%] right-[30%]">
          20196_146
        </div>
        <div className="absolute top-[50%] left-[25%]">
          ▼ // ARKNIGHTS:<br/>
          ... /Switch/
        </div>
      </div>

    </div>
  );
}
