import { styled } from "@pigment-css/react";

const SidebarContainer = styled.nav`
  height: 100%;
  grid-area: sidebar;

  min-width: 3rem;
  max-width: 3rem;
  // overflow: auto;

  border-right: green 1px solid;
`;

export default function BostroSidebar() {
  return (
    <SidebarContainer>
      <h1></h1>
    </SidebarContainer>
  );
}
