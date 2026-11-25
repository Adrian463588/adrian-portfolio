import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#27272A] bg-[#09090B] px-6 py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-6 text-sm text-[#A1A1AA] sm:flex-row sm:items-center">
        <div className="space-y-1">
          <p className="font-medium text-[#F4F4F5]">
            &copy; {year} Adrian Syah Abidin
          </p>
          <p className="font-mono text-xs text-[#A1A1AA]">
            Yogyakarta, Indonesia · Static Frontend Portfolio
          </p>
        </div>

        <nav aria-label="Footer links" className="flex flex-wrap items-center gap-5 text-sm">
          <Link href="/projects/" prefetch={false} className="transition-colors hover:text-[#38BDF8]">
            Project Explorer
          </Link>
          <a
            href="https://github.com/Adrian463588"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#38BDF8]"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/adrian-syah-abidin-0416b81b9/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[#38BDF8]"
          >
            LinkedIn
          </a>
          <a
            href="mailto:adriansyah1230@gmail.com"
            className="transition-colors hover:text-[#38BDF8]"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
