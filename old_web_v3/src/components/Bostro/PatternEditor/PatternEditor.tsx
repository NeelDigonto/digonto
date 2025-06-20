"use client";
import * as React from "react";
import { MapControls, OrthographicCamera } from "@react-three/drei";
//import { useControls } from "leva";
import {
  Grid,
  AccumulativeShadows,
  RandomizedLight,
  Environment,
} from "@react-three/drei";
import { suspend } from "suspend-react";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import Box from "@/core/Box";

const city = import("@pmndrs/assets/hdri/city.exr").then(
  (module) => module.default
);

export default function PatternEditor() {
  /* const { gridSize, ...gridConfig } = useControls(
    "PatternEditor",
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

  /* const boxRef = React.useRef<THREE.Mesh>(null!); */

  React.useEffect(() => {}, []);
  // const positions = new Float32Array([1, 0, 0, 0, 1, 0, -1, 0, 0, 0, -1, 0]);

  return (
    <>
      <EffectComposer autoClear={false}>
        <Outline
          blur
          edgeStrength={2}
          pulseSpeed={0.1}
          visibleEdgeColor={0xffffff}
          /* selection={[boxRef]} */
        />
      </EffectComposer>
      <color attach="background" args={["#303035"]} />
      <OrthographicCamera makeDefault zoom={100} position={[0, 10, 0]} />
      <Environment
        environmentIntensity={0.2}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        files={suspend(city) as any}
      />
      <MapControls makeDefault />
      <Grid position={[0, 0, 0]} args={gridSize} {...gridConfig} />
      {/* <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0.125, 0]}>
        <mesh castShadow position={[0, 0, 0]} ref={boxRef}>
          <boxGeometry args={[2, 2, 0.001]} />
          <meshStandardMaterial color="#ff9999" />
        </mesh>
        <mesh position={[0, 0, -0.5]}>
          <bufferGeometry>
            <bufferAttribute
              args={[positions, 3]}
              attach="attributes-position"
              array={positions}
              count={positions.length / 3}
              itemSize={3}
            />
          </bufferGeometry>
          <meshStandardMaterial color="#fff" side={THREE.DoubleSide} />
        </mesh>
      </group> */}
      <group rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.125, 0]}>
        <Box />
      </group>
      <ShadowsCached />
    </>
  );
}

const ShadowsCached = React.memo(Shadows);

function Shadows() {
  return (
    <AccumulativeShadows
      temporal
      frames={100}
      color="#ff9999"
      colorBlend={0.5}
      alphaTest={0.7}
      scale={20}
    >
      <RandomizedLight amount={8} radius={15} position={[0, 0.5, 0]} />
    </AccumulativeShadows>
  );
}
