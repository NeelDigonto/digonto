"use client";
import React, { useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { View } from "@react-three/drei";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Box(props: any) {
  // This reference will give us direct access to the mesh
  const meshRef = useRef<THREE.Mesh>(undefined);
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (meshRef.current!.rotation.x += delta));
  // Return view, these are regular three.js elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
    </mesh>
  );
}

export default function Editor3D2() {
  return (
    <View
      index={2}
      style={{
        width: "100%",
        height: "100%",
        flexGrow: 1,
        flexBasis: 0,
      }}
    >
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 15, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight
        position={[-10, -10, -10]}
        decay={0}
        intensity={Math.PI * 4}
      />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </View>
  );
}
