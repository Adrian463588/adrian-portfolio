"use client";

import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { leadership } from "@/data/leadership";

export function Leadership() {
  return (
    <section id="leadership" className="px-6 py-20">
      <div className="mx-auto max-w-5xl">
        <SectionHeading>LEADERSHIP &amp; ORGANIZATIONS</SectionHeading>

        <div className="space-y-6">
          {leadership.map((org, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-4 rounded-xl border border-cyan-500/10 bg-[rgba(10,10,20,0.7)] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[12px] transition-all duration-300 hover:border-cyan-400/30 hover:bg-white/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">
                  {org.organization}
                </h3>
                <p className="text-cyan-400">{org.role}</p>
                <p className="mb-2 text-sm text-gray-400">{org.period}</p>
                {org.bullets.length > 0 && (
                  <ul className="list-inside list-disc space-y-1 text-sm text-gray-400">
                    {org.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
