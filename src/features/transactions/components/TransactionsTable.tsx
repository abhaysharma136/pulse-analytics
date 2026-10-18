"use client";

import {
  MoreHorizontal,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export type Transaction = {
  name: string;
  email: string;
  order: string;
  product: string;
  amount: number;
  status: "Completed" | "Pending" | "Refunded";
  date: string;
  initials: string;
};

type TransactionsTableProps = {
  data: Transaction[];
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  sortBy: "name" | "amount" | "date";
  onSortByChange: (value: "name" | "amount" | "date") => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
  onViewAll?: () => void;
};

export default function TransactionsTable({
  data,
  search,
  onSearchChange,
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  sortOrder,
  onSortOrderChange,
  page,
  pageSize,
  total,
  onPageChange,
  isFetching = false,
  onViewAll,
}: TransactionsTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const firstItem = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastItem = Math.min(page * pageSize, total);

  function handleSortChange(value: "name" | "amount" | "date") {
    if (sortBy === value) {
      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortByChange(value);
      onSortOrderChange(value === "date" ? "desc" : "asc");
    }
    onPageChange(1);
  }

  return (
    <article className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 p-5">
        <div>
          <h2 className="text-base font-bold dark:text-slate-700">
            Recent Transactions
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter, sort, and browse transactions
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium hover:bg-slate-50 dark:text-slate-400"
        >
          View all <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="px-5 pb-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1 sm:min-w-56">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(event) => {
                onSearchChange(event.target.value);
                onPageChange(1);
              }}
              placeholder="Search transactions..."
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              aria-label="Search transactions"
            />
          </div>

          <select
            value={status}
            onChange={(event) => {
              onStatusChange(event.target.value);
              onPageChange(1);
            }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-400"
            aria-label="Filter by transaction status"
          >
            <option value="all">All statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Refunded">Refunded</option>
          </select>

          <select
            value={sortBy}
            onChange={(event) =>
              handleSortChange(event.target.value as "name" | "amount" | "date")
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-400 text-slate-900"
            aria-label="Sort transactions by"
          >
            <option value="date">Date</option>
            <option value="name">Customer</option>
            <option value="amount">Amount</option>
          </select>

          <button
            type="button"
            onClick={() => {
              onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
              onPageChange(1);
            }}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium hover:bg-slate-50 text-slate-900"
            aria-label={`Current sort order ${sortOrder}. Toggle sort order`}
          >
            {sortOrder === "asc" ? "Ascending ↑" : "Descending ↓"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50 text-xs text-slate-500">
                <th scope="col" className="px-3 py-3 font-semibold">
                  Customer
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Order ID
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Product
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Amount
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Status
                </th>
                <th scope="col" className="px-3 py-3 font-semibold">
                  Date
                </th>
                <th
                  scope="col"
                  aria-label="Actions"
                  className="w-10 px-2 py-3"
                ></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {data.map((transaction) => (
                <tr
                  key={transaction.order}
                  className="transition hover:bg-slate-50"
                >
                  <td className="px-3 py-4">
                    <div className="flex items-center gap-3 text-slate-800">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                        {transaction.initials}
                      </div>
                      <div>
                        <p className="font-semibold">{transaction.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {transaction.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-3 py-4 text-slate-600">
                    {transaction.order}
                  </td>
                  <td className="px-3 py-4 text-slate-600">
                    {transaction.product}
                  </td>
                  <td className="px-3 py-4 font-semibold text-slate-800">
                    ${transaction.amount.toFixed(2)}
                  </td>

                  <td className="px-3 py-4">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        transaction.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : transaction.status === "Pending"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>

                  <td className="whitespace-nowrap px-3 py-4 text-xs text-slate-500">
                    {transaction.date}
                  </td>

                  <td className="px-3 py-4">
                    <button
                      type="button"
                      className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label={`More actions for ${transaction.order}`}
                      onClick={() =>
                        window.alert(
                          `Transaction: ${transaction.order}\nCustomer: ${transaction.name}\nStatus: ${transaction.status}`,
                        )
                      }
                    >
                      <MoreHorizontal size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!isFetching && data.length === 0 && (
            <div className="py-12 text-center" role="status">
              <Search
                className="mx-auto mb-3 text-slate-400"
                size={28}
                aria-hidden="true"
              />
              <p className="font-semibold">No transactions found</p>
              <p className="mt-1 text-sm text-slate-500">
                Try another search term or status.
              </p>
            </div>
          )}

          {isFetching && (
            <p
              className="py-3 text-center text-xs text-slate-500"
              role="status"
            >
              Updating transactions...
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-slate-500">
            Showing {firstItem}–{lastItem} of {total} transactions
          </span>

          <div className="flex items-center gap-2">
            <span className="mr-2 text-xs text-slate-500">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1 || isFetching}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 text-slate-400"
              aria-label="Previous page"
            >
              <ChevronLeft size={17} />
            </button>

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages || isFetching}
              className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 text-slate-400"
              aria-label="Next page"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
