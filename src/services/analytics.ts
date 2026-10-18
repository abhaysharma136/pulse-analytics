import type { ChartPoint, Metric, TrafficSource } from "@/types/analytics";
import type { Transaction } from "@/features/transactions/components/TransactionsTable";

export type OverviewResponse = {
  metrics: Metric[];
  chartData: ChartPoint[];
  trafficData: TrafficSource[];
  totalVisitors: number;
};

export type TransactionsResponse = {
  data: Transaction[];
  total: number;
  page: number;
  pageSize: number;
};

export async function getOverview(
  signal?: AbortSignal,
): Promise<OverviewResponse> {
  const response = await fetch("/api/analytics/overview", { signal });

  if (!response.ok) {
    throw new Error("Failed to load analytics overview");
  }

  return response.json();
}

export async function getTransactions(params: {
  search?: string;
  status?: string;
  sortBy?: "name" | "amount" | "date";
  sortOrder?: "asc" | "desc";
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}): Promise<TransactionsResponse> {
  const query = new URLSearchParams();

  if (params.search?.trim()) {
    query.set("search", params.search.trim());
  }

  query.set("status", params.status ?? "all");
  query.set("sortBy", params.sortBy ?? "date");
  query.set("sortOrder", params.sortOrder ?? "desc");
  query.set("page", String(params.page ?? 1));
  query.set("pageSize", String(params.pageSize ?? 10));

  const response = await fetch(`/api/transactions?${query.toString()}`, {
    signal: params.signal,
  });

  if (!response.ok) {
    throw new Error("Failed to load transactions");
  }

  return response.json();
}
