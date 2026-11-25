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
        "mb-10 flex flex-col justify-between gap-4 border-b border-[#27272A] pb-6 sm:flex-row sm:items-end",
        className
      )}
    >
      <div className="max-w-2xl space-y-2">
        <p className="font-mono text-xs font-medium uppercase tracking-wider text-[#38BDF8]">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-semibold tracking-tight text-[#F4F4F5] sm:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-relaxed text-[#A1A1AA] sm:text-base">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
