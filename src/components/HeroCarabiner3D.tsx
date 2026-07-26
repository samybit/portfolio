"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import { useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import { useAnimationConfig } from "@/context/AnimationContext";

// --- PROCEDURAL TEXTURE CACHE ---
const textureCache: Record<string, THREE.CanvasTexture> = {};

const getScratchedTexture = () => {
  if (typeof window === "undefined") return null;
  if (textureCache.scratched) return textureCache.scratched;
  
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");
  if (!context) return null;
  
  context.fillStyle = "#6b7280";
  context.fillRect(0, 0, 1024, 1024);
  
  context.filter = "blur(15px)";
  for (let i = 0; i < 60; i++) {
    context.fillStyle = `rgba(20, 20, 25, ${Math.random() * 0.5})`;
    context.beginPath();
    context.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 120 + 30, 0, Math.PI * 2);
    context.fill();
  }
  for (let i = 0; i < 40; i++) {
    context.fillStyle = `rgba(150, 150, 160, ${Math.random() * 0.4})`;
    context.beginPath();
    context.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 80 + 20, 0, Math.PI * 2);
    context.fill();
  }
  context.filter = "none";
  
  context.fillStyle = "rgba(0,0,0,0.1)";
  for (let i = 0; i < 10000; i++) {
    context.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 40 + 10, Math.random() * 2 + 1);
  }
  context.fillStyle = "rgba(255,255,255,0.05)";
  for (let i = 0; i < 10000; i++) {
    context.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 40 + 10, Math.random() * 2 + 1);
  }
  
  for (let i = 0; i < 400; i++) {
    context.beginPath();
    context.fillStyle = `rgba(15, 15, 20, ${Math.random() * 0.6})`; 
    const r = Math.random() * 4 + 1;
    context.arc(Math.random() * 1024, Math.random() * 1024, r, 0, Math.PI * 2);
    context.fill();
  }
  
  for (let i = 0; i < 2000; i++) {
    context.beginPath();
    const isDeep = Math.random() > 0.8;
    context.strokeStyle = isDeep ? "rgba(10,10,10,0.9)" : "rgba(160,160,160,0.5)"; 
    context.lineWidth = isDeep ? Math.random() * 4 + 1 : Math.random() * 2;
    
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const len = Math.random() * 100 + 20;
    const angle = Math.random() * Math.PI * 2;
    
    context.moveTo(x, y);
    
    let curX = x;
    let curY = y;
    for (let s = 0; s < 4; s++) {
      curX += Math.cos(angle + (Math.random() - 0.5) * 0.4) * (len / 4);
      curY += Math.sin(angle + (Math.random() - 0.5) * 0.4) * (len / 4);
      context.lineTo(curX, curY);
    }
    context.stroke();
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  textureCache.scratched = tex;
  return tex;
};

const getRopeColorTexture = () => {
  if (typeof window === "undefined") return null;
  if (textureCache.ropeColor) return textureCache.ropeColor;
  
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;
  
  context.fillStyle = "#888888";
  context.fillRect(0, 0, 512, 512);
  
  for (let i = -512; i < 1024; i += 128) {
    const startX = i - 512;
    const startY = -512;
    const endX = i + 1024;
    const endY = 1024;

    context.beginPath();
    context.lineWidth = 100;
    context.strokeStyle = "#ffffff"; 
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
    
    context.beginPath();
    context.lineWidth = 15;
    context.strokeStyle = "#666666";
    context.moveTo(startX - 45, startY);
    context.lineTo(endX - 45, endY);
    context.stroke();
    
    context.beginPath();
    context.lineWidth = 15;
    context.strokeStyle = "#666666";
    context.moveTo(startX + 45, startY);
    context.lineTo(endX + 45, endY);
    context.stroke();
    
    context.lineWidth = 2;
    for (let f = -40; f < 40; f += 6) {
      context.beginPath();
      const jitter = Math.random() * 2 - 1;
      context.strokeStyle = Math.random() > 0.5 ? "#ffffff" : "#aaaaaa";
      context.moveTo(startX + f, startY);
      context.lineTo(endX + f + jitter * 20, endY);
      context.stroke();
    }
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 4;
  tex.repeat.set(2, 40); 
  textureCache.ropeColor = tex;
  return tex;
};

const generateRubberTexture = (baseColor: string, cacheKey: string) => {
  if (typeof window === "undefined") return null;
  if (textureCache[cacheKey]) return textureCache[cacheKey];
  
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext("2d");
  if (!context) return null;
  
  context.fillStyle = baseColor;
  context.fillRect(0, 0, 512, 512);
  
  context.filter = "blur(15px)";
  for (let i = 0; i < 30; i++) {
    context.fillStyle = `rgba(10, 10, 10, ${Math.random() * 0.4})`;
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const r = Math.random() * 80 + 20;
    
    const drawSmudge = (x: number, y: number) => {
      context.beginPath();
      context.arc(x, y, r, 0, Math.PI * 2);
      context.fill();
    };

    drawSmudge(cx, cy);
    if (cx - r < 0) drawSmudge(cx + 512, cy);
    if (cx + r > 512) drawSmudge(cx - 512, cy);
  }
  
  context.filter = "none";
  for (let i = 0; i < 60000; i++) {
    context.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
    context.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
  }
  
  context.filter = "blur(8px)";
  context.fillStyle = "rgba(0,0,0,0.6)";
  context.fillRect(0, 0, 512, 24); 
  context.fillRect(0, 512 - 24, 512, 24); 
  context.filter = "none";

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.anisotropy = 4;
  textureCache[cacheKey] = tex;
  return tex;
};

const getKnotColorTexture = () => {
  if (typeof window === "undefined") return null;
  if (textureCache.knotColor) return textureCache.knotColor;
  const ropeColor = getRopeColorTexture();
  if (!ropeColor) return null;
  const tex = ropeColor.clone();
  tex.repeat.set(30, 2);
  tex.needsUpdate = true;
  textureCache.knotColor = tex;
  return tex;
};

const getRopeEndTexture = () => {
  if (typeof window === "undefined") return null;
  if (textureCache.ropeEnd) return textureCache.ropeEnd;
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");
  if (!context) return null;
  
  context.fillStyle = "#333333";
  context.fillRect(0, 0, 256, 256);
  
  for (let i = 0; i < 3000; i++) {
    context.beginPath();
    context.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#aaaaaa";
    const r = Math.random() * 2 + 0.5;
    context.arc(Math.random() * 256, Math.random() * 256, r, 0, Math.PI * 2);
    context.fill();
  }
  
  const tex = new THREE.CanvasTexture(canvas);
  textureCache.ropeEnd = tex;
  return tex;
};

const ROPE_THICKNESS = 0.3;

const Rope = ({ 
  position, 
  barQuaternion, 
  pullRotation, 
  isYellow = false,
  knotType = 'clove',
  removeFirstTail = false,
  // hasCoil = false
}: { 
  position: THREE.Vector3, 
  barQuaternion: THREE.Quaternion, 
  pullRotation: [number, number, number], 
  isYellow?: boolean,
  knotType?: 'clove' | 'wrap' | 'messy',
  removeFirstTail?: boolean,
  // hasCoil?: boolean
}) => {
  const ropeColorTexture = getRopeColorTexture();
  const knotColorTexture = getKnotColorTexture();
  const ropeEndTexture = getRopeEndTexture();

  const knotCurve = useMemo(() => {
    const r = ROPE_THICKNESS * 1.25;
    const points = [
      new THREE.Vector3(0, -0.1, r * 1.5),
      new THREE.Vector3(0, 0.05, r * 1.05),
      new THREE.Vector3(-r, 0.15, 0),
      new THREE.Vector3(0, 0.2, -r),
      new THREE.Vector3(r, 0.2, 0),
      new THREE.Vector3(0, 0.15, r),
      new THREE.Vector3(-r * 0.8, 0.05, r * 1.4),
      new THREE.Vector3(0, -0.05, r),
      new THREE.Vector3(r, -0.15, 0),
      new THREE.Vector3(0, -0.2, -r),
      new THREE.Vector3(-r * 1.5, -0.1, 0),
    ];
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  const cloveNoTailCurve = useMemo(() => {
    const r = ROPE_THICKNESS * 1.25; 
    const points = [
      new THREE.Vector3(0, 0.05, r * 1.05),
      new THREE.Vector3(-r, 0.15, 0),
      new THREE.Vector3(0, 0.2, -r),
      new THREE.Vector3(r, 0.2, 0),
      new THREE.Vector3(0, 0.15, r),
      new THREE.Vector3(-r * 0.8, 0.05, r * 1.4),
      new THREE.Vector3(0, -0.05, r),
      new THREE.Vector3(r, -0.15, 0),
      new THREE.Vector3(0, -0.2, -r),
      new THREE.Vector3(-r * 1.5, -0.1, 0),
    ];
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  const simpleWrapCurve = useMemo(() => {
    const r = ROPE_THICKNESS * 1.25;
    const points = [
      new THREE.Vector3(0, 0, r * 1.5),
      new THREE.Vector3(0, 0, r),
      new THREE.Vector3(-r, 0.1, 0),
      new THREE.Vector3(0, 0.1, -r),
      new THREE.Vector3(r, 0.1, 0),
      new THREE.Vector3(0, 0, r * 1.2),
      new THREE.Vector3(-r * 1.5, -0.1, 0),
    ];
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  const messyKnotCurve = useMemo(() => {
    const r = ROPE_THICKNESS * 1.25;
    const points = [
      new THREE.Vector3(0, -0.2, r * 1.5),
      new THREE.Vector3(0, -0.25, r),
      new THREE.Vector3(r, -0.2, 0),
      new THREE.Vector3(0, -0.15, -r),
      new THREE.Vector3(-r, -0.1, 0),
      new THREE.Vector3(0, 0, r * 1.1),
      new THREE.Vector3(r, 0.1, 0),
      new THREE.Vector3(0, 0.2, -r),
      new THREE.Vector3(-r, 0.25, 0),
      new THREE.Vector3(0, 0.15, r * 1.2),
      new THREE.Vector3(r, 0.05, 0),
      new THREE.Vector3(0, -0.05, -r),
      new THREE.Vector3(-r, -0.1, 0),
      new THREE.Vector3(-r * 1.5, -0.1, 0),
    ];
    return new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.5);
  }, []);

  const yellowRopeMaterial = <meshStandardMaterial color="#facc15" roughness={1} map={ropeColorTexture || undefined} bumpMap={ropeColorTexture || undefined} bumpScale={0.02} />;
  const silverRopeMaterial = <meshStandardMaterial color="#e5e7eb" roughness={1} map={ropeColorTexture || undefined} bumpMap={ropeColorTexture || undefined} bumpScale={0.02} />;
  const yellowKnotMaterial = <meshStandardMaterial color="#facc15" roughness={1} map={knotColorTexture || undefined} bumpMap={knotColorTexture || undefined} bumpScale={0.02} />;
  const silverKnotMaterial = <meshStandardMaterial color="#e5e7eb" roughness={1} map={knotColorTexture || undefined} bumpMap={knotColorTexture || undefined} bumpScale={0.02} />;
  const yellowRopeEndMaterial = <meshStandardMaterial color="#facc15" roughness={1} map={ropeEndTexture || undefined} bumpMap={ropeEndTexture || undefined} bumpScale={0.1} side={THREE.DoubleSide} />;
  const silverRopeEndMaterial = <meshStandardMaterial color="#e5e7eb" roughness={1} map={ropeEndTexture || undefined} bumpMap={ropeEndTexture || undefined} bumpScale={0.1} side={THREE.DoubleSide} />;

  const ropeLength = 20;
  let activeKnotCurve = knotCurve;
  if (knotType === 'wrap') activeKnotCurve = simpleWrapCurve;
  if (knotType === 'messy') activeKnotCurve = messyKnotCurve;
  if (removeFirstTail && knotType === 'clove') activeKnotCurve = cloveNoTailCurve;

  return (
    <group position={position}>
      <group quaternion={barQuaternion}>
        <mesh>
          <tubeGeometry args={[activeKnotCurve, 64, 0.08, 16, false]} />
          {isYellow ? yellowKnotMaterial : silverKnotMaterial}
        </mesh>
        {!removeFirstTail && (
          <mesh 
            position={activeKnotCurve.getPoint(0)} 
            quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), activeKnotCurve.getTangent(0).normalize())}
          >
            <circleGeometry args={[0.08, 32]} />
            {isYellow ? yellowRopeEndMaterial : silverRopeEndMaterial}
          </mesh>
        )}
        <mesh 
          position={activeKnotCurve.getPoint(1)} 
          quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), activeKnotCurve.getTangent(1).normalize())}
        >
          <circleGeometry args={[0.08, 32]} />
          {isYellow ? yellowRopeEndMaterial : silverRopeEndMaterial}
        </mesh>
      </group>
      
      <group rotation={pullRotation}>
        <mesh position={[0, ropeLength / 2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, ropeLength, 16]} />
          {isYellow ? yellowRopeMaterial : silverRopeMaterial}
        </mesh>
        
        {/* {hasCoil && (
          <group position={[0, 0.8, 0]}>
            <mesh rotation={[Math.PI / 2 + 0.1, 0, 0]} position={[0, -0.05, 0]}>
              <torusGeometry args={[0.12, 0.07, 16, 32]} />
              {isYellow ? yellowKnotMaterial : silverKnotMaterial}
            </mesh>
            <mesh rotation={[Math.PI / 2 - 0.1, 0, 0]} position={[0, 0.05, 0]}>
              <torusGeometry args={[0.12, 0.07, 16, 32]} />
              {isYellow ? yellowKnotMaterial : silverKnotMaterial}
            </mesh>
            <mesh rotation={[Math.PI / 2.5, 0, Math.PI / 4]} position={[0, 0, 0]}>
              <torusGeometry args={[0.13, 0.05, 16, 32]} />
              {isYellow ? yellowKnotMaterial : silverKnotMaterial}
            </mesh>
          </group>
        )} */}
      </group>
    </group>
  );
};

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
    // Intro animation: yanked into place by the ropes
    // A positive Z angle decaying to 0 creates a strong, smooth clockwise snap into its final position.
    const introSpinZ = Math.exp(-time * 1.2) * (Math.PI / 1.5);

    // Very subtle, slow secondary motion to simulate gentle, soft tension
    const jitterX = Math.sin(time * 3) * 0.005 + Math.cos(time * 4) * 0.005;
    const jitterY = Math.cos(time * 2.5) * 0.005 + Math.sin(time * 3.5) * 0.005;
    const jitterZ = Math.sin(time * 3.2) * 0.005;
    
    // Slow, soft pulling in varying directions from the ropes
    const pullX = Math.sin(time * 0.8) * 0.04;
    const pullY = Math.cos(time * 0.6) * 0.04;
    const pullZ = Math.sin(time * 0.5) * 0.02;
    
    // Apply rotation tension + the explosive intro animation
    groupRef.current.rotation.x = pullX + jitterX;
    groupRef.current.rotation.y = pullY + jitterY;
    groupRef.current.rotation.z = pullZ + jitterZ + introSpinZ;

    // Intro positional yank: Simulates competing tension from different ropes
    // We use damped sine waves (underdamped spring physics) with different frequencies.
    // Lower decay rates and frequencies make the motion slower, broader, and much smoother.
    const introPullX = Math.exp(-time * 1.2) * Math.cos(time * 3) * -3.0; 
    const introPullY = Math.exp(-time * 1.5) * Math.sin(time * 4) * -2.0;

    // Apply slight physical displacement (getting pulled slightly off-center) + intro pull
    groupRef.current.position.x = pullX * 2 + jitterX * 1.5 + introPullX;
    groupRef.current.position.y = pullY * 2 + jitterY * 1.5 + introPullY;
  });

  // Math for the triangle
  const R = 2.5; // Radius of the triangle
  const thickness = 0.3; // Tube thickness
  
  const { p1, p2, p3 } = useMemo(() => {
    return {
      p1: new THREE.Vector3(0, R, 0), // Top
      p2: new THREE.Vector3(R * Math.cos(-Math.PI / 6), R * Math.sin(-Math.PI / 6), 0), // Bottom Right
      p3: new THREE.Vector3(-R * Math.cos(-Math.PI / 6), R * Math.sin(-Math.PI / 6), 0), // Bottom Left
    };
  }, [R]);

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

  // Mathematically perfect continuous tube path for the carabiner body
  const carabinerPath = useMemo(() => {
    const cr = 0.4; // Corner radius length
    
    const getPt = (v1: THREE.Vector3, v2: THREE.Vector3, d: number) => {
      const dir = new THREE.Vector3().subVectors(v2, v1).normalize();
      return v1.clone().add(dir.multiplyScalar(d));
    };

    const p1In = getPt(p1, p3, cr);
    const p1Out = getPt(p1, p2, cr);
    
    const p2In = getPt(p2, p1, cr);
    const p2Out = getPt(p2, p3, cr);
    
    const p3In = getPt(p3, p2, cr);
    const p3Out = getPt(p3, p1, cr);

    // The midpoint of the bottom edge is where the locking mechanism sits.
    // By starting and ending the path exactly here, the texture seam will be perfectly and permanently hidden inside the thick locking cylinder!
    const bottomMidpoint = p2.clone().lerp(p3, 0.5);

    const path = new THREE.CurvePath<THREE.Vector3>();
    path.add(new THREE.LineCurve3(bottomMidpoint, p3In));
    path.add(new THREE.QuadraticBezierCurve3(p3In, p3, p3Out));
    path.add(new THREE.LineCurve3(p3Out, p1In));
    path.add(new THREE.QuadraticBezierCurve3(p1In, p1, p1Out));
    path.add(new THREE.LineCurve3(p1Out, p2In));
    path.add(new THREE.QuadraticBezierCurve3(p2In, p2, p2Out));
    path.add(new THREE.LineCurve3(p2Out, bottomMidpoint));

    return path;
  }, [p1, p2, p3]);

  const scratchedTexture = getScratchedTexture();
  const yellowRubberTexture = generateRubberTexture("#eab308", "yellowRubber");
  const grayRubberTexture = generateRubberTexture("#4b5563", "grayRubber");

  // Materials (Rugged, tactical, heavily damaged metal)
  const metalMaterial = (
    <meshStandardMaterial 
      color="#ffffff" 
      metalness={0.4} 
      roughness={0.9} 
      map={scratchedTexture || undefined} 
      roughnessMap={scratchedTexture || undefined} 
      bumpMap={scratchedTexture || undefined} 
      bumpScale={0.15} 
    />
  );
  const darkMetalMaterial = <meshStandardMaterial color="#888888" metalness={0.8} roughness={0.75} map={scratchedTexture || undefined} roughnessMap={scratchedTexture || undefined} bumpMap={scratchedTexture || undefined} bumpScale={0.04} />;
  
  // Tactical, dirty rubber material for the safety tape wrap
  const yellowMaterial = (
    <meshStandardMaterial 
      roughness={0.9} 
      metalness={0.1} 
      map={yellowRubberTexture || undefined}
      bumpMap={yellowRubberTexture || undefined}
      bumpScale={0.015}
    />
  );
  
  // Tactical, dirty rubber material for the gray locking gate grip
  const grayMaterial = (
    <meshStandardMaterial 
      roughness={0.9} 
      metalness={0.1} 
      map={grayRubberTexture || undefined}
      bumpMap={grayRubberTexture || undefined}
      bumpScale={0.015}
    />
  );



  const getPointOnLine = (v1: THREE.Vector3, v2: THREE.Vector3, t: number) => v1.clone().lerp(v2, t);

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={groupRef} scale={responsiveScale}>
        
        {/* --- CARABINER MAIN BODY (Perfect continuous 3D tube) --- */}
        <mesh>
          <tubeGeometry args={[carabinerPath, 256, thickness, 32, true]} />
          {metalMaterial}
        </mesh>

        {/* --- LOCKING GATE DETAILS (Overlaid on bottom side) --- */}
        <group position={side2.position} quaternion={side2.quaternion}>
          {/* Locking Mechanism details */}
          <mesh position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
            <cylinderGeometry args={[thickness * 1.3, thickness * 1.3, side2.length * 0.4, 32]} />
            {darkMetalMaterial}
          </mesh>
          <mesh position={[0, side2.length * 0.25, 0]} rotation={[0, Math.PI, 0]}>
            <cylinderGeometry args={[thickness * 1.1, thickness * 1.1, side2.length * 0.2, 32]} />
            {grayMaterial}
          </mesh>
        </group>

        {/* --- YELLOW SAFETY TAPE (Overlaid on left side) --- */}
        <group position={side3.position} quaternion={side3.quaternion}>
          {/* Yellow Safety Tape wrapped around */}
          <mesh position={[0, -0.5, 0]} rotation={[0, Math.PI, 0]}>
            <cylinderGeometry args={[thickness * 1.05, thickness * 1.05, 1.5, 32]} />
            {yellowMaterial}
          </mesh>
        </group>

        {/* --- DYNAMIC ROPES --- */}
        {/* Because these are inside the group, they automatically pivot when the carabiner rotates! */}
        
        {/* Right Side Ropes */}
        <Rope position={getPointOnLine(p1, p2, 0.26)} barQuaternion={side1.quaternion} pullRotation={[0, 0, -Math.PI / 3.5]} isYellow knotType="clove" />
        <Rope position={getPointOnLine(p1, p2, 0.8)} barQuaternion={side1.quaternion} pullRotation={[0, 0, -Math.PI / 1.7]} knotType="messy" />

        {/* Bottom Side Ropes */}
        <Rope position={getPointOnLine(p2, p3, 0.2)} barQuaternion={side2.quaternion} pullRotation={[0, 0, -Math.PI * 0.85]} isYellow knotType="wrap" />
        <Rope position={getPointOnLine(p2, p3, 0.75)} barQuaternion={side2.quaternion} pullRotation={[0, 0, Math.PI * 0.85]} knotType="clove" removeFirstTail />

        {/* Left Side Ropes */}
        <Rope position={getPointOnLine(p3, p1, 0.35)} barQuaternion={side3.quaternion} pullRotation={[0, 0, Math.PI / 1.8]} knotType="messy" />
        <Rope position={getPointOnLine(p3, p1, 0.8)} barQuaternion={side3.quaternion} pullRotation={[0, 0, Math.PI / 3.5]} isYellow knotType="wrap" />

      </group>
    </Float>
  );
}

function WebGLCleanup() {
  const { gl } = useThree();

  useEffect(() => {
    const handleContextLost = (event: Event) => {
      event.preventDefault();
    };

    const domElement = gl?.domElement;
    if (domElement) {
      domElement.addEventListener("webglcontextlost", handleContextLost, false);
    }

    return () => {
      if (domElement) {
        domElement.removeEventListener("webglcontextlost", handleContextLost);
      }
    };
  }, [gl]);

  return null;
}

// --- MAIN WRAPPER COMPONENT ---
export default function HeroCarabiner3D() {
  const [mounted, setMounted] = useState(false);
  const [shouldRenderWebGL, setShouldRenderWebGL] = useState(false);
  const { isAnimationsDisabled } = useAnimationConfig();

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
    // Delay WebGL initialization so CSS animations get absolute priority and run at 60FPS
    const timer = setTimeout(() => {
      setShouldRenderWebGL(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      
      {/* Topographic 2D Background Pattern (Concentric Circles) */}
      <div 
        className="absolute inset-0 opacity-[0.12]" 
        style={{ backgroundImage: 'repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 40px, #ffffff 40px, #ffffff 41px)', backgroundPosition: 'center center' }} 
      />

      {/* 3D Canvas (Delayed to give UI animations priority, then fades in) */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${shouldRenderWebGL && !isAnimationsDisabled ? 'opacity-100' : 'opacity-0'}`}>
        {shouldRenderWebGL && !isAnimationsDisabled && (
          <Canvas camera={{ position: [0, 0, 10], fov: 45 }} gl={{ antialias: true }} dpr={[1, 1.5]}>
            <WebGLCleanup />
            {/* Lighting to highlight the metal without blowing it out */}
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4b5563" />
            <spotLight position={[0, 0, 10]} intensity={0.4} penumbra={1} />
            
            {/* Environment Map for ultra-realistic metal reflections */}
            <Environment preset="city" />

            {/* The 3D Scene */}
            <CarabinerModel />
          </Canvas>
        )}
      </div>



    </div>
  );
}
