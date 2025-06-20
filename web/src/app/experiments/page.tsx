import { Wrapper } from "@/components/layout/Wrapper";
import Link from "next/link";

interface Experiment {
  title: string;
  description: string;
  href: string;
  tags: string[];
  status: "live" | "wip" | "concept";
}

const experiments: Experiment[] = [
  {
    title: "AI Chat Assistant",
    description: "Real-time chat interface powered by Google Gemini Pro with streaming responses",
    href: "/experiments/ai-chat",
    tags: ["AI", "Gemini", "Real-time", "Streaming"],
    status: "live"
  }
];

export default function ExperimentsPage() {
  return (
    <Wrapper>
      <div className="min-h-screen py-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
          Experiments
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
          Interactive demos and creative coding projects exploring web technologies
        </p>
        
        {experiments.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500 dark:text-gray-400 mb-4">
              No experiments yet
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Check back soon for interactive demos and creative coding projects!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {experiments.map((experiment) => (
              <Link
                key={experiment.href}
                href={experiment.href}
                className="group relative block p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-2xl font-semibold group-hover:text-[#667eea] transition-colors">
                    {experiment.title}
                  </h3>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      experiment.status === "live"
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : experiment.status === "wip"
                        ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                        : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}
                  >
                    {experiment.status === "wip" ? "Work in Progress" : experiment.status}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {experiment.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {experiment.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-sm bg-white/5 border border-white/10 rounded-lg"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-r from-[#667eea]/0 to-[#764ba2]/0 group-hover:from-[#667eea]/5 group-hover:to-[#764ba2]/5 rounded-2xl transition-all duration-300 pointer-events-none" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
}