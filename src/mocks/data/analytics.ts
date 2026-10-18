import type { ChartPoint, Metric, TrafficSource } from "@/types/analytics";

export const mockMetrics: Metric[] = [
  {
    title: "Total Revenue",
    value: "$125,430",
    change: "+12.5%",
    positive: true,
    comparison: "vs. $111,230 last month",
    icon: "activity",
    color: "blue",
  },
  {
    title: "Active Users",
    value: "12,480",
    change: "+8.2%",
    positive: true,
    comparison: "vs. 11,530 last month",
    icon: "users",
    color: "green",
  },
  {
    title: "Conversion Rate",
    value: "3.24%",
    change: "+1.4%",
    positive: true,
    comparison: "vs. 2.98% last month",
    icon: "shopping-cart",
    color: "purple",
  },
  {
    title: "Avg. Order Value",
    value: "$58.90",
    change: "-2.1%",
    positive: false,
    comparison: "vs. $60.12 last month",
    icon: "bar-chart",
    color: "orange",
  },
];

export const mockChartData: ChartPoint[] = Array.from(
  { length: 90 },
  (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (89 - index));

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dayOfMonth = String(date.getDate()).padStart(2, "0");

    return {
      date: `${year}-${month}-${dayOfMonth}`,
      day: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenue:
        4000 + index * 100 + Math.round(Math.abs(Math.sin(index * 0.4) * 1800)),
      users:
        1800 + index * 25 + Math.round(Math.abs(Math.cos(index * 0.3) * 700)),
    };
  },
);

export const mockTrafficData: TrafficSource[] = [
  { name: "Organic Search", value: 36.2, color: "#4f46e5" },
  { name: "Direct", value: 24.1, color: "#60a5fa" },
  { name: "Social Media", value: 18.3, color: "#34d399" },
  { name: "Referral", value: 12.4, color: "#fbbf24" },
  { name: "Paid Ads", value: 6.2, color: "#fb923c" },
  { name: "Email", value: 2.8, color: "#a78bfa" },
];

export const mockTotalVisitors = 24320;
