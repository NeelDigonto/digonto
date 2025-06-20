import { styled } from "@pigment-css/react";

const NavBarContainer = styled.nav`
  width: 100%;
  height: 100%;
  grid-area: navbar;

  border-bottom: green 1px solid;
`;

export default function BostroNavbar() {
  return (
    <NavBarContainer>
      <h1>Bostro Navbar</h1>
    </NavBarContainer>
  );
}
