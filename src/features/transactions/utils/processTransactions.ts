import type { Transaction } from "@/features/transactions/components/TransactionsTable";

export type TransactionSortField = "name" | "amount" | "date";
export type TransactionSortOrder = "asc" | "desc";
export type TransactionStatus = "all" | Transaction["status"];

export type TransactionQuery = {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  pageSize?: number;
};

export type ProcessedTransactions = {
  data: Transaction[];
  total: number;
  page: number;
  pageSize: number;
};

const allowedStatuses: Transaction["status"][] = [
  "Completed",
  "Pending",
  "Refunded",
];

const allowedSortFields: TransactionSortField[] = ["name", "amount", "date"];

export function processTransactions(
  transactions: Transaction[],
  query: TransactionQuery = {},
): ProcessedTransactions {
  const search = query.search?.trim().toLowerCase() ?? "";
  const status = query.status ?? "all";

  const sortBy: TransactionSortField = allowedSortFields.includes(
    query.sortBy as TransactionSortField,
  )
    ? (query.sortBy as TransactionSortField)
    : "date";

  const sortOrder: TransactionSortOrder =
    query.sortOrder === "asc" ? "asc" : "desc";

  const page = Math.max(1, Math.floor(Number(query.page) || 1));
  const pageSize = Math.min(
    100,
    Math.max(1, Math.floor(Number(query.pageSize) || 10)),
  );

  const filtered = transactions.filter((transaction) => {
    const matchesSearch = [
      transaction.name,
      transaction.email,
      transaction.order,
      transaction.product,
      transaction.status,
    ].some((value) => value.toLowerCase().includes(search));

    const matchesStatus =
      status === "all" ||
      (allowedStatuses.includes(status as Transaction["status"]) &&
        transaction.status === status);

    return matchesSearch && matchesStatus;
  });

  const sorted = [...filtered].sort((a, b) => {
    let comparison = 0;

    if (sortBy === "amount") {
      comparison = a.amount - b.amount;
    } else if (sortBy === "name") {
      comparison = a.name.localeCompare(b.name);
    } else {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const start = (page - 1) * pageSize;

  return {
    data: sorted.slice(start, start + pageSize),
    total: sorted.length,
    page,
    pageSize,
  };
}
