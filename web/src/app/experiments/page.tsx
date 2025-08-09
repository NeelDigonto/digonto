"use client";

import { Wrapper } from "@/components/layout/Wrapper";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  FiZap,
  FiCode,
  FiBox,
  FiActivity,
  FiArrowUpRight,
  FiCpu,
} from "react-icons/fi";

interface Experiment {
  title: string;
  description: string;
  href: string;
  tags: string[];
  status: "live" | "wip" | "concept";
  icon?: any;
  gradient?: string;
}

const experiments: Experiment[] = [
  {
    title: "AI Chat Assistant",
    description: "Real-time chat interface via Websockets",
    href: "/experiments/ai-chat",
    tags: ["AI", "Gemini", "Real-time", "Streaming"],
    status: "wip",
    icon: FiCpu,
    gradient: "from-violet-500 to-purple-500",
  },
];

export default function ExperimentsPage() {
  return (
    <Wrapper>
      <div className="min-h-screen py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <FiZap className="w-10 h-10 text-yellow-400" />
            </motion.div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
              Experiments
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">
            Interactive demos and creative coding explorations. Building with
            cutting-edge web technologies, 3D graphics, AI integrations, and
            experimental APIs.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-16 max-w-2xl"
        >
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <FiActivity className="w-4 h-4 text-green-400" />
              <span className="text-2xl font-bold text-green-400">
                {experiments.filter((e) => e.status === "live").length}
              </span>
            </div>
            <p className="text-sm text-gray-400">Live Projects</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <FiCode className="w-4 h-4 text-yellow-400" />
              <span className="text-2xl font-bold text-yellow-400">
                {experiments.filter((e) => e.status === "wip").length}
              </span>
            </div>
            <p className="text-sm text-gray-400">In Progress</p>
          </div>
          <div className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/20 rounded-xl">
            <div className="flex items-center gap-2 mb-1">
              <FiBox className="w-4 h-4 text-purple-400" />
              <span className="text-2xl font-bold text-purple-400">
                {experiments.length}
              </span>
            </div>
            <p className="text-sm text-gray-400">Total Projects</p>
          </div>
        </motion.div>

        {experiments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-20"
          >
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center">
              <FiCode className="w-16 h-16 text-yellow-400" />
            </div>
            <p className="text-2xl text-gray-400 mb-4 font-semibold">
              Experiments Loading...
            </p>
            <p className="text-lg text-gray-500">
              New interactive demos and creative projects coming soon!
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {experiments.map((experiment, index) => {
              const Icon = experiment.icon || FiCode;
              return (
                <motion.div
                  key={experiment.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="group relative"
                >
                  <Link
                    href={experiment.href}
                    className="block relative overflow-hidden"
                  >
                    {/* Card Background Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-white/[0.05] rounded-2xl" />

                    {/* Hover Gradient Overlay */}
                    <div
                      className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${
                        experiment.gradient ||
                        "from-yellow-500/10 to-orange-500/10"
                      } rounded-2xl transition-opacity duration-500`}
                    />

                    {/* Card Content */}
                    <div className="relative p-8 border border-white/10 rounded-2xl group-hover:border-white/20 transition-all duration-300 backdrop-blur-sm">
                      {/* Header with Icon and Status */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 bg-gradient-to-br ${
                              experiment.gradient ||
                              "from-yellow-500/20 to-orange-500/20"
                            } rounded-xl group-hover:scale-110 transition-transform duration-300`}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-white group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                              {experiment.title}
                            </h3>
                          </div>
                        </div>

                        {/* Launch Icon */}
                        <FiArrowUpRight className="w-5 h-5 text-gray-500 group-hover:text-white transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300" />
                      </div>

                      {/* Status Badge */}
                      <div className="mb-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full ${
                            experiment.status === "live"
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : experiment.status === "wip"
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 animate-pulse"
                              : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full mr-2 ${
                              experiment.status === "live"
                                ? "bg-green-400"
                                : experiment.status === "wip"
                                ? "bg-yellow-400"
                                : "bg-gray-400"
                            }`}
                          />
                          {experiment.status === "live"
                            ? "Live"
                            : experiment.status === "wip"
                            ? "Work in Progress"
                            : "Concept"}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 mb-6 line-clamp-2 leading-relaxed">
                        {experiment.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {experiment.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 text-xs font-medium bg-white/5 border border-white/10 rounded-lg group-hover:border-white/20 group-hover:bg-white/10 transition-all duration-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Subtle Border Glow */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                        <div className="absolute inset-[-1px] opacity-0 group-hover:opacity-100 bg-gradient-to-r from-yellow-600/10 via-orange-600/10 to-red-600/10 rounded-2xl transition-opacity duration-500" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center py-12 border-t border-white/5"
        >
          <p className="text-gray-500 text-lg mb-2">
            More experiments coming soon
          </p>
          <p className="text-gray-600 text-sm">
            WebGL • Three.js • WebAssembly • Machine Learning • Creative Coding
          </p>
        </motion.div>
      </div>
    </Wrapper>
  );
}
