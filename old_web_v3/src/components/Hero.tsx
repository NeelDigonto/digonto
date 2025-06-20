import React from "react";
import Image from "next/image";
import heroImage from "@public/quino-al-mBQIfKlvowM-unsplash.jpg";
import { FullBleed } from "./FullBleed";
import { styled } from "@pigment-css/react";

const HeroImageContainer = styled(FullBleed)`
  height: calc(100vh - var(--header-height));
  /* height: 100vh;
  top: 0; */
  width: 100%;
  z-index: -2;
  position: absolute;

  /*  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center; */
`;

/* const HeroImage = css`
  object-fit: cover;
  object-position: center;
  height: 100%;
  width: 100%;
`;
 */

const HeroImageEffect = styled.div`
  height: calc(100vh - var(--header-height));
  /* height: 100vh;
  top: 0; */
  width: 100%;
  z-index: -1;
  position: absolute;

  backdrop-filter: saturate(120%) blur(32px) brightness(75%);
`;

const HeroTextContainer = styled.div`
  height: calc(100vh - var(--header-height));
  width: 100%;

  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const HeroText = styled.div`
  letter-spacing: 0.025em;
  font-weight: 400;
  font-size: 2.25rem;
  line-height: 2.5rem;
`;

export default function Hero() {
  return (
    <React.Fragment>
      <HeroImageContainer>
        <Image
          src={heroImage}
          width={300}
          height={200}
          quality={20}
          alt="Digonto"
          style={{
            objectFit: "cover",
            objectPosition: "center",
            height: "100%",
            width: "100%",
          }}
        />
      </HeroImageContainer>
      <HeroImageEffect />
      <HeroTextContainer>
        <HeroText>
          Hello! I&apos;m Saikat, a Full-Stack Software Developer working with
          distributed micro-services, React, AWS and ML.
        </HeroText>
      </HeroTextContainer>
    </React.Fragment>
  );
}
