"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowRight } from "lucide-react";

import { Sidebar } from "@/components/layout/Sidebar";
import Topbar, { type GlobalSearchResult } from "@/components/layout/Topbar";

import MetricCard from "@/features/overview/components/MetricCard";

import TransactionsTable from "@/features/transactions/components/TransactionsTable";

import { useOverview } from "@/features/overview/hooks/useOverview";
import { useTransactions } from "@/features/transactions/hooks/useTransactions";
import { useDebouncedValue } from "@/features/transactions/hooks/useDebouncedValue";
import WorkspacePage from "@/features/workspace/WorkspacePage";
import dynamic from "next/dynamic";
import {
  OverviewSkeleton,
  TransactionsSkeleton,
  AnalyticsExplorerSkeleton,
} from "@/components/ui/DashboardSkeleton";
const ChartLoading = () => (
  <div
    className="min-h-72 animate-pulse rounded-xl border border-slate-200 bg-white"
    aria-label="Loading chart"
  />
);

const RevenueChart = dynamic(
  () => import("@/features/overview/components/RevenueChart"),
  { loading: ChartLoading },
);

const TrafficSourcesChart = dynamic(
  () => import("@/features/overview/components/TrafficSourcesChart"),
  { loading: ChartLoading },
);

const AnalyticsExplorer = dynamic(
  () => import("@/features/analytics/components/AnalyticsExplorer"),
  { loading: ChartLoading },
);

const PAGE_STORAGE_KEY = "pulse-active-page";

function subscribeToActivePage(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("pulse-active-page-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("pulse-active-page-change", callback);
  };
}

function getActivePageSnapshot() {
  return sessionStorage.getItem(PAGE_STORAGE_KEY) ?? "Overview";
}

function getServerActivePageSnapshot() {
  return "Overview";
}
export default function Home() {
  const activePage = useSyncExternalStore(
    subscribeToActivePage,
    getActivePageSnapshot,
    getServerActivePageSnapshot,
  );

  function setActivePage(page: string) {
    sessionStorage.setItem(PAGE_STORAGE_KEY, page);
    window.dispatchEvent(new Event("pulse-active-page-change"));
  }
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState<"name" | "amount" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState("");
  const [transactionSearch, setTransactionSearch] = useState("");
  const [period, setPeriod] = useState<"7" | "30" | "90">("30");
  const isOverview = activePage === "Overview";
  // Table search remains independent.
  const debouncedSearch = useDebouncedValue(transactionSearch, 300);
  // Global header search has its own debounced value.
  const debouncedHeaderSearch = useDebouncedValue(headerSearch, 300);
  // Fetch dashboard analytics through TanStack Query.
  const overviewQuery = useOverview();

  // Fetch transactions through the API, including search.
  const transactionsQuery = useTransactions({
    search: debouncedSearch,
    status,
    sortBy,
    sortOrder,
    page,
    pageSize,
  });
  // Search transactions independently of the table filters.
  const globalSearchQuery = useTransactions({
    search: debouncedHeaderSearch,
    status: "all",
    sortBy: "date",
    sortOrder: "desc",
    page: 1,
    pageSize: 5,
  });
  return (
    <main
      className={`min-h-screen ${
        darkMode
          ? "dark bg-slate-950 text-slate-100"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="flex min-h-screen">
        <Sidebar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activePage={activePage}
          setActivePage={setActivePage}
        />

        <section className="min-w-0 flex-1">
          <Topbar
            darkMode={darkMode}
            setMobileMenuOpen={setMobileMenuOpen}
            search={headerSearch}
            setSearch={setHeaderSearch}
            searchResults={
              headerSearch.trim() === debouncedHeaderSearch.trim()
                ? ((globalSearchQuery.data?.data as
                    | GlobalSearchResult[]
                    | undefined) ?? [])
                : []
            }
            searchLoading={
              headerSearch.trim() !== debouncedHeaderSearch.trim() ||
              globalSearchQuery.isFetching
            }
            searchError={globalSearchQuery.isError}
            onSelectResult={(result) => {
              // Navigate to the dashboard and locate the selected transaction.
              setActivePage("Overview");
              setTransactionSearch(result.order);
              setPage(1);
              setHeaderSearch("");
            }}
            period={period}
            onPeriodChange={setPeriod}
          />

          <div className="mx-auto max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="mb-2 text-sm font-medium text-slate-500">
                  Welcome back, John 👋
                </p>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  {isOverview ? "Business overview" : activePage}
                </h1>

                <p className="mt-2 text-sm text-slate-500 sm:text-base">
                  Track your key metrics, monitor growth, and gain insights from
                  your data.
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="flex w-fit items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              >
                Export report
                <ArrowRight size={16} />
              </button>
            </div>

            {isOverview ? (
              <>
                {overviewQuery.isPending ? (
                  <OverviewSkeleton />
                ) : overviewQuery.isError ? (
                  <div className="rounded-xl border border-red-200 bg-white p-8">
                    <h2 className="font-semibold text-red-600">
                      Unable to load analytics
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      {overviewQuery.error.message}
                    </p>
                    <button
                      onClick={() => overviewQuery.refetch()}
                      className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                      Try again
                    </button>
                  </div>
                ) : (
                  <>
                    {/* KPI cards */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {overviewQuery.data.metrics.map((metric) => (
                        <MetricCard key={metric.title} {...metric} />
                      ))}
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
                      <RevenueChart
                        data={overviewQuery.data.chartData.slice(
                          -Number(period),
                        )}
                      />

                      <TrafficSourcesChart
                        data={overviewQuery.data.trafficData}
                        totalVisitors={overviewQuery.data.totalVisitors}
                      />
                    </div>

                    {/* Transactions */}

                    {transactionsQuery.isError && !transactionsQuery.data ? (
                      <div className="rounded-xl border border-red-200 bg-white p-8">
                        <h2 className="font-semibold text-red-600">
                          Unable to load transactions
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                          {transactionsQuery.error.message}
                        </p>
                        <button
                          onClick={() => transactionsQuery.refetch()}
                          className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                        >
                          Try again
                        </button>
                      </div>
                    ) : transactionsQuery.data ? (
                      <TransactionsTable
                        data={transactionsQuery.data.data}
                        search={transactionSearch}
                        onSearchChange={(value) => {
                          setTransactionSearch(value);
                          setPage(1);
                        }}
                        status={status}
                        onStatusChange={(value) => {
                          setStatus(value);
                          setPage(1);
                        }}
                        sortBy={sortBy}
                        onSortByChange={setSortBy}
                        sortOrder={sortOrder}
                        onSortOrderChange={setSortOrder}
                        page={page}
                        pageSize={pageSize}
                        total={transactionsQuery.data.total}
                        onPageChange={setPage}
                        isFetching={transactionsQuery.isFetching}
                        onViewAll={() => setActivePage("Analytics Explorer")}
                      />
                    ) : (
                      <TransactionsSkeleton />
                    )}
                  </>
                )}
              </>
            ) : activePage === "Analytics Explorer" ? (
              overviewQuery.isPending ? (
                <AnalyticsExplorerSkeleton />
              ) : overviewQuery.isError ? (
                <div className="rounded-xl border border-red-200 bg-white p-8">
                  <h2 className="font-semibold text-red-600">
                    Unable to load analytics
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    {overviewQuery.error.message}
                  </p>
                  <button
                    onClick={() => overviewQuery.refetch()}
                    className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                  >
                    Try again
                  </button>
                </div>
              ) : (
                <AnalyticsExplorer
                  chartData={overviewQuery.data.chartData}
                  trafficData={overviewQuery.data.trafficData}
                  totalVisitors={overviewQuery.data.totalVisitors}
                  period={period}
                  onPeriodChange={setPeriod}
                />
              )
            ) : (
              <WorkspacePage
                activePage={activePage}
                onNavigate={setActivePage}
              />
            )}

            <footer className="pb-3 text-center text-xs text-slate-400">
              Pulse Analytics · Portfolio demo · Sample business data
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}
