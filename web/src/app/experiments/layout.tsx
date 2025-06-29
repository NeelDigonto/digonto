import styles from "./experiments.module.css";

export default function ExperimentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className={styles.layout}>{children}</div>;
}
