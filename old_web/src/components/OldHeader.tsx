import React from "react";
import styled from "styled-components";
import NextLink from "next/link";
import { bp } from "@/constants/Breakpoints";
import { _HEADER_HEIGHT_, _HEADER_Z_INDEX_ } from "@/constants/Constants";
//import Curtain from "@components/background/Curtain";
//import AppleIcon from "@mui/icons-material/Apple";
//import MenuIcon from "@mui/icons-material/Menu";
//import MenuOpenIcon from "@mui/icons-material/MenuOpen";
//import { Box } from "@mui/material";

const HeaderSpacer = styled.div`
  height: ${_HEADER_HEIGHT_};
  width: 100%;
`;

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  min-height: ${_HEADER_HEIGHT_};
  width: 100%;
  z-index: ${_HEADER_Z_INDEX_};

  /* background: rgba(255, 255, 255, 0.7); */
  /* backdrop-filter: saturate(180%) blur(20px) brightness(125%) ; */
  backdrop-filter: saturate(180%) blur(20px);
  box-shadow: rgb(0 0 0 / 2%) 0px 1px 0px 0px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  /* border-bottom: 1px solid #302316; */

  padding-left: 3%;
  padding-right: 4%;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  /*   align-self: center; */
`;

const HeaderMain = styled.div`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
`;

const HeaderLinksContainer = styled.nav`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  column-gap: 10rem;

  @media (max-width: ${bp.md}px) {
    display: none;
  }
`;

const HeaderLinks = styled.a`
  font-weight: 400;
  font-size: 1rem;

  user-select: none;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
`;

const ExpandMenuButton = styled.button`
  @media (min-width: ${bp.md}px) {
    display: none;
  }
`;

const SvgIcon = styled.div`
  height: ${_HEADER_HEIGHT_};
  width: min-content;
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  background-color: #302316;
  border: none;
`;

const LogoContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  align-content: center;
  align-self: center;
  direction: column;
`;

const LogoText = styled.div`
  color: aquamarine;
  font-style: italic;
  font-weight: 500;
  font-size: 150%;
`;

function Header() {
  const [isMenuExpanded, setIsMenuExpanded] = React.useState<boolean>(false);

  const ExpandedHeader = React.useMemo(
    () => styled.div`
      display: ${isMenuExpanded ? "flex" : "none"};
      flex-direction: column;
      flex-wrap: nowrap;
      justify-content: space-between;
      align-items: center;
      align-content: center;
      row-gap: 1rem;

      width: 100%;

      padding-bottom: 1rem;

      @media (min-width: ${bp.md}px) {
        display: none;
      }
    `,
    [isMenuExpanded]
  );

  React.useEffect(() => {
    console.log(isMenuExpanded);
  }, [isMenuExpanded]);

  return (
    <React.Fragment>
      {/* {isMenuExpanded ? <Curtain zIndex={_HEADER_Z_INDEX_ - 2} /> : null} */}
      <HeaderRoot>
        <HeaderMain>
          <LogoContainer>
            {/*  <AppleIcon fontSize="large" sx={{ color: "aquamarine" }} /> */}
            <LogoText>digonto</LogoText>
          </LogoContainer>
          <HeaderLinksContainer>
            <NextLink href="/" passHref>
              <HeaderLinks>Guides</HeaderLinks>
            </NextLink>
            <NextLink href="/" passHref>
              <HeaderLinks>Blog</HeaderLinks>
            </NextLink>
            <NextLink href="/" passHref>
              <HeaderLinks>Projects</HeaderLinks>
            </NextLink>
          </HeaderLinksContainer>
          <ExpandMenuButton
            onClick={() => setIsMenuExpanded((oldState) => !oldState)}
          >
            {/*  <MenuIcon color="secondary" /> */}
          </ExpandMenuButton>
        </HeaderMain>
        <ExpandedHeader>
          <div>Guides</div>
          <Divider />
          <div>Blog</div>
          <Divider />
          <div>Products</div>
        </ExpandedHeader>
      </HeaderRoot>
      {/* <HeaderSpacer /> */}
    </React.Fragment>
  );
}

export default Header;

{
  /* <SvgIcon>
            <img
              src="/assets/logo.svg"
              alt="Logo"
              width={"min-width"}
              height={"100%"}
            />
          </SvgIcon> */
}
