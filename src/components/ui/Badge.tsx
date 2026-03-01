import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  colorKey?: string;
  className?: string;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-900/30 border-blue-500/30 text-blue-300",
  orange: "bg-orange-900/30 border-orange-500/30 text-orange-300",
  indigo: "bg-indigo-900/30 border-indigo-500/30 text-indigo-300",
  purple: "bg-purple-900/30 border-purple-500/30 text-purple-300",
  red: "bg-red-900/30 border-red-500/30 text-red-300",
  teal: "bg-teal-900/30 border-teal-500/30 text-teal-300",
  emerald: "bg-emerald-900/30 border-emerald-500/30 text-emerald-300",
  cyan: "bg-cyan-900/30 border-cyan-500/30 text-cyan-300",
  green: "bg-green-900/30 border-green-500/30 text-green-300",
  yellow: "bg-yellow-900/30 border-yellow-500/30 text-yellow-300",
  pink: "bg-pink-900/30 border-pink-500/30 text-pink-300",
  sky: "bg-sky-900/30 border-sky-500/30 text-sky-300",
  amber: "bg-amber-900/30 border-amber-500/30 text-amber-300",
};

export function Badge({ label, colorKey = "cyan", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "rounded border px-3 py-1 text-xs",
        colorMap[colorKey] || colorMap.cyan,
        className
      )}
    >
      {label}
    </span>
  );
}
