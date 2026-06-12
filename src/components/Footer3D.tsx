"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function BackgroundKnot({ isEmber, isNeumorphic }: { isEmber: boolean; isNeumorphic: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
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

export default function Footer3D({ isInView, isEmber, isNeumorphic }: { isInView: boolean; isEmber: boolean; isNeumorphic: boolean }) {
  return (
    <Canvas
      frameloop={isInView ? "always" : "never"}
      camera={{ position: [0, 0, 8], fov: 50 }}
    >
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 5]} intensity={3} />
      <BackgroundKnot isEmber={isEmber} isNeumorphic={isNeumorphic} />
    </Canvas>
  );
}
