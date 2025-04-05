import React, { useRef, useState } from "react";
import * as THREE from "three";

const Box = () => {
  const heartShape = React.useMemo(() => {
    const x = 0,
      y = 0;

    const heartShape = new THREE.Shape();

    heartShape.moveTo(x + 5, y + 5);
    heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    return heartShape;
  }, []);

  const shirtShape = React.useMemo(() => {
    const hh = 1.5,
      hw = 1;

    const shirtShape = new THREE.Shape()
      .moveTo(-1.5, 0)
      .lineTo(-0.5, 2)
      .lineTo(0.5, 2)
      .lineTo(1.5, 0)
      .lineTo(0.75, 0)
      .lineTo(0.5, 0.5)
      .lineTo(0.5, -2)
      .lineTo(-0.5, -2)
      .lineTo(-0.5, 0.5)
      .lineTo(-0.75, 0)
      .lineTo(-1.5, 0);

    return shirtShape;
  }, []);

  const boxRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      {/* <mesh ref={boxRef}>
        <boxGeometry args={[2, 2, 0.001]} />
        <meshStandardMaterial color="#ff9999" />
      </mesh> */}
      <mesh ref={boxRef} /* scale={0.2} position={[-1, -1.6, 0]} */>
        <shapeGeometry args={[shirtShape]} />
        <meshStandardMaterial side={THREE.DoubleSide} color="#ff9999" />
      </mesh>
      {/* {points.map((point, index) => (
        <mesh
          key={index}
          position={point as [number, number, number]}
          onPointerOver={() => handlePointerOver(index)}
          onPointerOut={handlePointerOut}
        >
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial
            color={hoveredPoint === index ? "red" : "yellow"}
          />
        </mesh>
      ))} */}
    </group>
  );
};

export default Box;
