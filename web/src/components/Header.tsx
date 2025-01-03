"use client";
import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import styles from "@/styles/Header.module.css";

import { MdMenu } from "react-icons/md";

function HeaderNavLink({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="text-2xl font-normal tracking-wide">{children}</div>;
}

export default function Header() {
  const [isMenuExpanded, setIsMenuExpanded] = React.useState<boolean>(false);

  return (
    <React.Fragment>
      {isMenuExpanded ? <div className={styles.headerNavCurtain} /> : null}
      <header className={styles.headerRoot}>
        <div className={styles.headerContainer}>
          <NextLink href="/" passHref className={styles.headerBrandContainer}>
            <div className={styles.headerIconContainer}>
              <Image src="/favicon.svg" width={32} height={32} alt="Digonto" />
            </div>
            <div className="text-3xl italic font-semibold tracking-wide">
              Digonto
            </div>
          </NextLink>
          <div className={styles.headerLinkContainer}>
            <NextLink href="/" passHref>
              <HeaderNavLink>Guides</HeaderNavLink>
            </NextLink>
            <NextLink href="/" passHref>
              <HeaderNavLink>Blogs</HeaderNavLink>
            </NextLink>
            <NextLink href="/" passHref>
              <HeaderNavLink>Experiments</HeaderNavLink>
            </NextLink>
          </div>
          <div className={styles.headerExpandButtonContainer}>
            <button onClick={() => setIsMenuExpanded((oldState) => !oldState)}>
              <MdMenu size={32} />
            </button>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}
