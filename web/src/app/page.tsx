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

    window.engine.startBackgroundRenderer();
  });

  return (
    <React.Fragment>
      <main>
        <Hero />
      </main>
    </React.Fragment>
  );
}
