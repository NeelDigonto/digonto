import React from "react";

export interface NoteProps {
  type: "info" | "warning";
}

const Note: React.FC<React.PropsWithChildren<NoteProps>> = (props) => {
  return <aside className="noteRoot">{props.children}</aside>;
};

export default Note;
