"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function FooterLandscape({ isEmber, isNeumorphic }: { isEmber: boolean; isNeumorphic: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    // Slowly rock the landscape and make it breathe vertically
    meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.05;
    meshRef.current.position.y = -2 + Math.sin(t * 0.5) * 0.15;
  });

  let color = "#ffffff";
  let opacity = 0.12;

  if (isEmber) {
    color = "#FF4F00";
    opacity = 0.35;
  } else if (isNeumorphic) {
    color = "#ffffff";
    opacity = 0.5;
  }

  return (
    // Tilt the plane backwards sharply so we are looking across it like an ocean
    <mesh ref={meshRef} position={[0, -2.5, -5]} rotation={[-Math.PI / 2.2, 0, 0]}>
      {/* A massive plane to act as a landscape: width, height, widthSegments, heightSegments */}
      <planeGeometry args={[100, 60, 96, 48]} />
      <MeshDistortMaterial 
        color={color} 
        wireframe={true} 
        transparent={true} 
        opacity={opacity} 
        distort={0.15} 
        speed={0.8} 
      />
    </mesh>
  );
}

export default function Footer3D({ isInView, isEmber, isNeumorphic }: { isInView: boolean; isEmber: boolean; isNeumorphic: boolean }) {
  return (
    <Canvas
      frameloop={isInView ? "always" : "never"}
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={2} />
      <directionalLight position={[10, 10, 5]} intensity={3} />
      <FooterLandscape isEmber={isEmber} isNeumorphic={isNeumorphic} />
    </Canvas>
  );
}
