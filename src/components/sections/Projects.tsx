"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { TiltCard } from "@/components/ui/TiltCard";
import { projects } from "@/data/projects";

export function Projects() {
  return (
    <section id="projects" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>PROJECTS</SectionHeading>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <TiltCard className="h-full rounded-2xl border border-cyan-500/10 bg-[rgba(10,10,20,0.7)] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[12px] transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/5">
                <h3
                  className="mb-1 text-xl font-bold"
                  style={{ fontFamily: "var(--font-orbitron)" }}
                >
                  {project.title}
                </h3>
                <p className="mb-4 text-sm text-cyan-400">
                  {project.subtitle}
                </p>

                <div className="mb-3 space-y-2 text-sm text-gray-400">
                  <p>
                    <span className="font-semibold text-gray-300">
                      Problem:{" "}
                    </span>
                    {project.problem}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">
                      Solution:{" "}
                    </span>
                    {project.solution}
                  </p>
                  <p>
                    <span className="font-semibold text-gray-300">
                      Role:{" "}
                    </span>
                    {project.role}
                  </p>
                </div>

                {/* Badge stagger reveal (B12) */}
                <motion.div
                  className="mb-4 flex flex-wrap gap-2"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.05 } },
                  }}
                >
                  {project.stack.map((tech) => (
                    <motion.span
                      key={tech}
                      variants={{
                        hidden: { opacity: 0, scale: 0.8 },
                        visible: { opacity: 1, scale: 1 },
                      }}
                    >
                      <Badge label={tech} colorKey="cyan" />
                    </motion.span>
                  ))}
                </motion.div>

                <div className="flex gap-3">
                  {project.repoUrl && (
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-cyan-400"
                    >
                      <Github className="h-4 w-4" />
                      Source
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-cyan-400"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
