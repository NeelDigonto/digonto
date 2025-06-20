import { styled } from "@pigment-css/react";

export const Wrapper = styled.main`
  display: grid;
  grid-template-columns: 1fr min(85ch, calc(100% - 64px)) 1fr;
  grid-column-gap: 32px;

  > * {
    grid-column: 2;
  }
`;

export const SideNav = styled.nav`
  grid-column: 1;
`;

export const AdsCol = styled.aside`
  grid-column: 3;
`;

export const FullBleed = styled.div`
  width: 100%;
  grid-column: 1 / -1;
`;
