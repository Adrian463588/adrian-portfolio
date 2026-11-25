import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { EnterpriseCaseStudies } from "@/components/sections/EnterpriseCaseStudies";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Competencies } from "@/components/sections/Competencies";
import { Certifications } from "@/components/sections/Certifications";
import { Education } from "@/components/sections/Education";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Experience />
      <EnterpriseCaseStudies />
      <SelectedWork />
      <Competencies />
      <Certifications />
      <Education />
      <About />
      <Contact />
    </>
  );
}
