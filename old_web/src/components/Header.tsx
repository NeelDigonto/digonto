"use client";

import { _HEADER_Z_INDEX_ } from "@/constants/Constants";
import React from "react";
import styled from "styled-components";

const HeaderRoot = styled.header`
  display: grid;
  grid-template-columns: 1fr min(50rem, calc(100% - 64px)) 1fr;
  grid-column-gap: 32px;

  > * {
    grid-column: 2;
  }

  position: fixed;
  top: 0;
  z-index: ${_HEADER_Z_INDEX_};
  width: 100%;
`;

const HeaderContainer = styled.div``;

const Header = () => {
  return (
    <HeaderRoot>
      <HeaderContainer>Header</HeaderContainer>
    </HeaderRoot>
  );
};

export default Header;
