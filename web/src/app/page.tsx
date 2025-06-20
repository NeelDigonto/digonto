import BGCanvas from "@/components/canvas/BGCanvas";
import Hero from "@/components/hero/Hero";
import { Wrapper } from "@/components/layout/Wrapper";
import MyExperience from "@/components/my-experience/MyExperience";

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
