
import type { ChartPoint } from "@/types/analytics";

export type DateRange = "7" | "30" | "90";

export function filterChartData(
  chartData: ChartPoint[],
  dateRange: DateRange,
  now = new Date(),
): ChartPoint[] {
  const endDate = new Date(now);
  endDate.setHours(0, 0, 0, 0);

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - (Number(dateRange) - 1));

  const toDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const startKey = toDateKey(startDate);
  const endKey = toDateKey(endDate);

  return chartData
    .filter((point) => point.date >= startKey && point.date <= endKey)
    .sort((a, b) => a.date.localeCompare(b.date));
}
