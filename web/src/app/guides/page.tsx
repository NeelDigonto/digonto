"use client";

import { Wrapper } from "@/components/layout/Wrapper";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  FiArrowRight, 
  FiBook, 
  FiClock, 
  FiCalendar,
  FiCode,
  FiDatabase,
  FiServer,
  FiTool,
  FiLayers,
  FiGitBranch,
  FiPackage,
  FiTerminal
} from "react-icons/fi";

interface Guide {
  title: string;
  description: string;
  href: string;
  readTime: string;
  category: string;
  date: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  icon?: React.ReactNode;
  tags?: string[];
}

const categoryIcons: Record<string, React.ReactNode> = {
  "Frontend": <FiCode />,
  "Backend": <FiServer />,
  "Database": <FiDatabase />,
  "DevOps": <FiTool />,
  "Architecture": <FiLayers />,
  "Git": <FiGitBranch />,
  "Package Management": <FiPackage />,
  "CLI": <FiTerminal />,
};

const guides: Guide[] = [];

export default function GuidesPage() {
  return (
    <Wrapper>
      <div className="min-h-screen py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-violet-400 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
            Guides
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            In-depth tutorials and technical deep-dives to level up your development skills
          </p>
        </motion.div>

        {guides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <FiBook className="w-16 h-16 mx-auto mb-6 text-gray-500" />
            <p className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
              No guides yet
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              In-depth tutorials and technical guides coming soon!
            </p>
          </motion.div>
        ) : (
          <>
            <div className="max-w-4xl space-y-8">
              {guides.map((guide, index) => (
                <motion.article
                  key={guide.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link
                    href={guide.href}
                    className="block relative overflow-hidden"
                  >
                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-violet-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-500 rounded-2xl" />
                    
                    {/* Content container */}
                    <div className="relative p-8 border border-white/10 rounded-2xl group-hover:border-white/20 transition-all duration-300 backdrop-blur-sm bg-black/20">
                      {/* Category, icon and metadata */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-violet-400">
                            {guide.icon || categoryIcons[guide.category] || <FiBook />}
                          </div>
                          
                          {/* Category and metadata */}
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-3">
                              <span className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30 rounded-full">
                                {guide.category}
                              </span>
                              {guide.difficulty && (
                                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  guide.difficulty === "beginner" 
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : guide.difficulty === "intermediate"
                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                }`}>
                                  {guide.difficulty}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <FiClock className="w-4 h-4" />
                                <span>{guide.readTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiCalendar className="w-4 h-4" />
                                <time>
                                  {new Date(guide.date).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric"
                                  })}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-3xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:from-violet-400 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
                        {guide.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                        {guide.description}
                      </p>

                      {/* Tags and arrow */}
                      <div className="flex items-center justify-between">
                        {guide.tags && guide.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {guide.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-full text-violet-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <div />
                        )}

                        {/* Read guide arrow */}
                        <div className="flex items-center gap-2 text-purple-400 group-hover:text-violet-400 transition-colors">
                          <span className="text-sm font-medium">Read Guide</span>
                          <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Number indicator */}
                    <div className="absolute -left-12 top-8 hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30">
                      <span className="text-sm font-bold text-violet-400">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-20 text-center"
            >
              <p className="text-gray-500 italic">More guides coming soon...</p>
            </motion.div>
          </>
        )}
      </div>
    </Wrapper>
  );
}
