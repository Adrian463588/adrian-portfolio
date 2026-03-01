import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  hoverBorderColor?: string;
}

export function GlassCard({
  children,
  className,
  borderColor = "border-cyan-500/10",
  hoverBorderColor = "hover:border-cyan-400",
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-[rgba(10,10,20,0.7)] p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] backdrop-blur-[12px]",
        borderColor,
        hoverBorderColor,
        "transition-all duration-300",
        className
      )}
    >
      {children}
    </div>
  );
}
