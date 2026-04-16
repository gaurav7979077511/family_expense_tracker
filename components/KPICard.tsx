interface KPICardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  trend?: "positive" | "negative" | "neutral";
  subtitle?: string;
  highlight?: boolean;
}

export default function KPICard({
  label,
  value,
  icon,
  trend = "neutral",
  subtitle,
  highlight = false,
}: KPICardProps) {
  const trendColors = {
    positive: "text-emerald-400",
    negative: "text-red-400",
    neutral: "text-indigo-400",
  };

  return (
    <div
      className={`relative rounded-2xl p-5 border transition-all duration-200 hover:scale-[1.01] ${
        highlight
          ? "bg-indigo-500/10 border-indigo-500/25 glow-indigo"
          : "glass border-white/[0.06] hover:border-white/10"
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/08 flex items-center justify-center text-gray-400">
          {icon}
        </div>
        {trend !== "neutral" && (
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
              trend === "positive"
                ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                : "text-red-400 bg-red-400/10 border-red-400/20"
            }`}
          >
            {trend === "positive" ? "▲" : "▼"}
          </span>
        )}
      </div>
      <div className={`text-2xl font-bold font-mono-jet mb-1 ${trendColors[trend]}`}>
        {value}
      </div>
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</div>
      {subtitle && <div className="text-xs text-gray-600 mt-1">{subtitle}</div>}
    </div>
  );
}
