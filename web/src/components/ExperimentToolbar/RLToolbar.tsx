import { styled } from "@pigment-css/react";

const ToolbarContainer = styled.nav`
  width: 100%;
  height: 100%;
  grid-area: toolbar;

  border-bottom: green 1px solid;
`;

export default function RLToolbar() {
  return (
    <ToolbarContainer>
      <h1>RL Toolbar</h1>
    </ToolbarContainer>
  );
}
