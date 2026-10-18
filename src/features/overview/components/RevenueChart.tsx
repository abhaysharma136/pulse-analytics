"use client";

import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartPoint = {
  day: string;
  revenue: number;
  users: number;
};

type RevenueChartProps = {
  data: ChartPoint[];
};

export default function RevenueChart({ data }: RevenueChartProps) {
  const [metric, setMetric] = useState<"revenue" | "users">("revenue");

  const secondaryMetric = metric === "revenue" ? "users" : "revenue";

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-600 dark:text-slate-800">
            Revenue &amp; Users
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Business performance over time
          </p>
        </div>

        <div className="flex rounded-lg bg-slate-100 p-1">
          {(["revenue", "users"] as const).map((item) => (
            <button
              key={item}
              onClick={() => setMetric(item)}
              aria-pressed={metric === item}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition ${
                metric === item
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="h-70 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 5, right: 5, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fontSize: 11, fill: "#64748b" }}
            />
            <Tooltip
              formatter={(value, name) => [
                metric === "revenue"
                  ? `$${Number(value).toLocaleString()}`
                  : Number(value).toLocaleString(),
                name === "revenue" ? "Revenue" : "Users",
              ]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid #e2e8f0",
              }}
            />
            <Bar
              dataKey={metric}
              fill="#818cf8"
              radius={[5, 5, 0, 0]}
              maxBarSize={32}
            />
            <Line
              dataKey={secondaryMetric}
              type="monotone"
              stroke="#4338ca"
              strokeWidth={2.5}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex flex-wrap justify-center gap-5 text-xs text-slate-500">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-sm bg-indigo-400" />
          {metric === "revenue" ? "Revenue" : "Users"}
        </span>
        <span className="flex items-center gap-2">
          <span className="h-0.5 w-4 bg-indigo-800" />
          {metric === "revenue" ? "Users" : "Revenue"}
        </span>
      </div>
    </article>
  );
}
