"use client";
import BostroNavbar from "@/components/Navbar/BostroNavBar";
import BostroExplorer from "@/components/Bostro/Explorer/Explorer";
import { styled } from "@pigment-css/react";
import React from "react";
import { Canvas as R3FCanvas } from "@react-three/fiber";
import { View } from "@react-three/drei";
import BostroSidebar from "@/components/Sidebar/BostroSidebar";
import PatternEditor from "@/components/Bostro/PatternEditor/PatternEditor";
import Editor3D from "@/components/Bostro/Editor3D/Editor3D";

const RootContainer = styled.div`
  width: inherit;
  height: inherit;
  display: grid;

  min-width: 100vw;
  min-height: 100vh;

  max-width: 100vw;
  max-height: 100vh;

  grid-template-columns: max-content 1fr max-content max-content;
  grid-template-rows: max-content 1fr;
  grid-template-areas: "navbar navbar navbar navbar" "sidebar editor dragger explorer";
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

const SplitDragArea = styled.div`
  background-color: darkgreen;
  height: 100%;
  min-width: 2px;
  max-width: 2px;
  position: absolute;

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

const R3FCanvasRoot = styled(R3FCanvas)`
  width: 100%;
  height: 100%;
  margin: unset;
`;

const EditorArea = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background-color: black;

  grid-area: editor;
`;

const ViewTrackingArea = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const EditorDragger = styled.div`
  min-width: 1px;
  max-width: 1px;
  height: 100%;
  background-color: darkgreen;
`;

export default function Bostro() {
  // const canvasContainerRef = React.useRef<HTMLDivElement>(null);
  // const canvasRef = React.useRef<HTMLCanvasElement>(null);
  // const canvasContainerUUID = "ExperimentCanvasContainer";
  // const canvasUUID = "ExperimentCanvas";

  return (
    <RootContainer>
      <BostroNavbar />
      <BostroSidebar />
      <EditorArea>
        <ViewTrackingArea>
          <Editor3D />
          <EditorDragger />
          <PatternEditor />
        </ViewTrackingArea>
        <R3FCanvasRoot
        // eventSource={document.getElementById(canvasContainerUUID)!}
        >
          <View.Port />
        </R3FCanvasRoot>
      </EditorArea>
      <DragArea />
      <BostroExplorer />
    </RootContainer>
  );
}

// #fadb92

/*
      <CanvasContainer
        id={canvasContainerUUID}
        ref={canvasContainerRef}
        //  onDragOver={(e) => {
        //    e.preventDefault();
        //  }}
        //  onDragEnter={(e) => {
        //    e.preventDefault();
        //  }}
      >
        <PerformanceMonitor />
        <Canvas tabIndex={1} ref={canvasRef} id={canvasUUID} />
        <Editor3D />
        <SplitDragArea />
        <PatternEditor />
        <ViewArea />
        <Canvas
          // eventSource={document.getElementById(canvasContainerUUID)!}
          id={canvasUUID}
        >
          <View.Port />
        </Canvas>
      </CanvasContainer>
*/
