import React from "react";
import Image from "next/image";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import dyteLogo from "@public/dyte.svg";
import cncfLogo from "@public/cncf-color-primary.svg";
import { styled } from "@pigment-css/react";

const MyExperienceRoot = styled.div`
  min-height: calc(100vh - var(--header-height));
  width: 100%;
  margin-top: var(--header-height);
  padding-top: 2rem;
`;

const MyExperienceListContainer = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
`;

const MyExperienceItemRoot = styled.div`
  width: 100%;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;

  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
`;

const MyExperienceBrief = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
`;

const MyExperienceBriefInfo = styled.div`
  margin-top: 0.5rem;
  margin-bottom: 1rem;
`;

const MyExperienceOrgImage = styled.div`
  /* box-shadow: rgb(0 0 0 / 2%) 0px 1px 0px 0px; */
  /* border-top: 1px solid rgb(255 255 255 / 80%); */
  /* border-left: 1px solid rgb(255 255 255 / 80%); */
  min-width: 128px;
  max-width: 128px;
`;

const MyExperienceDetails = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;

  letter-spacing: 0.025em;
  font-weight: 400;
  font-size: 1.25rem;
  line-height: 1.75rem;
`;

interface MyExperienceItemProps {
  organizationImageSRC: string | StaticImport;
  organizationImagAlt: string;
  startingTime: string;
  endingTime: string;
  location: string;
  locationType: "Remote" | "Hybrid" | "On-Site";
  details: React.ReactNode;
}

function MyExperienceItem({
  organizationImageSRC,
  organizationImagAlt,
  startingTime,
  endingTime,
  location,
  locationType,
  details,
}: MyExperienceItemProps) {
  return (
    <MyExperienceItemRoot>
      <MyExperienceBrief>
        <MyExperienceOrgImage>
          <Image
            src={organizationImageSRC}
            width={5 * 20}
            height={2 * 20}
            alt={organizationImagAlt}
            style={{
              backgroundColor: "#ddd",
              borderRadius: "4px",
              boxShadow: "0 0 10px 10px rgba(255, 255, 255, 0.1)",
              width: "auto",
              height: "auto",
            }}
          />
        </MyExperienceOrgImage>
        <MyExperienceBriefInfo>
          <div>
            {location} - {locationType}
          </div>
          <div>
            {startingTime} - {endingTime}
          </div>
        </MyExperienceBriefInfo>
      </MyExperienceBrief>
      <MyExperienceDetails>{details}</MyExperienceDetails>
    </MyExperienceItemRoot>
  );
}

export default function MyExperience() {
  return (
    <React.Fragment>
      <MyExperienceRoot>
        <MyExperienceListContainer>
          <MyExperienceItem
            {...{
              organizationImageSRC: dyteLogo,
              organizationImagAlt: "Dyte",
              startingTime: "June 2024",
              endingTime: "Present",
              location: "Bangalore, India",
              locationType: "Remote",
              details: (
                <>
                  ◦ Billing: Implemented automated billing architecture with
                  Stripe.
                  <br />◦ Initiated multiple API releases and formulated release
                  guidelines.
                </>
              ),
            }}
          />
          <MyExperienceItem
            {...{
              organizationImageSRC: dyteLogo,
              organizationImagAlt: "Dyte",
              startingTime: "May 2024",
              endingTime: "Jan 2024",
              location: "Bangalore, India",
              locationType: "Remote",
              details: (
                <>
                  ◦ API: Architected 4 new crucial client-facing APIs and
                  updated 6+ APIs.
                  <br />◦ Microservices: Implemented distributed lock-free
                  Microservices using Redis, drastically improving performance
                  and stability for 100K+ concurrent users.
                </>
              ),
            }}
          />
          <MyExperienceItem
            {...{
              organizationImageSRC: cncfLogo,
              organizationImagAlt: "CNCF",
              startingTime: "June 2023",
              endingTime: "Aug 2023",
              location: "USA",
              locationType: "Remote",
              details: (
                <>
                  ◦ Created the official WasmEdge zlib plugin in C++, bringing
                  full Zlib API support as Wasm Imports, with seamless c-struct
                  marshaling between 32-bit(wasm) and 64-bit(host) address
                  space. Enabled Cpython wasm32-wasi build to run on WasmEdge.
                </>
              ),
            }}
          />
          {/* <button>Resume</button> */}
        </MyExperienceListContainer>
      </MyExperienceRoot>
    </React.Fragment>
  );
}
