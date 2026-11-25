import { cn } from "@/lib/utils";

interface RollTextProps {
  children: string;
  className?: string;
}

/** Dual-layer kinetic hover roll inspired by minimalist creative portfolios. */
export function RollText({ children, className }: RollTextProps) {
  return (
    <span className={cn("roll-text relative inline-block overflow-hidden align-top", className)}>
      <span className="roll-text-primary block transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]">
        {children}
      </span>
      <span
        aria-hidden="true"
        className="roll-text-clone pointer-events-none absolute inset-0 block translate-y-full text-[#65C8F5] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
      >
        {children}
      </span>
    </span>
  );
}
