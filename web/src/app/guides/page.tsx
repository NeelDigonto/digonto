import { Wrapper } from "@/components/layout/Wrapper";
import Link from "next/link";

interface Guide {
  title: string;
  description: string;
  href: string;
  readTime: string;
  category: string;
  date: string;
}

const guides: Guide[] = [];

export default function GuidesPage() {
  return (
    <Wrapper>
      <div className="min-h-screen py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Guides
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          In-depth tutorials and technical guides for cool stuff.
        </p>

        {guides.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
              No guides yet
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              In-depth tutorials and technical guides coming soon!
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {guides.map((guide) => (
              <Link
                key={guide.href}
                href={guide.href}
                className="group block p-8 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 hover:translate-x-2 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <span className="px-3 py-1 text-sm font-medium bg-[#667eea]/20 text-[#667eea] border border-[#667eea]/30 rounded-full">
                        {guide.category}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {guide.readTime}
                      </span>
                    </div>
                    <h3 className="text-3xl font-semibold mb-3 group-hover:text-[#667eea] transition-colors">
                      {guide.title}
                    </h3>
                  </div>
                  <time className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(guide.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>

                <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                  {guide.description}
                </p>

                <div className="mt-4 flex items-center text-[#667eea] font-medium">
                  Read more
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}
