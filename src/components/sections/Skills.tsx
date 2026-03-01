"use client";

import { motion } from "framer-motion";
import {
  Server,
  Container,
  Smartphone,
  ShieldCheck,
  Lock,
  Globe,
  BarChart2,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { skills } from "@/data/skills";

const iconMap: Record<string, React.ReactNode> = {
  Server: <Server className="h-6 w-6" />,
  Container: <Container className="h-6 w-6" />,
  Smartphone: <Smartphone className="h-6 w-6" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6" />,
  Lock: <Lock className="h-6 w-6" />,
  Globe: <Globe className="h-6 w-6" />,
  BarChart2: <BarChart2 className="h-6 w-6" />,
};

const iconBgMap: Record<string, string> = {
  blue: "bg-blue-500/20 text-blue-400",
  orange: "bg-orange-500/20 text-orange-400",
  indigo: "bg-indigo-500/20 text-indigo-400",
  purple: "bg-purple-500/20 text-purple-400",
  red: "bg-red-500/20 text-red-400",
  teal: "bg-teal-500/20 text-teal-400",
  emerald: "bg-emerald-500/20 text-emerald-400",
};

export function Skills() {
  return (
    <section id="skills" className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading>TECH ARSENAL</SectionHeading>

        <div className="flex flex-wrap justify-center gap-8">
          {skills.map((category, index) => (
            <motion.div
              key={index}
              className="w-full rounded-2xl border border-cyan-500/10 bg-[rgba(10,10,20,0.7)] p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[12px] transition-all duration-300 hover:bg-white/5 md:w-[calc(33.33%-1.5rem)]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div
                className={`mb-6 flex h-12 w-12 items-center justify-center rounded-lg ${
                  iconBgMap[category.colorKey] || iconBgMap.blue
                }`}
              >
                {iconMap[category.icon]}
              </div>
              <h3
                className="mb-4 text-xl font-bold"
                style={{ fontFamily: "var(--font-orbitron)" }}
              >
                {category.title}
              </h3>
              <motion.div
                className="flex flex-wrap gap-2"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.04 } },
                }}
              >
                {category.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, scale: 0.8 },
                      visible: { opacity: 1, scale: 1 },
                    }}
                  >
                    <Badge label={skill} colorKey={category.colorKey} />
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
