import React from "react";
import styles from "./Wrapper.module.css";

interface WrapperProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export const Wrapper = ({ children, className, ...props }: WrapperProps) => {
  return (
    <main 
      className={`${styles.wrapper} ${className || ''}`} 
      {...props}
    >
      {children}
    </main>
  );
};

export const SideNav = ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <nav 
      className={`${styles.sideNav} ${className || ''}`} 
      {...props}
    >
      {children}
    </nav>
  );
};

export const AdsCol = ({ children, className, ...props }: React.HTMLAttributes<HTMLElement>) => {
  return (
    <aside 
      className={`${styles.adsCol} ${className || ''}`} 
      {...props}
    >
      {children}
    </aside>
  );
};

export const FullBleed = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div 
      className={`${styles.fullBleed} ${className || ''}`} 
      {...props}
    >
      {children}
    </div>
  );
};