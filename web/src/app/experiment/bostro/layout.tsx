import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Saikat's RL Experiment",
  description: "Saikat's RL Experiment",
};

export default function RLExperimentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
