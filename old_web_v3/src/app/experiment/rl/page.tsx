"use client";
import RLToolbar from "@/components/ExperimentToolbar/RLToolbar";
import RLExperimentSidebar from "@/components/Sidebar/RLExperimentSidebar";
import { styled } from "@pigment-css/react";
import React from "react";
import * as THREE from "three";

const RootContainer = styled.div`
  width: inherit;
  height: inherit;
  display: grid;

  min-width: 100vw;
  min-height: 100vh;

  max-width: 100vw;
  max-height: 100vh;

  grid-template-columns: 1fr max-content max-content;
  grid-template-rows: max-content 1fr;
  grid-template-areas: "toolbar toolbar toolbar" "canvas dragger sidebar";
`;

const DragArea = styled.div`
  grid-area: dragger;
  background-color: darkgreen;
  height: 100%;
  min-width: 1px;

  /* :hover & {
    cursor: col-resize;
    width: 8px;
    max-width: 8px;
    color: red;
    overflow: auto;
  } */
`;

const CanvasContainer = styled.div`
  display: block;
  position: relative;

  :focus {
    outline: none;
  }
  grid-area: canvas;
`;

const Canvas = styled.canvas`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: black;
  box-sizing: border-box;

  :focus {
    outline: none;
  }
`;

export default function RLExperiment() {
  const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const canvasContainerUUID = "ExperimentCanvasContainer";
  const canvasUUID = "ExperimentCanvas";

  return (
    <RootContainer>
      <RLToolbar />
      <CanvasContainer
        id={canvasContainerUUID}
        ref={canvasContainerRef}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
        }}
      >
        {/* <PerformanceMonitor /> */}
        <Canvas tabIndex={1} ref={canvasRef} id={canvasUUID} />
      </CanvasContainer>
      <DragArea />
      <RLExperimentSidebar />
    </RootContainer>
  );
}

// #fadb92
