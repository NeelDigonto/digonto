import React from "react";

export interface RoadmapProps {
  checkpoints: React.ReactNode[];
}

const Roadmap: React.FC<React.PropsWithChildren<RoadmapProps>> = (props) => {
  return (
    <div className="roadmapRoot">
      <h1>Roadmap</h1>
      <br />
      {props.checkpoints.map((checkpoint, idx) => {
        return (
          <div key={idx}>
            {idx + 1}. {checkpoint}
          </div>
        );
      })}
    </div>
  );
};

export default Roadmap;
