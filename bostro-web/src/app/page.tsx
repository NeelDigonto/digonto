"use client";
import { Box, Container } from "@mui/material";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export default function Home() {
  return (
    <Box sx={{ height: "100vh", width: "100vw" }}>
      {/* <PanelGroup direction="horizontal">
        <Panel>
          <Container sx={{ backgroundColor: "pink" }}>left</Container>
        </Panel>
        <PanelResizeHandle />
        <Panel>
          <PanelGroup direction="vertical">
            <Container sx={{ backgroundColor: "green" }}>top</Container>
            <PanelResizeHandle />
            <Panel>
              <PanelGroup direction="horizontal">
                <Container sx={{ backgroundColor: "red" }}>left</Container>
                <PanelResizeHandle />
                <Container sx={{ backgroundColor: "cyan" }}>right</Container>
              </PanelGroup>
            </Panel>
          </PanelGroup>
        </Panel>
        <PanelResizeHandle />
        <Container sx={{ backgroundColor: "coral" }}>right</Container>
      </PanelGroup> */}
      <PanelGroup direction="vertical">
        <Panel defaultSize={3}>
          <Box
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor: "pink",
            }}
          >
            Navbar
          </Box>
        </Panel>
        <PanelResizeHandle>
          <Box
            sx={{
              height: "4px",
              width: "100%",
              backgroundColor: "blue",
            }}
          ></Box>
        </PanelResizeHandle>
        <Panel defaultSize={97}>
          <Box
            sx={{
              height: "100%",
              width: "100%",
              backgroundColor: "coral",
            }}
          >
            <PanelGroup direction="horizontal">
              <Panel defaultSize={2}>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "red",
                  }}
                >
                  Sidebar
                </Box>
              </Panel>
              <PanelResizeHandle>
                <Box
                  sx={{
                    height: "100%",
                    width: "4px",
                    backgroundColor: "blue",
                  }}
                ></Box>
              </PanelResizeHandle>
              <Panel defaultSize={43}>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "darkkhaki",
                  }}
                >
                  Content
                </Box>
              </Panel>
              <PanelResizeHandle>
                <Box
                  sx={{
                    height: "100%",
                    width: "4px",
                    backgroundColor: "blue",
                  }}
                ></Box>
              </PanelResizeHandle>
              <Panel defaultSize={43}>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "turquoise",
                  }}
                >
                  Explorer
                </Box>
              </Panel>
              <PanelResizeHandle>
                <Box
                  sx={{
                    height: "100%",
                    width: "4px",
                    backgroundColor: "blue",
                  }}
                ></Box>
              </PanelResizeHandle>
              <Panel defaultSize={12}>
                <Box
                  sx={{
                    height: "100%",
                    width: "100%",
                    backgroundColor: "rosybrown",
                  }}
                >
                  Explorer
                </Box>
              </Panel>
            </PanelGroup>
          </Box>
        </Panel>
      </PanelGroup>
    </Box>
  );
}
