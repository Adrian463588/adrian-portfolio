"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { education } from "@/data/education";

export function Education() {
  return (
    <section id="education" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>EDUCATION</SectionHeading>

        <div className="grid gap-6 md:grid-cols-2">
          {education.map((edu, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 rounded-xl border border-cyan-500/10 bg-[rgba(10,10,20,0.7)] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[12px] transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                <GraduationCap className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {edu.institution}
                </h3>
                <p className="text-gray-300">{edu.degree}</p>
                <p className="text-sm text-gray-400">{edu.period}</p>
                {edu.location && (
                  <p className="text-sm text-gray-500">{edu.location}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
