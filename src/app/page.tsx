import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Experience } from "@/components/sections/Experience";
import { Competencies } from "@/components/sections/Competencies";
import { Certifications } from "@/components/sections/Certifications";
import { Education } from "@/components/sections/Education";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

const SITE_URL = "https://adriansyahabidin.vercel.app";

const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Adrian Syah Abidin Portfolio",
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Adrian Syah Abidin",
      url: `${SITE_URL}/`,
      email: "mailto:adriansyah1230@gmail.com",
      jobTitle: "Software & QA Automation Engineer",
      description:
        "Software engineer with experience in enterprise software testing, Cypress automation, Jenkins CI integration, DevOps, and applied AI projects.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Yogyakarta",
        addressCountry: "ID",
      },
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "Universitas Gadjah Mada",
      },
      sameAs: [
        "https://github.com/Adrian463588",
        "https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/",
        "https://medium.com/@adriansyah1230",
      ],
      knowsAbout: [
        "Software Engineering",
        "Software Testing",
        "QA Automation",
        "Cypress",
        "Playwright",
        "Jenkins CI",
        "DevOps",
        "Android Development",
        "Applied AI",
      ],
    },
    {
      "@type": "ProfilePage",
      "@id": `${SITE_URL}/#profilepage`,
      url: `${SITE_URL}/`,
      name: "Adrian Syah Abidin | Software & QA Automation Engineer",
      dateModified: "2026-11-25",
      mainEntity: {
        "@id": `${SITE_URL}/#person`,
      },
    },
  ],
};

export default function Home() {
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
