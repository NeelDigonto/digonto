"use client";
import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import faviconSVG from "@public/favicon.svg";

import { MdMenu } from "react-icons/md";
import { styled } from "@pigment-css/react";

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  height: var(--header-height);
  width: 100%;
  z-index: 800;

  /* background: rgba(255, 255, 255, 0.7); */
  /* backdrop-filter: saturate(180%) blur(20px) brightness(125%) ; */
  backdrop-filter: saturate(180%) blur(32px) brightness(75%);
  box-shadow: rgb(0 0 0 / 2%) 0px 1px 0px 0px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
  /* border-bottom: 1px solid #302316; */

  padding-left: 16px;
  padding-right: 16px;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  /*   align-self: center; */

  @media (max-width: 961px) {
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  /*   align-self: center; */

  position: relative;
  width: min(110ch, calc(100% - 64px));
  height: 100%;

  @media (max-width: 961px) {
    width: 100%;
  }
`;

const HeaderBrandContainer = styled(NextLink)`
  position: relative;
  height: 100%;
  width: max-content;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
`;

const HeaderIconContainer = styled.div`
  height: 100%;
  width: max-content;

  padding-left: 16px;
  padding-right: 16px;

  /* margin-left: 16px; */
  /* margin-right: 16px; */

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: center;
  align-content: center;
`;

const HeaderLinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-end;
  align-items: center;
  align-content: center;

  height: 100%;
  width: max-content;

  padding-left: 16px;
  padding-right: 16px;
  gap: 2rem;

  @media (max-width: 961px) {
    display: none;
  }
`;

const HeaderExpandButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;

  height: 100%;
  width: max-content;

  padding-left: 16px;
  padding-right: 16px;

  @media (min-width: 961px) {
    display: none;
  }
`;

const HeaderNavCurtain = styled.div`
  z-index: 750;

  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  height: 100vh;
  width: 100vw;

  backdrop-filter: saturate(180%) blur(20px);
`;

const HeaderBrandName = styled.div`
  letter-spacing: 0.025em;
  font-style: italic;
  font-weight: 600;
  font-size: 1.875rem;
  line-height: 2.25rem;
`;

const HeaderNavLink = styled(NextLink)`
  letter-spacing: 0.025em;
  font-style: italic;
  font-weight: 400;
  font-size: 1.5rem;
  line-height: 2rem;
`;

export default function DefaultHeader() {
  const [isMenuExpanded, setIsMenuExpanded] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      {isMenuExpanded ? <HeaderNavCurtain /> : null}
      <HeaderRoot>
        <HeaderContainer>
          <HeaderBrandContainer href="/" passHref>
            <HeaderIconContainer>
              <Image src={faviconSVG} width={32} height={32} alt="Digonto" />
            </HeaderIconContainer>
            <HeaderBrandName>Digonto</HeaderBrandName>
          </HeaderBrandContainer>
          <HeaderLinkContainer>
            <HeaderNavLink href="/" passHref>
              Guides
            </HeaderNavLink>
            <HeaderNavLink href="/blog" passHref>
              Blogs
            </HeaderNavLink>
            <HeaderNavLink href="/" passHref>
              Experiments
            </HeaderNavLink>
          </HeaderLinkContainer>
          <HeaderExpandButtonContainer>
            <button onClick={() => setIsMenuExpanded((oldState) => !oldState)}>
              <MdMenu size={32} />
            </button>
          </HeaderExpandButtonContainer>
        </HeaderContainer>
      </HeaderRoot>
    </React.Fragment>
  );
}
