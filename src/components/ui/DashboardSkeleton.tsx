function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-slate-200 dark:bg-slate-700 ${className}`}
    />
  );
}

export function OverviewSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading dashboard">
      <span className="sr-only">Loading dashboard data...</span>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-10 rounded-xl" />
            </div>
            <Skeleton className="mt-5 h-8 w-28" />
            <Skeleton className="mt-3 h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Chart panels */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 xl:col-span-2 dark:border-slate-700 dark:bg-slate-900">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-2 h-3 w-56" />
          <Skeleton className="mt-6 h-64 w-full rounded-lg" />
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mx-auto mt-8 h-40 w-40 rounded-full" />
          <div className="mt-6 space-y-4">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-3 w-3 rounded-full" />
                <Skeleton className="h-3 flex-1" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transactions panel */}
      <TransactionsSkeleton />
    </div>
  );
}

export function TransactionsSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
      role="status"
      aria-label="Loading transactions"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-9 w-24" />
      </div>

      <Skeleton className="mt-5 h-10 w-full" />

      <div className="mt-5 space-y-4">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 items-center gap-4 border-b border-slate-100 pb-4 dark:border-slate-800 sm:grid-cols-6"
          >
            <div className="col-span-2 flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            </div>
            <Skeleton className="hidden h-3 w-20 sm:block" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="hidden h-3 w-20 sm:block" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsExplorerSkeleton() {
  return (
    <div
      className="space-y-6"
      role="status"
      aria-label="Loading analytics explorer"
    >
      <span className="sr-only">Loading analytics explorer...</span>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-8 w-32" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"
          >
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-6 h-72 w-full rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
