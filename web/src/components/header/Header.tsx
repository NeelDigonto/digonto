"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { MdMenu } from "react-icons/md";
import { usePathname } from "next/navigation";
import faviconSVG from "@public/favicon.svg";

export default function Header() {
  const [isMenuExpanded, setIsMenuExpanded] = React.useState<boolean>(false);
  const [isScrolled, setIsScrolled] = React.useState<boolean>(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <React.Fragment>
      {isMenuExpanded && (
        <>
          <div
            className="fixed inset-0 z-[750] h-screen w-screen backdrop-saturate-180 backdrop-blur-[20px] bg-black/50"
            onClick={() => setIsMenuExpanded(false)}
          />
          <div className="fixed top-[var(--header-height)] left-0 right-0 z-[775] backdrop-saturate-180">
            <nav className="flex flex-col p-4 gap-4">
              <Link
                href="/guides"
                className="text-3xl font-semibold tracking-[0.025em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] py-4 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300"
                onClick={() => setIsMenuExpanded(false)}
              >
                Guides
              </Link>
              <Link
                href="/blogs"
                className="text-3xl font-semibold tracking-[0.025em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] py-4 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300"
                onClick={() => setIsMenuExpanded(false)}
              >
                Blogs
              </Link>
              <Link
                href="/experiments"
                className="text-3xl font-semibold tracking-[0.025em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] py-4 px-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/15 hover:border-white/20 hover:scale-[1.02] hover:translate-x-1 transition-all duration-300"
                onClick={() => setIsMenuExpanded(false)}
              >
                Experiments
              </Link>
            </nav>
          </div>
        </>
      )}
      <header
        className={`fixed top-0 h-[var(--header-height)] w-full z-[800] px-2 md:px-4 flex flex-col justify-center items-center transition-all duration-500 ${
          !isHomePage || isScrolled
            ? "bg-white/5 backdrop-saturate-180 backdrop-blur-[20px] backdrop-brightness-[85%] shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] border-b border-white/18 dark:bg-black/5 dark:backdrop-brightness-50 dark:border-white/10"
            : "bg-transparent backdrop-filter-none border-b border-transparent shadow-none"
        }`}
      >
        <div className="flex flex-row justify-between items-center relative w-full md:max-w-[110ch] h-full">
          <Link
            href="/"
            className="relative h-full w-max flex flex-row items-center no-underline text-inherit transition-all duration-200 hover:-translate-y-[1px]"
          >
            <div className="h-full w-max px-2 md:px-4 flex items-center">
              <div
                className={`relative p-1 rounded-full transition-all duration-300 ${
                  isHomePage && !isScrolled ? "bg-white/20 backdrop-blur-sm" : ""
                }`}
              >
                <Image
                  src={faviconSVG}
                  width={32}
                  height={32}
                  alt="Digonto"
                  className={`w-8 h-8 transition-all duration-200 hover:rotate-[5deg] hover:scale-110 ${
                    isHomePage && !isScrolled
                      ? "drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] brightness-110"
                      : "drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]"
                  }`}
                />
              </div>
            </div>
            <div
              className={`tracking-[0.025em] italic font-semibold text-4xl leading-10 transition-all duration-300 ${
                isHomePage && !isScrolled
                  ? "text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)]"
                  : "bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent"
              }`}
            >
              Digonto
            </div>
          </Link>

          <nav className="hidden md:flex flex-row items-center h-full w-max px-2 md:px-4 gap-8">
            <Link
              href="/guides"
              className={`tracking-[0.025em] font-medium text-2xl leading-8 no-underline relative transition-all duration-200 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:transition-[width] after:duration-300 hover:after:w-full ${
                isHomePage && !isScrolled
                  ? "text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] hover:text-white after:bg-gradient-to-r after:from-white after:to-gray-200"
                  : "text-inherit hover:text-[#667eea] after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2]"
              }`}
            >
              Guides
            </Link>
            <Link
              href="/blogs"
              className={`tracking-[0.025em] font-medium text-2xl leading-8 no-underline relative transition-all duration-200 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:transition-[width] after:duration-300 hover:after:w-full ${
                isHomePage && !isScrolled
                  ? "text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] hover:text-white after:bg-gradient-to-r after:from-white after:to-gray-200"
                  : "text-inherit hover:text-[#667eea] after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2]"
              }`}
            >
              Blogs
            </Link>
            <Link
              href="/experiments"
              className={`tracking-[0.025em] font-medium text-2xl leading-8 no-underline relative transition-all duration-200 py-2 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:transition-[width] after:duration-300 hover:after:w-full ${
                isHomePage && !isScrolled
                  ? "text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)] hover:text-white after:bg-gradient-to-r after:from-white after:to-gray-200"
                  : "text-inherit hover:text-[#667eea] after:bg-gradient-to-r after:from-[#667eea] after:to-[#764ba2]"
              }`}
            >
              Experiments
            </Link>
          </nav>

          <button
            className={`flex md:hidden items-center justify-center bg-transparent border-none cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-white/10 ${
              isHomePage && !isScrolled
                ? "text-white drop-shadow-[0_4px_8px_rgba(0,0,0,1)]"
                : "text-inherit"
            }`}
            onClick={() => setIsMenuExpanded((oldState) => !oldState)}
            aria-label="Toggle menu"
          >
            <MdMenu size={24} />
          </button>
        </div>
      </header>
    </React.Fragment>
  );
}
