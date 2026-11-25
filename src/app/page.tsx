import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Experience } from "@/components/sections/Experience";
import { Competencies } from "@/components/sections/Competencies";
import { Certifications } from "@/components/sections/Certifications";
import { Education } from "@/components/sections/Education";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { projects } from "@/data/projects";
import { certifications } from "@/data/certifications";
import { buildHomeJsonLd, canonicalPath } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: canonicalPath("/"),
  },
};

export default function Home() {
  const homeJsonLd = buildHomeJsonLd(projects, certifications);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd) }}
      />
      <Hero />
      <SelectedWork />
      <Experience />
      <Competencies />
      <Certifications />
      <Education />
      <About />
      <Contact />
    </>
  );
}
