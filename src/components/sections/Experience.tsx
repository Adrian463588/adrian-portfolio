"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { TimelineItem } from "@/components/ui/TimelineItem";
import { experiences } from "@/data/experience";

export function Experience() {
  const professional = experiences.filter((e) => e.category === "professional");
  const bootcamps = experiences.filter(
    (e) => e.category === "bootcamp" || e.category === "training"
  );

  return (
    <section id="experience" className="relative px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>PROFESSIONAL EXPERIENCE</SectionHeading>

        <div className="relative pl-8 md:pl-0">
          {/* Vertical timeline line */}
          <div className="absolute left-8 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 md:left-1/2 md:block" />

          {professional.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TimelineItem entry={entry} index={index} />
            </motion.div>
          ))}
        </div>

        {/* Bootcamps & Training */}
        <div className="mt-20">
          <SectionHeading>BOOTCAMPS &amp; TRAINING</SectionHeading>
        </div>

        <div className="relative pl-8 md:pl-0">
          <div className="absolute left-8 top-0 bottom-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-cyan-500/0 via-cyan-500/50 to-cyan-500/0 md:left-1/2 md:block" />

          {bootcamps.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TimelineItem entry={entry} index={index} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
