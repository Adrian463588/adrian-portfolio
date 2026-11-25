import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "neutral" | "accent" | "success" | "warning";
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  neutral: "border-white/15 bg-[#15171C]/90 text-[#F2F0EC]",
  accent: "border-[#65C8F5]/40 bg-[#65C8F5]/12 text-[#65C8F5]",
  success: "border-emerald-500/35 bg-emerald-500/10 text-emerald-300",
  warning: "border-amber-500/35 bg-amber-500/10 text-amber-300",
};

export function Badge({ label, variant = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium leading-5",
        variantStyles[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
