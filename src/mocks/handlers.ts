import { http, HttpResponse, delay } from "msw";
import {
  mockMetrics,
  mockChartData,
  mockTrafficData,
  mockTotalVisitors,
} from "@/mocks/data/analytics";
import { mockTransactions } from "@/mocks/data/transactions";
import { processTransactions } from "@/features/transactions/utils/processTransactions";
export const handlers = [
  http.get("/api/analytics/overview", async () => {
    await delay(400);

    return HttpResponse.json({
      metrics: mockMetrics,
      chartData: mockChartData,
      trafficData: mockTrafficData,
      totalVisitors: mockTotalVisitors,
    });
  }),

  http.get("/api/transactions", async ({ request }) => {
    await delay(400);

    const url = new URL(request.url);
    const params = url.searchParams;

    const result = processTransactions(mockTransactions, {
      search: params.get("search") ?? "",
      status: params.get("status") ?? "all",
      sortBy: params.get("sortBy") ?? "date",
      sortOrder: params.get("sortOrder") ?? "desc",
      page: Number(params.get("page") ?? 1),
      pageSize: Number(params.get("pageSize") ?? 10),
    });

    return HttpResponse.json(result);
  }),
];
