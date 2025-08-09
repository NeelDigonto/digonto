"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import cloudflareLogo from "@public/cf-logo-v-rgb.png";
import dyteLogo from "@public/dyte.svg";
import cncfLogo from "@public/cncf-color-primary.svg";

interface MyExperienceItemProps {
  organizationImageSRC: string | StaticImport;
  organizationImagAlt: string;
  startingTime: string;
  endingTime: string;
  location: string;
  locationType: "Remote" | "Hybrid" | "On-Site";
  details: React.ReactNode;
  techStack?: string[];
  index: number;
  isLast: boolean;
}

function MyExperienceItem({
  organizationImageSRC,
  organizationImagAlt,
  startingTime,
  endingTime,
  location,
  locationType,
  details,
  techStack,
  index,
  isLast,
}: MyExperienceItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (itemRef.current) {
      observer.observe(itemRef.current);
    }

    return () => {
      if (itemRef.current) {
        observer.unobserve(itemRef.current);
      }
    };
  }, []);

  const getLocationTypeColor = () => {
    switch (locationType) {
      case "Remote":
        return "text-blue-400 bg-blue-400/10 border-blue-400/30";
      case "Hybrid":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/30";
      case "On-Site":
        return "text-green-400 bg-green-400/10 border-green-400/30";
    }
  };

  return (
    <div
      ref={itemRef}
      className={`relative w-full py-4 md:py-8 flex transition-all duration-700 transform ${
        isVisible ? "opacity-100 translate-x-0" : "opacity-0 md:translate-x-10"
      }`}
      style={{ transitionDelay: `${index * 150}ms` }}
    >
      {/* Timeline line and dot - hidden on mobile */}
      <div className="hidden md:block absolute left-[64px] top-0 w-[2px] h-full">
        <div
          className={`absolute inset-0 bg-gradient-to-b ${
            index === 0
              ? "from-transparent via-purple-500/50 to-purple-500/50"
              : isLast
              ? "from-purple-500/50 to-transparent"
              : "from-purple-500/50 to-purple-500/50"
          }`}
        />
        {/* Animated dot */}
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="w-4 h-4 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50"></div>
            <div className="absolute inset-0 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
          </div>
        </div>
      </div>

      {/* Content Card */}
      <div className="md:ml-24 w-full group">
        <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-2xl p-4 md:p-6 hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 md:hover:-translate-y-1">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            <div className="flex items-start gap-3 md:gap-4">
              {/* Logo */}
              <div
                className={`relative group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ${
                  organizationImagAlt === "CNCF"
                    ? "min-w-[70px] md:min-w-[90px]"
                    : "min-w-[50px] md:min-w-[56px]"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <Image
                  src={organizationImageSRC}
                  width={organizationImagAlt === "CNCF" ? 90 : 56}
                  height={organizationImagAlt === "CNCF" ? 45 : 22}
                  alt={organizationImagAlt}
                  className={`relative bg-white/90 ${
                    organizationImagAlt === "CNCF"
                      ? "rounded p-1.5 md:p-2"
                      : "rounded-lg p-1 md:p-1.5"
                  } shadow-lg w-auto h-auto`}
                />
              </div>

              {/* Title and Info */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all duration-300">
                  {organizationImagAlt}
                </h3>
                <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm">
                  <span className="text-gray-400 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {startingTime} - {endingTime}
                  </span>
                  <span className="text-gray-400 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {location}
                  </span>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full border ${getLocationTypeColor()}`}
                  >
                    {locationType}
                  </span>
                </div>
              </div>
            </div>

            {/* Current Position Badge */}
            {endingTime === "Present" && (
              <div className="self-start sm:self-auto px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 text-xs font-bold rounded-full border border-green-500/30 animate-pulse">
                CURRENT
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="mb-6 text-gray-300 leading-relaxed space-y-2">
            {details}
          </div>

          {/* Tech Stack */}
          {techStack && techStack.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech, i) => (
                <span
                  key={tech}
                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg hover:border-purple-500/40 hover:from-purple-500/20 hover:to-pink-500/20 transition-all duration-300 cursor-default"
                  style={{
                    animationDelay: `${index * 150 + i * 50}ms`,
                    animation: isVisible
                      ? "fadeInUp 0.5s ease-out forwards"
                      : "none",
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyExperience() {
  const experiences = [
    {
      organizationImageSRC: cloudflareLogo,
      organizationImagAlt: "Cloudflare",
      startingTime: "March 2025",
      endingTime: "Present",
      location: "Bangalore, India",
      locationType: "On-Site" as const,
      details: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              Part of global ETI Team, working on Cloudflare RealtimeKit -
              building next-generation real-time communication infrastructure
            </span>
          </li>
        </ul>
      ),
      techStack: [
        "TypeScript",
        "Serverless",
        "CloudFlare Workers",
        "Durable Objects",
        "Stripe",
      ],
    },
    {
      organizationImageSRC: dyteLogo,
      organizationImagAlt: "Dyte",
      startingTime: "June 2024",
      endingTime: "Feb 2025",
      location: "Bangalore, India",
      locationType: "Hybrid" as const,
      details: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>Billing Architecture:</strong> Designed and implemented
              automated billing system with Stripe.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>Performance:</strong> Improved DB write performance by
              &gt;5x with advanced query pipelining and Redis caching strategies
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>Architecture:</strong> Led monolith to microservices
              migration and conducted comprehensive security audits
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>DevOps:</strong> Initiated multiple API releases and
              formulated release guidelines.
            </span>
          </li>
        </ul>
      ),
      techStack: [
        "Node.js",
        "Redis",
        "PostgreSQL",
        "Express",
        "RabbitMQ",
        "AWS",
        "Kubernetes",
        "Stripe",
      ],
    },
    {
      organizationImageSRC: dyteLogo,
      organizationImagAlt: "Dyte",
      startingTime: "Jan 2024",
      endingTime: "May 2024",
      location: "Bangalore, India",
      locationType: "Hybrid" as const,
      details: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>API Development:</strong> Architected 4 new crucial
              client-facing APIs and enhanced 6+ existing APIs for better
              performance & feature
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>Scalability:</strong> Implemented distributed lock-free
              microservices using Redis, supporting 50K+ concurrent users with
              full idempotency & fault tolerance
            </span>
          </li>
        </ul>
      ),
      techStack: [
        "Node.js",
        "Redis",
        "PostgreSQL",
        "Express",
        "RabbitMQ",
        "AWS",
        "Kubernetes",
      ],
    },
    {
      organizationImageSRC: cncfLogo,
      organizationImagAlt: "CNCF",
      startingTime: "June 2023",
      endingTime: "Aug 2023",
      location: "USA",
      locationType: "Remote" as const,
      details: (
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>Open Source:</strong> Created the official WasmEdge zlib
              plugin in C++, bringing full Zlib API support as Wasm Imports
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>Low-level Programming:</strong> Implemented seamless
              c-struct marshaling between 32-bit (wasm) and 64-bit (host)
              address space
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-1">▸</span>
            <span>
              <strong>Impact:</strong> Enabled CPython wasm32-wasi build to run
              on WasmEdge, opening new possibilities for Python in WebAssembly
            </span>
          </li>
        </ul>
      ),
      techStack: ["C++", "WebAssembly", "WASI", "CMake", "GitHub Actions"],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-var(--header-height))] w-full pt-8 md:pt-16 pb-8 px-4 md:px-0">
      {/* Section Header */}
      <div className="mb-8 md:mb-12">
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="h-[2px] flex-1 bg-gradient-to-r from-purple-500/50 via-purple-500/20 to-transparent"></div>
        </div>
        <p className="text-base md:text-xl text-gray-400">
          Building scalable systems and pushing technological boundaries
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {experiences.map((exp, index) => (
          <MyExperienceItem
            key={`${exp.organizationImagAlt}-${exp.startingTime}`}
            {...exp}
            index={index}
            isLast={index === experiences.length - 1}
          />
        ))}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
