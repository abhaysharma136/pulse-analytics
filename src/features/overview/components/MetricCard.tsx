import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ShoppingCart,
  Users,
} from "lucide-react";

import type { Metric, MetricIconName } from "@/types/analytics";

const metricIcons = {
  activity: Activity,
  users: Users,
  "shopping-cart": ShoppingCart,
  "bar-chart": BarChart3,
} satisfies Record<MetricIconName, typeof Activity>;

const iconColors = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
};

export default function MetricCard({
  title,
  value,
  change,
  positive,
  comparison,
  icon,
  color,
}: Metric) {
  const Icon = metricIcons[icon];

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div className={`rounded-xl p-3 ${iconColors[color]}`}>
          <Icon size={22} aria-hidden="true" />
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-semibold ${
            positive ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {positive ? (
            <ArrowUpRight size={16} aria-hidden="true" />
          ) : (
            <ArrowDownRight size={16} aria-hidden="true" />
          )}
          {change}
        </span>
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>
      <p className="mt-1 text-2xl font-bold tracking-tight text-slate-500 dark:text-slate-400">
        {value}
      </p>
      <p className="mt-2 text-xs text-slate-400">{comparison}</p>
    </article>
  );
}
