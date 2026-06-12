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

    const path = new THREE.CurvePath<THREE.Vector3>();
    path.add(new THREE.LineCurve3(p1Out, p2In));
    path.add(new THREE.QuadraticBezierCurve3(p2In, p2, p2Out));
    path.add(new THREE.LineCurve3(p2Out, p3In));
    path.add(new THREE.QuadraticBezierCurve3(p3In, p3, p3Out));
    path.add(new THREE.LineCurve3(p3Out, p1In));
    path.add(new THREE.QuadraticBezierCurve3(p1In, p1, p1Out));

    return path;
  }, []);

  // Procedurally generate a rugged, scratched texture for the metal using a Canvas
  const scratchedTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext("2d");
    if (!context) return null;
    
    // 1. Base metal color (Medium-Dark Gray)
    context.fillStyle = "#6b7280";
    context.fillRect(0, 0, 1024, 1024);
    
    // 2. Heavy grease and uneven patina (large organic blurry patches)
    context.filter = "blur(15px)";
    for (let i = 0; i < 60; i++) {
      context.fillStyle = `rgba(20, 20, 25, ${Math.random() * 0.5})`;
      context.beginPath();
      context.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 120 + 30, 0, Math.PI * 2);
      context.fill();
    }
    // 3. Bright exposed metal / worn edges (toned down to match darker metal)
    for (let i = 0; i < 40; i++) {
      context.fillStyle = `rgba(150, 150, 160, ${Math.random() * 0.4})`;
      context.beginPath();
      context.arc(Math.random() * 1024, Math.random() * 1024, Math.random() * 80 + 20, 0, Math.PI * 2);
      context.fill();
    }
    context.filter = "none";
    
    // 4. Directional Brushed Forging Grain
    context.fillStyle = "rgba(0,0,0,0.1)";
    for (let i = 0; i < 10000; i++) {
      context.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 40 + 10, Math.random() * 2 + 1);
    }
    context.fillStyle = "rgba(255,255,255,0.05)";
    for (let i = 0; i < 10000; i++) {
      context.fillRect(Math.random() * 1024, Math.random() * 1024, Math.random() * 40 + 10, Math.random() * 2 + 1);
    }
    
    // 5. Heavy factory impacts and craters (dark pits only)
    for (let i = 0; i < 400; i++) {
      context.beginPath();
      context.fillStyle = `rgba(15, 15, 20, ${Math.random() * 0.6})`; // Dark pits
      const r = Math.random() * 4 + 1;
      context.arc(Math.random() * 1024, Math.random() * 1024, r, 0, Math.PI * 2);
      context.fill();
    }
    
    // 6. Violent procedural scratches and gashes
    for (let i = 0; i < 2000; i++) {
      context.beginPath();
      const isDeep = Math.random() > 0.8;
      // Tone down the bright scratches so they don't cause blinding glare under scene lighting
      context.strokeStyle = isDeep ? "rgba(10,10,10,0.9)" : "rgba(160,160,160,0.5)"; 
      context.lineWidth = isDeep ? Math.random() * 4 + 1 : Math.random() * 2;
      
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const len = Math.random() * 100 + 20;
      const angle = Math.random() * Math.PI * 2;
      
      context.moveTo(x, y);
      
      // Draw jagged paths instead of perfect straight lines
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
    tex.anisotropy = 4; // Improves texture rendering at steep angles on the tube
    return tex;
  }, []);

    const ropeColorTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    // High res for detailed fibers
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return null;
    
    // Deep shadows between strands
    context.fillStyle = "#888888";
    context.fillRect(0, 0, 512, 512);
    
    // Draw thick twisted strands with fake 3D volume
    for (let i = -512; i < 1024; i += 128) {
      // Extended bounds to avoid seams when repeating! 
      // A line from y=-512 to y=1024 (dy=1536) requires dx=1536 for a perfect 45-degree angle.
      // This ensures the stroke never gets cut off by the visible 512x512 canvas bounds.
      const startX = i - 512;
      const startY = -512;
      const endX = i + 1024;
      const endY = 1024;

      // 1. Thick strand body (mid-height)
      context.beginPath();
      context.lineWidth = 100;
      context.strokeStyle = "#ffffff"; 
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();
      
      // 2. Crease shadows on edges (low height)
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
      
      // 3. Woven micro-fibers (high and low height)
      context.lineWidth = 2;
      for (let f = -40; f < 40; f += 6) {
        context.beginPath();
        // Fibers criss-cross slightly creating a braided look
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
    // Repeat along the cylinder to compress the spirals into tight twisted rope strands
    tex.repeat.set(2, 40); 
    return tex;
  }, []);

  // Helper to generate dirty, tactical rubber textures
  const generateRubberTexture = (baseColor: string) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext("2d");
    if (!context) return null;
    
    // Base color
    context.fillStyle = baseColor;
    context.fillRect(0, 0, 512, 512);
    
    // Add dirt and grease smudges (large organic patches)
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

      // Draw the main smudge
      drawSmudge(cx, cy);
      // Duplicate smudge on the opposite edge to make the texture perfectly tileable and remove the vertical seam!
      if (cx - r < 0) drawSmudge(cx + 512, cy);
      if (cx + r > 512) drawSmudge(cx - 512, cy);
    }
    
    // Add rubbery micropores (subtle noise)
    context.filter = "none";
    for (let i = 0; i < 60000; i++) {
      context.fillStyle = Math.random() > 0.5 ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";
      context.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
    
    // Add heavy dark edges to make the wrap look physically thick (fake ambient occlusion)
    context.filter = "blur(8px)";
    context.fillStyle = "rgba(0,0,0,0.6)";
    context.fillRect(0, 0, 512, 24); // Top edge
    context.fillRect(0, 512 - 24, 512, 24); // Bottom edge
    context.filter = "none";

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping; // Crucial so the dark edges stay exactly at the top and bottom of the cylinder
    tex.anisotropy = 4;
    return tex;
  };

  // Procedural texture for the yellow rubber wrap (adds dirt, grease, and porous bump mapping)
  const yellowRubberTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return generateRubberTexture("#eab308");
  }, []);

  // Procedural texture for the gray rubber wrap
  const grayRubberTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    return generateRubberTexture("#4b5563"); // Dark tactical gray
  }, []);

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
  
  // Adjust the texture mapping for the complex 3D knot
  // NOTE: TubeGeometry UVs are swapped compared to CylinderGeometry!
  // TubeGeometry: U = length, V = circumference
  // CylinderGeometry: U = circumference, V = length
  const knotColorTexture = useMemo(() => {
    if (!ropeColorTexture) return null;
    const tex = ropeColorTexture.clone();
    tex.repeat.set(30, 2); // 30 times along the knot length, 2 times around circumference
    tex.needsUpdate = true;
    return tex;
  }, [ropeColorTexture]);

  // Procedural texture for the cross-section of a cut rope (thousands of bundled fibers)
  const ropeEndTexture = useMemo(() => {
    if (typeof window === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (!context) return null;
    
    // Core shadows between fibers
    context.fillStyle = "#333333";
    context.fillRect(0, 0, 256, 256);
    
    // Draw densely packed fiber dots to look like a frayed cut end
    for (let i = 0; i < 3000; i++) {
      context.beginPath();
      context.fillStyle = Math.random() > 0.5 ? "#ffffff" : "#aaaaaa";
      const r = Math.random() * 2 + 0.5;
      context.arc(Math.random() * 256, Math.random() * 256, r, 0, Math.PI * 2);
      context.fill();
    }
    
    return new THREE.CanvasTexture(canvas);
  }, []);

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

  // Fabric Rope Materials (Standard material with a spiraling twisted fiber texture map + bump mapping)
  const yellowRopeMaterial = <meshStandardMaterial color="#facc15" roughness={1} map={ropeColorTexture || undefined} bumpMap={ropeColorTexture || undefined} bumpScale={0.02} />;
  const silverRopeMaterial = <meshStandardMaterial color="#e5e7eb" roughness={1} map={ropeColorTexture || undefined} bumpMap={ropeColorTexture || undefined} bumpScale={0.02} />;

  const yellowKnotMaterial = <meshStandardMaterial color="#facc15" roughness={1} map={knotColorTexture || undefined} bumpMap={knotColorTexture || undefined} bumpScale={0.02} />;
  const silverKnotMaterial = <meshStandardMaterial color="#e5e7eb" roughness={1} map={knotColorTexture || undefined} bumpMap={knotColorTexture || undefined} bumpScale={0.02} />;

  // Rope End Materials (DoubleSide so it caps perfectly regardless of curve tangent direction)
  const yellowRopeEndMaterial = <meshStandardMaterial color="#facc15" roughness={1} map={ropeEndTexture || undefined} bumpMap={ropeEndTexture || undefined} bumpScale={0.1} side={THREE.DoubleSide} />;
  const silverRopeEndMaterial = <meshStandardMaterial color="#e5e7eb" roughness={1} map={ropeEndTexture || undefined} bumpMap={ropeEndTexture || undefined} bumpScale={0.1} side={THREE.DoubleSide} />;

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
          {/* Flat circular cross-section caps showing the frayed cut fibers of the rope */}
          <mesh 
            position={activeKnotCurve.getPoint(0)} 
            quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), activeKnotCurve.getTangent(0).normalize())}
          >
            <circleGeometry args={[0.08, 32]} />
            {isYellow ? yellowRopeEndMaterial : silverRopeEndMaterial}
          </mesh>
          <mesh 
            position={activeKnotCurve.getPoint(1)} 
            quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), activeKnotCurve.getTangent(1).normalize())}
          >
            <circleGeometry args={[0.08, 32]} />
            {isYellow ? yellowRopeEndMaterial : silverRopeEndMaterial}
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
        <Rope position={getPointOnLine(p2, p3, 0.75)} barQuaternion={side2.quaternion} pullRotation={[0, 0, Math.PI * 0.85]} knotType="clove" />

        {/* Left Side Ropes */}
        <Rope position={getPointOnLine(p3, p1, 0.35)} barQuaternion={side3.quaternion} pullRotation={[0, 0, Math.PI / 1.8]} knotType="messy" />
        <Rope position={getPointOnLine(p3, p1, 0.8)} barQuaternion={side3.quaternion} pullRotation={[0, 0, Math.PI / 3.5]} isYellow knotType="wrap" />

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
          ▼ // SYS.OP:<br/>
          ... /Switch/
        </div>
      </div>

    </div>
  );
}
