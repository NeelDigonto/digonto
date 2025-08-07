"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import heroImage from "@public/quino-al-mBQIfKlvowM-unsplash.jpg";
import { FullBleed } from "../layout/Wrapper";
import { Engine } from "@/core/Engine";
import { isBrowser } from "../../../types/core";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiArrowDown } from "react-icons/fi";

export default function Hero() {
  const [vh, setVh] = useState("100vh");

  useEffect(() => {
    if (isBrowser && !window.engine) {
      window.engine = new Engine();
    }
  }, []);

  useEffect(() => {
    const updateVh = () => {
      const vh = window.innerHeight;
      setVh(`${vh}px`);
    };

    updateVh();
    window.addEventListener("resize", updateVh);
    window.addEventListener("orientationchange", updateVh);

    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
    };
  }, []);

  return (
    <React.Fragment>
      <FullBleed
        className="relative -mt-[var(--header-height)]"
        style={{ height: vh }}
      >
        <div className="absolute inset-0 w-full h-full">
          <Image
            src={heroImage}
            fill
            quality={20}
            alt="Digonto"
            className="object-cover object-center"
            priority
          />
        </div>
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-saturate-[120%] backdrop-blur-[24px]" />

        <div className="relative h-full w-full flex flex-col items-center justify-center px-4 md:px-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-orange-500/20 to-yellow-500/20 border border-orange-500/30 backdrop-blur-md">
                <span className="text-sm font-bold bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                  Full-Stack Engineer @ Cloudflare
                </span>
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Hello! I&apos;m </span>
              <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Saikat
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-200 font-light max-w-4xl mx-auto mb-8 leading-relaxed">
              Building scalable distributed systems with
              <span className="text-cyan-400 font-medium"> microservices</span>,
              <span className="text-purple-400 font-medium"> React</span>,
              <span className="text-pink-400 font-medium"> AWS</span> and
              <span className="text-yellow-400 font-medium"> ML</span>
            </p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex gap-4 justify-center mb-12"
            >
              <a
                href="https://github.com/yourusername"
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-cyan-500/50 hover:scale-110 transition-all duration-300 group"
                aria-label="GitHub"
              >
                <FiGithub className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors" />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-500/50 hover:scale-110 transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
              </a>
              <a
                href="mailto:your.email@example.com"
                className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/50 hover:scale-110 transition-all duration-300 group"
                aria-label="Email"
              >
                <FiMail className="w-5 h-5 text-gray-400 group-hover:text-pink-400 transition-colors" />
              </a>
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2 text-gray-400"
            >
              <span className="text-xs uppercase tracking-widest">Scroll</span>
              <FiArrowDown className="w-4 h-4" />
            </motion.div>
          </motion.div>
        </div>
      </FullBleed>
    </React.Fragment>
  );
}
