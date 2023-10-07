import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main>
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          alignContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 32 }}>Reconstructing...</div>
        <div style={{ fontSize: 32 }}>(Shifting to AWS EKS)</div>
      </div>
    </main>
  );
}
