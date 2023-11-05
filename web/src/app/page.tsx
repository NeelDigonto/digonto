"use client";

import Hero from "@/components/Hero";
import React from "react";
import { Engine } from "@/core/Engine";
import styled from "styled-components";

const Canvas = styled.canvas`
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: oklch(0% 0% 0);
`;

export default function Home() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useInsertionEffect(() => {
    if (!window.engine) window.engine = new Engine();
  });

  const onResize = React.useCallback(() => {
    if (!canvasRef.current) {
      console.warn("canvasRef is still Null.");
      return;
    }

    window.engine.resizeRenderer(
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );
  }, []);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    window.engine.initializeRenderEngine(
      canvasRef.current,
      canvasRef.current.clientWidth,
      canvasRef.current.clientHeight
    );

    window.addEventListener("resize", onResize);

    window.engine.startRender();

    return () => {
      window.removeEventListener("resize", onResize);
      window.engine.destroyRenderEngine();
    };
  }, []);

  return (
    <React.Fragment>
      <Canvas className="bg-canvas" ref={canvasRef} />
      <main>
        <Hero />
      </main>
    </React.Fragment>
  );
}
