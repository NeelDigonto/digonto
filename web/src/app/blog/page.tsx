import { Wrapper } from "@/components/layout/Wrapper";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  readTime: string;
  coverImage?: string;
  tags: string[];
}

const blogPosts: BlogPost[] = [];

export default function BlogPage() {
  return (
    <Wrapper>
      <div className="min-h-screen py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Thoughts on web development, technology, and software engineering
        </p>
        
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
            <div className="grid gap-8 md:grid-cols-2">
              {blogPosts.map((post) => (
                <article key={post.slug} className="group">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block h-full p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300"
                  >
                    {post.coverImage && (
                      <div className="relative h-48 mb-6 rounded-xl overflow-hidden bg-gradient-to-br from-[#667eea]/20 to-[#764ba2]/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#667eea]/10 to-[#764ba2]/10" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-500 dark:text-gray-400">
                      <time>
                        {new Date(post.date).toLocaleDateString('en-US', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </time>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                    
                    <h2 className="text-2xl font-semibold mb-3 group-hover:text-[#667eea] transition-colors leading-tight">
                      {post.title}
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-white/5 border border-white/10 rounded-md"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
            
            <div className="mt-16 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                More posts coming soon...
              </p>
            </div>
          </>
        )}
      </div>
    </Wrapper>
  );
}