import React from "react";
import styles from "./BGCanvas.module.css";

const BGCanvas = (props: React.HTMLAttributes<HTMLDivElement>) => {
  return <div {...props} className={styles.bg__canvas} />;
};

export default BGCanvas;
