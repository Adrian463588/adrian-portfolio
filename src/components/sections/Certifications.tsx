"use client";

import { motion } from "framer-motion";
import { Award } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { certifications } from "@/data/certifications";

export function Certifications() {
  return (
    <section id="certifications" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>CERTIFICATIONS</SectionHeading>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className="group flex items-start gap-4 rounded-xl border border-cyan-500/10 bg-[rgba(10,10,20,0.7)] p-5 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[12px] transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{
                rotateY: [0, 5, 0],
                transition: { duration: 0.4 },
              }}
              style={{ perspective: 800 }}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 transition-colors group-hover:bg-cyan-500/30 group-hover:text-cyan-300">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-white">{cert.name}</h3>
                <p className="text-sm text-gray-400">{cert.issuer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
