"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import heroImage from "@public/quino-al-mBQIfKlvowM-unsplash.jpg";
import { FullBleed } from "../layout/Wrapper";
import { Engine } from "@/core/Engine";
import { isBrowser } from "../../../types/core";

export default function Hero() {
  const [vh, setVh] = useState("100vh");

  useEffect(() => {
    if (isBrowser && !window.engine) {
      window.engine = new Engine();
    }
  }, []);

  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight;
      setVh(`${vh}px`);
    };

    updateVh();
    window.addEventListener("resize", updateVh);
    window.addEventListener("orientationchange", updateVh);

    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
    };
  }, []);

  return (
    <React.Fragment>
      <FullBleed
        className="relative -mt-[var(--header-height)]"
        style={{ height: vh }}
      >
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={heroImage}
            fill
            quality={20}
            alt="Digonto"
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 w-full h-full backdrop-saturate-[120%] backdrop-blur-[32px] backdrop-brightness-75" />

        <div className="relative h-full w-full flex items-center justify-center px-4 md:px-8 z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-normal tracking-[0.025em] leading-snug max-w-5xl text-center">
            Hello! I&apos;m Saikat, a Full-Stack Software Developer working with
            distributed micro-services, React, AWS and ML.
          </h1>
        </div>
      </FullBleed>
    </React.Fragment>
  );
}
