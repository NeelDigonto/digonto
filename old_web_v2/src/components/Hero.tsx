import React from "react";
import Badge from "./Badge";

const Hero = () => {
  return (
    <div className="heroContainer">
      <div className="aboutContainer">
        <div className="heroTitleText">I warmly welcome you to my site.</div>
        <div className="aboutIntroContainer">
          <div className="heroIntroText">
            I am a developer who loves to work on almost everything.
          </div>
          <div className="aboutTechStackContainer">
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
          </div>
          <div className="aboutExperienceContainer">
            <div>
              You will soon find blogs and many cool experiments on this site.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
