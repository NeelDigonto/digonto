import React from "react";
import styles from "@/styles/Hero.module.css";
import Image from "next/image";
import heroImage from "@public/quino-al-mBQIfKlvowM-unsplash.jpg";

export default function Hero() {
  return (
    <React.Fragment>
      <div className={`full-bleed ${styles.heroImageContainer}`}>
        <Image
          src={heroImage}
          width={300}
          height={200}
          quality={20}
          alt="Digonto"
          className={styles.heroImage}
        />
      </div>
      <div className={styles.heroImageEffect} />
      <div className={styles.heroTextContainer}>
        <div
          className={`text-4xl font-normal tracking-wide ${styles.heroText}`}
        >
          Hello! I&apos;m Saikat, a Full-Stack Software Developer working with
          distributed micro-services, React, AWS and ML.
        </div>
      </div>
    </React.Fragment>
  );
}
