import Link from "next/link";
import { RollText } from "@/components/motion/RollText";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#08090B]/85 px-6 py-10 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1280px] flex-col items-start justify-between gap-6 text-sm text-[#A0A6B0] sm:flex-row sm:items-center">
        <div className="space-y-1">
          <p className="font-display font-semibold tracking-tight text-[#F1F3F5]">
            &copy; {year} Adrian Syah Abidin
          </p>
          <p className="font-mono text-xs text-[#A0A6B0]">
            Yogyakarta, Indonesia · Static Frontend Architecture
          </p>
        </div>

        <nav aria-label="Footer links" className="flex flex-wrap items-center gap-6 text-sm">
          <Link href="/projects/" prefetch={false} className="group transition-colors">
            <RollText>Projects</RollText>
          </Link>
          <a
            href="https://github.com/Adrian463588"
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-colors"
          >
            <RollText>GitHub</RollText>
          </a>
          <a
            href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="group transition-colors"
          >
            <RollText>LinkedIn</RollText>
          </a>
          <a href="mailto:adriansyah1230@gmail.com" className="group transition-colors">
            <RollText>Email</RollText>
          </a>
        </nav>
      </div>
    </footer>
  );
}
