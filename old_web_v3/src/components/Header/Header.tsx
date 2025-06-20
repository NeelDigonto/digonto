"use client";
import React from "react";
import DefaultHeader from "./DefaultHeader";
import { usePathname } from "next/navigation";
// import RLExperimentHeader from "./RLExperimentHeader";

export default function Header() {
  const path = usePathname();
  const headerImplementation = /\/experiment\/*/.test(path) ? null : (
    <DefaultHeader />
  );

  return <React.Fragment>{headerImplementation}</React.Fragment>;
}
