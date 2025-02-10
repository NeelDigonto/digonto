import { styled } from "@pigment-css/react";

const SidebarContainer = styled.nav`
  width: 22rem;
  height: 100%;
  grid-area: sidebar;

  // overflow: auto;

  border-left: green 1px solid;
`;

export default function RLExperimentSidebar() {
  return (
    <SidebarContainer>
      <h1>RL Sidebar</h1>
    </SidebarContainer>
  );
}
