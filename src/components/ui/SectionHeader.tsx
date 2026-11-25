import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col justify-between gap-6 border-b border-white/10 pb-7 sm:flex-row sm:items-end",
        className
      )}
    >
      <div className="max-w-2xl space-y-2.5">
        <p className="font-mono text-xs tracking-[0.16em] text-[#00C8F5] uppercase">
          {eyebrow}
        </p>
        <h2 className="font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-[#F1F3F5]">
          {title}
        </h2>
        {description && (
          <p className="max-w-xl text-sm leading-relaxed text-[#A0A6B0] sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
