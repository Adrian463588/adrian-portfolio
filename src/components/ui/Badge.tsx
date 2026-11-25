import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "neutral" | "accent" | "success" | "warning";
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "border-[#27272A] bg-[#18181B] text-[#E4E4E7]",
  accent: "border-[#38BDF8]/30 bg-[#38BDF8]/10 text-[#7DD3FC]",
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-300",
};

export function Badge({ label, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 font-mono text-xs font-medium leading-5",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
