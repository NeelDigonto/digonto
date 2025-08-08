"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import {
  FiCopy,
  FiCheck,
  FiDatabase,
  FiCpu,
  FiAlertTriangle,
} from "react-icons/fi";
import { BlogPostMeta } from "../../../../types/core";
import SelectionHighlight from "../../../components/SelectionHighlight";
import "../../../styles/blog-painterly.css";
import { codeExamples } from "./code";

// export const meta: BlogPostMeta = {
//   title: "The Incident That Taught Me Data Pipeline Segregation",
//   excerpt:
//     "How a critical production incident during a 5000-participant webinar revealed the importance of separating database connection pools for different query priorities.",
//   slug: "the-incident-that-taught-me-data-pipeline-segregation",
//   date: "2025-08-01",
//   readTime: "10 min read",
//   tags: ["Backend", "Database", "Performance", "Production"],
// };

export default function DataPipelineSegregationIncident() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="painterly-blog min-h-screen painterly-bg">
      <SelectionHighlight />

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-32 painterly-content">
        {/* Hero Section */}
        <h1 className="painterly-h1 mb-8">
          The Incident That Taught Me{" "}
          <span className="painterly-gradient">Data Pipeline Segregation</span>
        </h1>
        <div className="painterly-meta flex items-center gap-4 mb-16">
          <span>August 1, 2025</span>
          <span>•</span>
          <span>10 min read</span>
          <span>•</span>
          <span className="painterly-gradient">Production Incidents</span>
        </div>
        {/* The Incident */}
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16 painterly-animate"
        >
          <p className="text-xl leading-relaxed">
            It was a usual Sunday afternoon, things were chill and suddenly I
            hear the familiar Slack notification. It was my manager tagging me
            on a live-support incident.
          </p>
        </motion.section>

        {/* Alert Message */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-16 painterly-animate"
        >
          <div className="relative rounded-lg overflow-hidden border border-white/10">
            <Image
              src="/session-incident-slack-dark-blurred.png"
              alt="Slack notification showing the production incident alert"
              width={800}
              height={400}
              className="w-full h-auto"
            />
          </div>
          <p className="mt-4 opacity-90">
            I saw the message and immediately knew it was trouble. We were
            hosting a 5000 participant webinar, which I could already assume
            went far from ideal.
          </p>
        </motion.div>

        {/* Alerts Section */}
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="painterly-h2 flex items-center gap-3 mb-8">
            <FiAlertTriangle className="painterly-gradient" />
            The Alerts Storm
          </h2>

          {/* Redis Monitoring */}
          <div className="mb-8 -mx-6 md:-mx-12 lg:-mx-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-6 md:px-12 lg:px-24">
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                <Image
                  src="/session-indicent-redis-1.png"
                  alt="Redis monitoring showing connection metrics during the incident"
                  width={800}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                <Image
                  src="/session-indicent-redis-2.png"
                  alt="Redis monitoring showing latency spikes during the incident"
                  width={800}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <p className="mt-4 opacity-90 text-center px-6 md:px-12 lg:px-24">
              Our Redis metrics were showing unusual patterns - memory usage and
              latency were spiking exponentially, a clear sign that something
              was wrong with our data pipeline.
            </p>
          </div>

          {/* Backend Performance Metrics */}
          <div className="-mx-6 md:-mx-12 lg:-mx-24">
            <div className="space-y-4 px-6 md:px-12 lg:px-24">
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                <Image
                  src="/backend-latency.png"
                  alt="Backend latency metrics showing increased response times"
                  width={800}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
              <div className="relative rounded-lg overflow-hidden border border-white/10">
                <Image
                  src="/gateway-timeouts.png"
                  alt="Gateway timeout errors during the incident"
                  width={800}
                  height={400}
                  className="w-full h-auto"
                />
              </div>
            </div>
            <p className="mt-4 opacity-90 text-center px-6 md:px-12 lg:px-24">
              Backend latency was climbing exponentially while gateway timeouts
              started flooding our error logs - the cascading failure was in
              full effect.
            </p>
          </div>
        </motion.section>

        {/* The Investigation */}
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="painterly-h2 flex items-center gap-3">
            <FiDatabase className="painterly-gradient" />
            The Investigation Begins
          </h2>
          <div className="space-y-4">
            <p>
              We were a WebRTC / video conferencing SaaS, the session
              microservice is the source of truth for realtime meetings /
              sessions and their analytics data.
            </p>
            <p>
              Sessions is a critical micro-service, relied upon by recording
              microservice, AI-related workers like live-transcription, and
              more. A failure here means critical business impact, and being the
              maintainer of the sessions microservice, I felt the gravity of it
              and quickly got to work.
            </p>
            <p>
              I looked around Slack and found recent threads started by the SRE
              team regarding heavy lock usage on AWS RDS. The on-call engineer
              was getting paged about the service degradation.
            </p>
            <div className="my-8 relative rounded-lg overflow-hidden border border-white/10">
              <Image
                src="/session-incident-rds.png"
                alt="AWS RDS CPU usage graph showing high utilization"
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <p>
              So, the initial presumption was PostgreSQL got choked and all
              queries were hung. I started to simulate using a local script
              calling preprod nodes on Kubernetes - everything went fine.
              Bombarded the pods with millions of queries, slow but all went
              fine.
            </p>
          </div>
        </motion.section>

        {/* The Discovery */}
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="painterly-h2 mb-8">The Breakthrough</h2>

          <p className="mb-8 text-lg">
            We tried one more time, stress testing our preprod nodes, plus
            invoking a few queries by-hand to our preprod k8s pod connected to
            the same DB. Bang, the queries got stuck now.
          </p>

          <p className="mb-8 text-lg opacity-90">
            We started eliminating possibilities systematically, testing each
            possibility in isolation:
          </p>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-4 p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <span className="text-2xl">✅</span>
              <div>
                <span className="font-semibold text-green-400">
                  Pod Health Check:
                </span>
                <span className="ml-2 opacity-90">
                  Pods were responding normally, no hangs, &lt;5% CPU
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <span className="text-2xl">✅</span>
              <div>
                <span className="font-semibold text-green-400">
                  Database Status:
                </span>
                <span className="ml-2 opacity-90">
                  PostgreSQL was under load but still operational
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <span className="text-2xl">✅</span>
              <div>
                <span className="font-semibold text-green-400">
                  Sync Queries:
                </span>
                <span className="ml-2 opacity-90">
                  Sync queries executed successfully when run in each batch
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg border border-green-500/20 bg-green-500/5">
              <span className="text-2xl">✅</span>
              <div>
                <span className="font-semibold text-green-400">
                  Database Queries:
                </span>
                <span className="ml-2 opacity-90">
                  Direct database queries through PGAdmin resolved fine
                </span>
              </div>
            </div>
          </div>

          <p className="text-xl font-semibold painterly-gradient mb-8">
            We were like, wtf was wrong then?
          </p>

          <div className="painterly-info painterly-animate">
            <h3 className="painterly-h3 painterly-gradient mb-4">
              The Root Cause: ORM Pool Saturation
            </h3>
            <p className="mb-6">
              A realization dawned upon us: the DB was not the problem, it was
              the data pipeline, especifically the ORM pool had saturated. The
              important{" "}
              <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">
                createSession()
              </code>{" "}
              &{" "}
              <code className="text-cyan-400 bg-cyan-400/10 px-1.5 py-0.5 rounded">
                getActiveSession()
              </code>{" "}
              queries were waiting behind numerous DB update queries.
            </p>
            <p className="mb-6">
              To understand why it&apos;s an issue, we need to understand that
              session broadly processes 3 types of events:
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex gap-3">
                <span className="text-cyan-400 font-bold">1.</span>
                <div>
                  <span className="font-semibold text-cyan-400">
                    Primary Events:
                  </span>
                  <span className="ml-2 opacity-90">
                    Consumes 100s of PeerJoin / PeerLeave events from socket
                    services, and aggregates usage, tracks users, reports
                    analytics etc.
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-yellow-400 font-bold">2.</span>
                <div>
                  <span className="font-semibold text-yellow-400">
                    Critical Events:
                  </span>
                  <span className="ml-2 opacity-90">
                    Creates sessions, serves a few but critical read session to
                    other microservices and reports whether the session is live
                    or ended, etc.
                  </span>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-green-400 font-bold">3.</span>
                <div>
                  <span className="font-semibold text-green-400">
                    Analytics Reading:
                  </span>
                  <span className="ml-2 opacity-90">
                    Serves Website graph queries, billing related and analytics
                    related queries from RDS Reader instances.
                  </span>
                </div>
              </div>
            </div>
            <p className="mb-6">
              <span className="font-semibold text-cyan-400">
                Primary events
              </span>{" "}
              are written to the RDS writer instance, and
              <span className="font-semibold text-yellow-400">
                {" "}
                Critical events
              </span>{" "}
              also need to be served from the writer to avoid potential
              replication lag under load. This means both event types were
              competing for the same limited connection pool.
            </p>
            <p className="mb-6">
              But the{" "}
              <span className="font-semibold text-cyan-400">
                primary events
              </span>{" "}
              being high volume, they were saturating the pool, causing{" "}
              <span className="font-semibold text-yellow-400">
                critical events
              </span>{" "}
              to wait for connections.
            </p>
            <div className="painterly-code">
              <div className="opacity-60 mb-3"># The Math:</div>
              <div className="painterly-gradient">
                RabbitMQ prefetch: 40 messages
              </div>
              <div className="text-yellow-300">
                ORM pool size: 10 connections
              </div>
              <div className="text-orange-300">
                Query time under load: ~200ms
              </div>
              <div className="text-red-300 mt-3 font-bold">
                Wait time for Critical Events = 40 queries × 200ms = 8 seconds!
                😱
              </div>
            </div>
          </div>

          {/* Before Architecture Diagram */}
          <div className="mt-12 -mx-6 md:-mx-12 lg:-mx-32 xl:-mx-48">
            <h3 className="painterly-h3 mb-4 text-center">
              Current Architecture: Single Connection Pool
            </h3>
            <div className="relative rounded-lg overflow-hidden border border-white/10">
              <Image
                src="/before-arch.png"
                alt="Architecture before changes - single connection pool causing bottleneck"
                width={1200}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>
        </motion.section>

        {/* The Solution */}
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="painterly-h2">
            The Solution: Segregated Connection Pools
          </h2>
          <p className="mb-10">
            We realized that our important queries needed a different ORM pool
            which could give them congestion-free access to the database and be
            prioritized, especially so when the DB itself is under load and
            query latency is higher.
          </p>

          {/* After Architecture Diagram */}
          <div className="mb-12 -mx-6 md:-mx-12 lg:-mx-32 xl:-mx-48">
            <h3 className="painterly-h3 mb-4 text-center">
              Solution: Segregated Connection Pools
            </h3>
            <div className="relative rounded-lg overflow-hidden border border-white/10">
              <Image
                src="/after-arch.png"
                alt="Architecture after changes - segregated pools for different query priorities"
                width={1200}
                height={600}
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* <div className="painterly-code mb-10 painterly-animate">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-60">TypeScript - Before</span>
              <button
                onClick={() =>
                  copyCode(codeExamples.ormPoolConfig, "ormPoolConfig")
                }
                className="painterly-button text-sm"
              >
                {copiedCode === "ormPoolConfig" ? <FiCheck /> : <FiCopy />}
                {copiedCode === "ormPoolConfig" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code>{codeExamples.ormPoolConfig}</code>
            </pre>
          </div>

          <div className="painterly-code painterly-animate">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-60">TypeScript - After</span>
              <button
                onClick={() =>
                  copyCode(codeExamples.segregatedPools, "segregatedPools")
                }
                className="painterly-button text-sm"
              >
                {copiedCode === "segregatedPools" ? <FiCheck /> : <FiCopy />}
                {copiedCode === "segregatedPools" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code>{codeExamples.segregatedPools}</code>
            </pre>
          </div> */}

          <div
            className="mt-10 painterly-card painterly-animate"
            style={{
              background:
                "linear-gradient(135deg, rgba(34, 197, 94, 0.05) 0%, rgba(34, 197, 94, 0.1) 100%)",
              borderColor: "rgba(34, 197, 94, 0.2)",
            }}
          >
            <h3 className="painterly-h3 mb-3" style={{ color: "#86efac" }}>
              Immediate Results
            </h3>
            <p>
              We instantly saw the critical query read time dropping from
              <span className="font-bold" style={{ color: "#f87171" }}>
                {" "}
                &gt;5 seconds
              </span>{" "}
              to
              <span className="painterly-gradient font-bold"> &lt;50ms</span>!
            </p>
          </div>
        </motion.section>

        {/* Additional Optimizations */}
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="painterly-h2">Aggressive Performance Tuning</h2>
          <p className="mb-10">
            Not only this, but we aggressively tuned sessions-ms that day:
          </p>

          <div className="space-y-6 mb-10">
            <div className="flex gap-4 p-4 rounded-lg border-l-4 border-cyan-500/50 bg-cyan-500/5">
              <span className="text-cyan-400 font-bold text-xl">1.</span>
              <p className="text-lg">
                Made sure our joins were using proper index, fixed 2 queries
                joining{" "}
                <span className="font-bold text-orange-400">20mil+ rows</span>{" "}
                without an index, and instantly made overall queries{" "}
                <span className="painterly-gradient font-bold text-xl">
                  5x faster
                </span>
                .
              </p>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border-l-4 border-yellow-500/50 bg-yellow-500/5">
              <span className="text-yellow-400 font-bold text-xl">2.</span>
              <p className="text-lg">
                Added{" "}
                <span className="font-semibold text-yellow-300">
                  multi-column index
                </span>{" "}
                on a hot path, where postgres refused to use the single-column
                indexes.
              </p>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border-l-4 border-green-500/50 bg-green-500/5">
              <span className="text-green-400 font-bold text-xl">3.</span>
              <p className="text-lg">
                Moved most of the frequent update operations to{" "}
                <span className="font-semibold text-green-300">Redis</span>,
                drastically reducing DB locks.
              </p>
            </div>

            <div className="flex gap-4 p-4 rounded-lg border-l-4 border-purple-500/50 bg-purple-500/5">
              <span className="text-purple-400 font-bold text-xl">4.</span>
              <p className="text-lg">
                Increased ORM pool size from{" "}
                <span className="font-bold text-red-400 text-xl">10</span> to{" "}
                <span className="font-bold text-green-400 text-xl">40</span> per
                pod: we arrived at this value by stress testing at what
                concurrency do we reach{" "}
                <span className="font-semibold text-purple-300">
                  ~50% CPU usage
                </span>
                .
              </p>
            </div>
          </div>

          {/* <div className="painterly-code painterly-animate">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm opacity-60">
                TypeScript - Performance Optimizations
              </span>
              <button
                onClick={() =>
                  copyCode(codeExamples.performanceTuning, "performanceTuning")
                }
                className="painterly-button text-sm"
              >
                {copiedCode === "performanceTuning" ? <FiCheck /> : <FiCopy />}
                {copiedCode === "performanceTuning" ? "Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code>{codeExamples.performanceTuning}</code>
            </pre>
          </div> */}
        </motion.section>

        {/* Lessons Learned */}
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="text-3xl font-bold text-white mb-8">Key Takeaways</h2>

          <div className="space-y-5">
            <div className="pl-6 border-l-3 border-cyan-500/50 relative">
              <span className="absolute -left-3 top-0 bg-cyan-500/20 text-cyan-400 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
                1
              </span>
              <h3 className="font-bold text-lg mb-2 text-cyan-400">
                Not All Queries Are Equal
              </h3>
              <p className="text-white/80">
                Critical internal queries should never wait behind batch
                processing or analytics workloads. Segregate your connection
                pools based on query priority and latency requirements.
              </p>
            </div>

            <div className="pl-6 border-l-3 border-yellow-500/50 relative">
              <span className="absolute -left-3 top-0 bg-yellow-500/20 text-yellow-400 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
                2
              </span>
              <h3 className="font-bold text-lg mb-2 text-yellow-400">
                The Database Might Not Be the Bottleneck
              </h3>
              <p className="text-white/80">
                Sometimes the issue isn&apos;t database performance but how your
                application accesses it. Connection pool exhaustion can make a
                healthy database appear overloaded.
              </p>
            </div>

            <div className="pl-6 border-l-3 border-green-500/50 relative">
              <span className="absolute -left-3 top-0 bg-green-500/20 text-green-400 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
                3
              </span>
              <h3 className="font-bold text-lg mb-2 text-green-400">
                Load Testing ≠ Production Reality
              </h3>
              <p className="text-white/80">
                Our load tests didn&apos;t catch this because they focused on
                throughput, not the interaction between different query types
                competing for the same resources.
              </p>
            </div>

            <div className="pl-6 border-l-3 border-purple-500/50 relative">
              <span className="absolute -left-3 top-0 bg-purple-500/20 text-purple-400 font-bold rounded-full w-6 h-6 flex items-center justify-center text-sm">
                4
              </span>
              <h3 className="font-bold text-lg mb-2 text-purple-400">
                Monitor Pool Metrics
              </h3>
              <p className="text-white/80">
                Connection pool wait times, active connections, and queue depth
                are critical metrics that should be monitored and alerted on.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Results */}
        <motion.section
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div
            className="painterly-card p-10 text-center painterly-animate"
            style={{
              background:
                "linear-gradient(135deg, rgba(91, 141, 238, 0.1) 0%, rgba(155, 135, 245, 0.1) 100%)",
            }}
          >
            <h2 className="painterly-h2 mb-6">One Year Later</h2>
            <p className="mb-8 max-w-2xl mx-auto">
              It&apos;s been over a year now, and we&apos;ve hardly ever faced
              sessions-ms performance degradation, even though our platform
              usage grew 100% each quarter. The incident that initially seemed
              like a disaster became a valuable learning experience that made
              our system more resilient.
            </p>
            <div className="flex justify-center gap-8 text-center">
              <div>
                <div className="text-3xl font-bold painterly-gradient">
                  100%
                </div>
                <div className="painterly-meta">Quarterly Growth</div>
              </div>
              <div>
                <div className="text-3xl font-bold painterly-gradient">
                  &lt;1ms
                </div>
                <div className="painterly-meta">P99 Latency</div>
              </div>
              <div>
                <div className="text-3xl font-bold painterly-gradient">
                  Zero
                </div>
                <div className="painterly-meta">Pool Timeouts</div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
