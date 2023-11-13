import React from "react";
import styled from "styled-components";
import { Body, HeroIntroText, HeroTitleText } from "@/components/Text";
import Image from "next/image";
import Badge from "./Badge";

const HeroContainer = styled.section`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const AboutContainer = styled.div`
  position: absolute;
  right: 0;

  //display: flex;
  //flex-direction: column;
  //justify-content: center;
  //row-gap: 2rem;

  padding-top: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 1rem;

  border-radius: 1rem;

  backdrop-filter: blur(50px);
  box-shadow: rgb(0 0 0 / 2%) 0px 1px 0px 0px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const AboutIntroContainer = styled.div`
  padding-left: 1rem;
`;

const AboutTechStackContainer = styled.div`
  padding-left: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  max-width: 22rem;
  justify-content: flex-start;
`;

const AboutExperienceContainer = styled.div``;

const Hero = () => {
  return (
    <HeroContainer>
      <AboutContainer>
        <HeroTitleText>I warmly welcome you to my site.</HeroTitleText>
        <AboutIntroContainer>
          <HeroIntroText>
            I am developer who loves to work on almost everything.
          </HeroIntroText>
          <AboutTechStackContainer>
            <Badge src="/ReactJS.svg" text="ReactJS" />
            <Badge src="/NextJS.svg" text="NextJS" />
            <Badge src="/NodeJS.svg" text="NodeJS" />
            <Badge src="/C++.svg" text="C++" />
            <Badge src="/Docker.svg" text="Docker" />
            <Badge src="/Kubernetes.svg" text="Kubernetes" />
            <Badge src="/WebAssembly.svg" text="WebAssembly" />
            <Badge src="/PostgreSQL.svg" text="PostgreSQL" />
            <Badge src="/OpenGL.svg" text="OpenGL" />
            <Badge src="/ThreeJS.svg" text="ThreeJS" />
          </AboutTechStackContainer>
          <AboutExperienceContainer>
            <Body>
              You will soon find blogs and many cool experiments on this site.
            </Body>
          </AboutExperienceContainer>
        </AboutIntroContainer>
      </AboutContainer>
    </HeroContainer>
  );
};

export default Hero;
