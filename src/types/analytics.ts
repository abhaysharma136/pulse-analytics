export type MetricIconName =
  | "activity"
  | "users"
  | "shopping-cart"
  | "bar-chart";
export type Metric = {
  title: string;
  value: string;
  change: string;
  positive: boolean;
  comparison: string;
  icon: MetricIconName;
  color: "blue" | "green" | "purple" | "orange";
};

export type ChartPoint = {
  date: string; // ISO date: YYYY-MM-DD
  day: string; // Human-readable chart label
  revenue: number;
  users: number;
};

export type TrafficSource = {
  name: string;
  value: number;
  color: string;
};
