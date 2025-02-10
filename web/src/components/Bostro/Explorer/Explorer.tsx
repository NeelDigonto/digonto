import { styled } from "@pigment-css/react";

const ExplorerContainer = styled.nav`
  width: 22rem;
  height: 100%;
  grid-area: explorer;

  // overflow: auto;

  border-left: green 1px solid;
`;

export default function BostroExplorer() {
  return (
    <ExplorerContainer>
      <h1>Bostro Explorer</h1>
    </ExplorerContainer>
  );
}
