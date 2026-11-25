import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Experience } from "@/components/sections/Experience";
import { EnterpriseCaseStudies } from "@/components/sections/EnterpriseCaseStudies";
import { Competencies } from "@/components/sections/Competencies";
import { Certifications } from "@/components/sections/Certifications";
import { Education } from "@/components/sections/Education";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Experience />
      <EnterpriseCaseStudies />
      <Competencies />
      <Certifications />
      <Education />
      <About />
      <Contact />
    </>
  );
}
