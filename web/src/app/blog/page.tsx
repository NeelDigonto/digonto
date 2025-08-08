"use client";

import { Wrapper } from "@/components/layout/Wrapper";
import Link from "next/link";
import { BlogPostMeta } from "../../../types/core";
import { motion } from "framer-motion";
import { FiArrowRight, FiClock, FiCalendar } from "react-icons/fi";

// Here since the file is use client, move to mdx later
const blogPosts: BlogPostMeta[] = [
  {
    title: "The Incident That Taught Me Data Pipeline Segregation",
    excerpt:
      "How a critical production incident during a 5000-participant webinar revealed the importance of separating database connection pools for different query priorities.",
    slug: "the-incident-that-taught-me-data-pipeline-segregation",
    date: "2024-12-15",
    readTime: "10 min read",
    tags: ["Backend", "Database", "Performance", "Production"],
  },
];

export default function BlogPage() {
  return (
    <Wrapper>
      <div className="min-h-screen py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Blog
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Deep dives into production incidents, system design, and lessons
            learned from building scalable systems.
          </p>
        </motion.div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
              No blog posts yet
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Thoughts on web development and technology coming soon!
            </p>
          </div>
        ) : (
          <>
            <div className="max-w-4xl space-y-8">
              {blogPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block relative overflow-hidden"
                  >
                    {/* Hover effect background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 rounded-2xl" />

                    {/* Content container */}
                    <div className="relative p-8 border border-white/10 rounded-2xl group-hover:border-white/20 transition-all duration-300 backdrop-blur-sm bg-black/20">
                      {/* Date and read time */}
                      <div className="flex items-center gap-6 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiCalendar className="w-4 h-4" />
                          <time>
                            {new Date(post.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </time>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiClock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl font-bold mb-4 text-white group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300 leading-tight">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-300 mb-6 text-lg leading-relaxed line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Tags and arrow */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-cyan-400"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Read more arrow */}
                        <div className="flex items-center gap-2 text-purple-400 group-hover:text-cyan-400 transition-colors">
                          <span className="text-sm font-medium">Read more</span>
                          <FiArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>

                    {/* Number indicator */}
                    <div className="absolute -left-12 top-8 hidden lg:flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/30">
                      <span className="text-sm font-bold text-cyan-400">
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
              <p className="text-gray-500 italic">More posts coming soon...</p>
            </motion.div>
          </>
        )}
      </div>
    </Wrapper>
  );
}
