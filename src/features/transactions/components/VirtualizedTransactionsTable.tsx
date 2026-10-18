"use client";

import { useMemo, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { mockTransactions } from "@/mocks/data/transactions";

const DEMO_ROW_COUNT = 5000;
const ROW_HEIGHT = 56;

export default function VirtualizedTransactionsTable() {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Generate a stable demo dataset once per mounted component.
  const transactions = useMemo(() => {
    if (mockTransactions.length === 0) return [];

    return Array.from({ length: DEMO_ROW_COUNT }, (_, index) => {
      const source = mockTransactions[index % mockTransactions.length];

      return {
        ...source,
        order: `ORD-${String(index + 1).padStart(5, "0")}`,
      };
    });
  }, []);

  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-bold text-slate-600 dark:text-slate-800">
            Virtualized transaction explorer
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            A large-dataset rendering demonstration.
          </p>
        </div>

        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          {transactions.length.toLocaleString()} rows
        </span>
      </div>

      <div
        ref={scrollRef}
        className="h-105 overflow-auto rounded-lg border border-slate-200"
        role="region"
        aria-label="Virtualized transactions"
        tabIndex={0}
      >
        <div
          role="table"
          aria-label="Large transaction dataset"
          aria-rowcount={transactions.length + 1}
          className="min-w-162.5 text-sm"
        >
          <div
            role="row"
            className="sticky top-0 z-10 grid grid-cols-[1.4fr_1fr_1fr_0.8fr] border-b border-slate-200 bg-slate-50 font-semibold text-slate-600"
          >
            <div role="columnheader" className="p-3">
              Customer
            </div>
            <div role="columnheader" className="p-3">
              Order ID
            </div>
            <div role="columnheader" className="p-3">
              Status
            </div>
            <div role="columnheader" className="p-3">
              Amount
            </div>
          </div>

          <div
            role="rowgroup"
            style={{
              height: `${virtualizer.getTotalSize()}px`,
              position: "relative",
            }}
          >
            {virtualRows.map((virtualRow) => {
              const transaction = transactions[virtualRow.index];

              return (
                <div
                  key={transaction.order}
                  role="row"
                  aria-rowindex={virtualRow.index + 2}
                  className="absolute left-0 top-0 grid w-full grid-cols-[1.4fr_1fr_1fr_0.8fr] border-b border-slate-100 hover:bg-slate-50 text-slate-600 dark:text-slate-800"
                  style={{
                    height: `${virtualRow.size}px`,
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div role="cell" className="truncate p-3 font-medium">
                    {transaction.name}
                  </div>
                  <div role="cell" className="p-3 text-slate-500">
                    {transaction.order}
                  </div>
                  <div role="cell" className="truncate p-3">
                    {transaction.status}
                  </div>
                  <div role="cell" className="p-3 font-medium">
                    ${transaction.amount.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        Only visible rows and the overscan buffer are mounted.
      </p>
    </section>
  );
}
