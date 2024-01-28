"use client";

import Hero from "@/components/Hero";
import React from "react";
import { Engine } from "@/core/Engine";
import styled from "styled-components";

export default function Home() {
  React.useInsertionEffect(() => {
    if (!window.engine) window.engine = new Engine();

    window.engine.startBackgroundRenderer();
  });

  return (
    <React.Fragment>
      <body style={{ backgroundColor: "transparent" }}>
        <canvas className="bg-canvas" id="canvas" />
        <main className="homeMain">
          <Hero />
        </main>
      </body>
    </React.Fragment>
  );
}
