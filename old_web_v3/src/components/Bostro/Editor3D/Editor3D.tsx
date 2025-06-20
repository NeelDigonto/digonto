"use client";
import * as React from "react";
import * as THREE from "three";
import {
  GizmoHelper,
  GizmoViewport,
  PerspectiveCamera,
} from "@react-three/drei";
// import { useControls } from "leva";
import {
  Grid,
  Center,
  AccumulativeShadows,
  RandomizedLight,
  OrbitControls,
  Environment,
  useGLTF,
} from "@react-three/drei";
import { suspend } from "suspend-react";

const city = import("@pmndrs/assets/hdri/city.exr").then(
  (module) => module.default
);

export default function Editor3D() {
  /* const { gridSize, ...gridConfig } = useControls(
    "Editor3D",
    {
      gridSize: [10.5, 10.5],
      cellSize: { value: 0.6, min: 0, max: 10, step: 0.1 },
      cellThickness: { value: 1, min: 0, max: 5, step: 0.1 },
      cellColor: "#6f6f6f",
      sectionSize: { value: 3.3, min: 0, max: 10, step: 0.1 },
      sectionThickness: { value: 1.5, min: 0, max: 5, step: 0.1 },
      sectionColor: "#9d4b4b",
      fadeDistance: { value: 50, min: 0, max: 100, step: 1 },
      fadeStrength: { value: 1, min: 0, max: 1, step: 0.1 },
      followCamera: false,
      infiniteGrid: true,
    },
    { collapsed: true }
  ); */

  const { gridSize, ...gridConfig } = {
    gridSize: [10.5, 10.5] as [number, number],
    cellSize: 0.6,
    cellThickness: 1,
    cellColor: "#6f6f6f",
    sectionSize: 3.3,
    sectionThickness: 1.5,
    sectionColor: "#9d4b4b",
    fadeDistance: 50,
    fadeStrength: 1,
    followCamera: false,
    infiniteGrid: true,
  };

  return (
    <>
      <color attach="background" args={["#303035"]} />
      <PerspectiveCamera makeDefault position={[10, 12, 12]} fov={25} />
      <group position={[0, -0.5, 0]}>
        <Center top>
          <Suzi rotation={[-0.63, 0, 0]} scale={2} />
        </Center>
        <Center top position={[-2, 0, 2]}>
          <mesh castShadow>
            <sphereGeometry args={[0.5, 64, 64]} />
            <meshStandardMaterial color="#9d4b4b" />
          </mesh>
        </Center>
        <Center top position={[2.5, 0, 1]}>
          <mesh castShadow rotation={[0, Math.PI / 4, 0]}>
            <boxGeometry args={[0.7, 0.7, 0.7]} />
            <meshStandardMaterial color="#9d4b4b" />
          </mesh>
        </Center>
        <ShadowsCached />
        <Grid position={[0, -0.01, 0]} args={gridSize} {...gridConfig} />
      </group>
      <OrbitControls makeDefault />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Environment files={suspend(city) as any} />
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={["#9d4b4b", "#2f7f4f", "#3b5b9d"]}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
}

const ShadowsCached = React.memo(Shadows);

function Shadows() {
  return (
    <AccumulativeShadows
      temporal
      frames={100}
      color="#9d4b4b"
      colorBlend={0.5}
      alphaTest={0.75}
      scale={20}
    >
      <RandomizedLight amount={8} radius={4} position={[5, 5, -10]} />
    </AccumulativeShadows>
  );
}

const suzi = import("@pmndrs/assets/models/suzi.glb");

function Suzi(props: React.JSX.IntrinsicElements["mesh"]) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gltfSrc = (suspend(suzi) as any).default as string;
  const { nodes } = useGLTF(gltfSrc);

  return (
    <mesh
      {...props}
      castShadow
      receiveShadow
      geometry={(nodes.mesh as THREE.Mesh).geometry}
    >
      <meshStandardMaterial color="#9d4b4b" />
    </mesh>
  );
}
