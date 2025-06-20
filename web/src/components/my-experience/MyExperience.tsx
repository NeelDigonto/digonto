import React from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import cloudflareLogo from "@public/cf-logo-v-rgb.png";
import dyteLogo from "@public/dyte.svg";
import cncfLogo from "@public/cncf-color-primary.svg";

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
    <div className="w-full py-2 my-2 flex flex-col">
      <div className="flex flex-col">
        <div className="min-w-[128px] max-w-[128px]">
          <Image
            src={organizationImageSRC}
            width={100}
            height={40}
            alt={organizationImagAlt}
            className="bg-gray-200 rounded shadow-[0_0_10px_10px_rgba(255,255,255,0.1)] w-auto h-auto"
          />
        </div>
        <div className="mt-2 mb-4">
          <div className="text-base text-gray-600 dark:text-gray-400">
            {location} - {locationType}
          </div>
          <div className="text-base text-gray-600 dark:text-gray-400">
            {startingTime} - {endingTime}
          </div>
        </div>
      </div>
      <div className="flex flex-col tracking-[0.025em] font-normal text-2xl leading-8">
        {details}
      </div>
    </div>
  );
}

export default function MyExperience() {
  return (
    <div className="min-h-[calc(100vh-var(--header-height))] w-full pt-8">
      <div className="w-full flex flex-col">
        <MyExperienceItem
          {...{
            organizationImageSRC: cloudflareLogo,
            organizationImagAlt: "Cloudflare",
            startingTime: "March 2025",
            endingTime: "Present",
            location: "Bangalore, India",
            locationType: "Remote",
            details: (
              <>
                ◦ Team: Part of global ETI Team and currently working on
                Cloudflare RealtimeKit.
              </>
            ),
          }}
        />
        <MyExperienceItem
          {...{
            organizationImageSRC: dyteLogo,
            organizationImagAlt: "Dyte",
            startingTime: "June 2024",
            endingTime: "Feb 2025",
            location: "Bangalore, India",
            locationType: "Remote",
            details: (
              <>
                ◦ Billing: Implemented automated billing architecture with
                Stripe.
                <br />◦ Improved DB write performance with advanced DB query
                pipelining and redis caches.
                <br />◦ Led monolith migration and security audits.
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
            startingTime: "Jan 2024",
            endingTime: "May 2024",
            location: "Bangalore, India",
            locationType: "Remote",
            details: (
              <>
                ◦ API: Architected 4 new crucial client-facing APIs and updated
                6+ APIs.
                <br />◦ Microservices: Implemented distributed lock-free
                Microservices using Redis, drastically improving performance and
                stability for 100K+ concurrent users.
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
                marshaling between 32-bit(wasm) and 64-bit(host) address space.
                Enabled Cpython wasm32-wasi build to run on WasmEdge.
              </>
            ),
          }}
        />
      </div>
    </div>
  );
}
