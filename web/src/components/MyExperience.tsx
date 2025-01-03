import React from "react";
import styles from "@/styles/MyExperience.module.css";
import Image from "next/image";

import { StaticImport } from "next/dist/shared/lib/get-img-props";
import dyteLogo from "@public/dyte.svg";
import cncfLogo from "@public/cncf-color-primary.svg";

interface MyExperienceItemProps {
  organizationImageSRC: string | StaticImport;
  organizationImagAlt: string;
  details: React.ReactNode;
}

function MyExperienceItem({
  organizationImageSRC,
  organizationImagAlt,
  details,
}: MyExperienceItemProps) {
  return (
    <div className={styles.myExperienceItem}>
      <div className={styles.myExperienceBrief}>
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
      </div>
      <div
        className={`text-xl font-normal tracking-wide ${styles.myExperienceDetails}`}
      >
        {details}
      </div>
    </div>
  );
}

export default function MyExperience() {
  return (
    <React.Fragment>
      <div className={styles.myExperienceRoot}>
        <div className={styles.myExperienceListContainer}>
          <MyExperienceItem
            {...{
              organizationImageSRC: dyteLogo,
              organizationImagAlt: "Dyte",
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
        </div>
      </div>
    </React.Fragment>
  );
}
