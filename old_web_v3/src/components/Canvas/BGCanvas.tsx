import { styled } from "@pigment-css/react";

export const BGCanvas = styled.canvas`
  position: fixed;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
`;
