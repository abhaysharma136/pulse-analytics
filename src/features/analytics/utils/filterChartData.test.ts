import { describe, expect, it } from "vitest";
import { filterChartData } from "./filterChartData";
import type { ChartPoint } from "@/types/analytics";

const sampleData: ChartPoint[] = Array.from({ length: 90 }, (_, index) => {
  const date = new Date(2026, 6, 20 + index);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const dateKey = `${year}-${month}-${day}`;

  return {
    date: dateKey,
    day: dateKey,
    revenue: 1000 + index,
    users: 100 + index,
  };
});

describe("filterChartData", () => {
  const now = new Date(2026, 9, 17, 12);

  it.each([
    ["7", 7],
    ["30", 30],
    ["90", 90],
  ] as const)("returns %i calendar days for range %s", (range, expected) => {
    const result = filterChartData(sampleData, range, now);

    expect(result).toHaveLength(expected);
    expect(result.at(-1)?.date).toBe("2026-10-17");
  });

  it("returns dates in ascending order", () => {
    const reversed = [...sampleData].reverse();
    const result = filterChartData(reversed, "7", now);

    expect(result.map((point) => point.date)).toEqual(
      [...result.map((point) => point.date)].sort(),
    );
  });

  it("returns no records when none fall within the selected range", () => {
    expect(filterChartData(sampleData, "7", new Date(2027, 0, 1))).toEqual([]);
  });
});
