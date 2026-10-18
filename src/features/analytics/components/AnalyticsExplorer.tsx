"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Download,
  Users,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartPoint, TrafficSource } from "@/types/analytics";

import VirtualizedTransactionsTable from "@/features/transactions/components/VirtualizedTransactionsTable";
type DateRange = "7" | "30" | "90";

type AnalyticsExplorerProps = {
  chartData: ChartPoint[];
  trafficData: TrafficSource[];
  totalVisitors: number;
  period: DateRange;
  onPeriodChange: (period: DateRange) => void;
};

export default function AnalyticsExplorer({
  chartData,
  trafficData,
  totalVisitors,
  period,
  onPeriodChange,
}: AnalyticsExplorerProps) {
  const [metric, setMetric] = useState<"revenue" | "users">("revenue");

  const filteredData = useMemo(
    () => chartData.slice(-Number(period)),
    [chartData, period],
  );

  const totalRevenue = filteredData.reduce(
    (total, point) => total + point.revenue,
    0,
  );

  const totalUsers = filteredData.reduce(
    (total, point) => total + point.users,
    0,
  );

  const averageRevenue =
    filteredData.length > 0 ? totalRevenue / filteredData.length : 0;

  function exportCsv() {
    const headers = ["Day", "Revenue", "Users"];

    const rows = filteredData.map((point) => [
      point.day,
      point.revenue,
      point.users,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `pulse-analytics-${period}-period.csv`;
    link.click();

    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      {/* Page controls */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-bold text-slate-600 dark:text-slate-800">
            Performance report
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Explore revenue and user activity over time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm">
            <CalendarDays size={16} className="text-slate-500" />
            <span className="sr-only">Reporting period</span>
            <select
              value={period}
              onChange={(event) =>
                onPeriodChange(event.target.value as DateRange)
              }
              className="bg-transparent outline-none text-slate-600 dark:text-slate-800"
              aria-label="Reporting period"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </label>

          <button
            type="button"
            onClick={exportCsv}
            disabled={filteredData.length === 0}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={16} />
            Export CSV
          </button>
        </div>
      </section>

      {/* Summary metrics */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric
          label="Total revenue"
          value={`$${totalRevenue.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}`}
          icon={<DollarSign size={19} />}
        />
        <Metric
          label="Total users"
          value={totalUsers.toLocaleString("en-US")}
          icon={<Users size={19} />}
        />
        <Metric
          label="Average revenue per point"
          value={`$${averageRevenue.toLocaleString("en-US", {
            maximumFractionDigits: 2,
          })}`}
          icon={<TrendingUp size={19} />}
        />
        <Metric
          label="Total visitors"
          value={totalVisitors.toLocaleString("en-US")}
          icon={<Activity size={19} />}
        />
      </section>

      {/* Trend chart */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div className="text-slate-500 dark:text-slate-700">
            <h2 className="font-bold text-slate-600 dark:text-slate-800">
              Performance trends
            </h2>
            {metric === "revenue" ? "Revenue" : "Users"} over the last {period}{" "}
            calendar days
          </div>

          <div
            className="flex w-fit rounded-lg bg-slate-100 p-1"
            aria-label="Select chart metric"
          >
            <button
              type="button"
              onClick={() => setMetric("revenue")}
              aria-pressed={metric === "revenue"}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                metric === "revenue"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Revenue
            </button>
            <button
              type="button"
              onClick={() => setMetric("users")}
              aria-pressed={metric === "users"}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                metric === "users"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              Users
            </button>
          </div>
        </div>

        {filteredData.length === 0 ? (
          <div className="flex h-72 items-center justify-center text-sm text-slate-500 dark:text-slate-600">
            No chart data available for this period.
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={filteredData}
                margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
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
                  width={55}
                  tick={{ fontSize: 11, fill: "#64748b" }}
                />
                <Tooltip
                  formatter={(value) => [
                    metric === "revenue"
                      ? `$${Number(value).toLocaleString("en-US")}`
                      : Number(value).toLocaleString("en-US"),
                    metric === "revenue" ? "Revenue" : "Users",
                  ]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey={metric}
                  stroke="#4f46e5"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      {/* Traffic sources */}
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <h2 className="font-bold text-slate-600 dark:text-slate-800">
            Traffic source breakdown
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-700">
            Compare the contribution of each traffic channel.
          </p>
        </div>

        {trafficData.length === 0 ? (
          <p className="py-8 text-center text-sm text-slate-500 dark:text-slate-700">
            No traffic source data available.
          </p>
        ) : (
          <div className="space-y-5">
            {trafficData.map((source) => {
              const percentage =
                trafficData.reduce((sum, item) => sum + item.value, 0) > 0
                  ? (source.value /
                      trafficData.reduce((sum, item) => sum + item.value, 0)) *
                    100
                  : 0;

              return (
                <div key={source.name}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="flex min-w-0 items-center gap-2 font-medium">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: source.color }}
                      />
                      <span className="truncate text-slate-600 dark:text-slate-800">
                        {source.name}
                      </span>
                    </span>
                    <span className="shrink-0 text-slate-500">
                      {source.value.toLocaleString("en-US")} (
                      {percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: source.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
      <VirtualizedTransactionsTable />
    </div>
  );
}

function Metric({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          {icon}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-600 dark:text-slate-800">
        {value}
      </p>
    </article>
  );
}
