"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export type TrafficSource = {
  name: string;
  value: number;
  color: string;
};

type TrafficSourcesChartProps = {
  data: TrafficSource[];
  totalVisitors: number;
};

export default function TrafficSourcesChart({
  data,
  totalVisitors,
}: TrafficSourcesChartProps) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-bold text-slate-600 dark:text-slate-800">
        Traffic Sources
      </h2>
      <p className="mt-1 text-sm text-slate-500">Where visitors come from</p>

      <div className="relative mt-4 h-57.5">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={63}
              outerRadius={92}
              paddingAngle={3}
              stroke="none"
            >
              {data.map((source) => (
                <Cell key={source.name} fill={source.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value}%`, "Traffic"]} />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-600 dark:text-slate-800">
            {totalVisitors.toLocaleString()}
          </span>
          <span className="mt-1 text-xs text-slate-500">Total visitors</span>
        </div>
      </div>

      <div className="mt-2 space-y-3">
        {data.map((source) => (
          <div
            key={source.name}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <span className="flex items-center gap-2 text-slate-600">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: source.color }}
              />
              {source.name}
            </span>
            <span className="font-semibold text-slate-700">
              {source.value}%
            </span>
          </div>
        ))}
      </div>
    </article>
  );
}
