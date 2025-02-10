import MyExperience from "@/components/MyExperience";
import Hero from "@/components/Hero";
import React from "react";
import { Wrapper } from "@/components/FullBleed";
import { BGCanvas } from "@/components/Canvas/BGCanvas";

export default function Home() {
  return (
    <>
      <BGCanvas id="canvas" />
      <Wrapper>
        <Hero />
        <MyExperience />
      </Wrapper>
    </>
  );
}

// #fadb92
