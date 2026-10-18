import { describe, expect, it } from "vitest";
import { processTransactions } from "./processTransactions";
import type { Transaction } from "@/features/transactions/components/TransactionsTable";

const transactions: Transaction[] = [
  {
    name: "Zoe Adams",
    email: "zoe@example.com",
    order: "ORD-003",
    product: "Keyboard",
    amount: 150,
    status: "Completed",
    date: "2026-10-15",
    initials: "ZA",
  },
  {
    name: "Alice Brown",
    email: "alice@example.com",
    order: "ORD-001",
    product: "Mouse",
    amount: 50,
    status: "Pending",
    date: "2026-10-10",
    initials: "AB",
  },
  {
    name: "Mike Chen",
    email: "mike@example.com",
    order: "ORD-002",
    product: "Monitor",
    amount: 250,
    status: "Refunded",
    date: "2026-10-12",
    initials: "MC",
  },
];

describe("processTransactions", () => {
  it("searches across customer details and product fields", () => {
    const result = processTransactions(transactions, {
      search: "  ALICE@EXAMPLE.COM ",
    });

    expect(result.total).toBe(1);
    expect(result.data[0].name).toBe("Alice Brown");
  });

  it("filters by status", () => {
    const result = processTransactions(transactions, {
      status: "Completed",
    });

    expect(result.data.map((item) => item.order)).toEqual(["ORD-003"]);
    expect(result.total).toBe(1);
  });

  it("sorts amounts in ascending order without mutating input", () => {
    const originalOrders = transactions.map((item) => item.order);

    const result = processTransactions(transactions, {
      sortBy: "amount",
      sortOrder: "asc",
    });

    expect(result.data.map((item) => item.amount)).toEqual([50, 150, 250]);
    expect(transactions.map((item) => item.order)).toEqual(originalOrders);
  });

  it("sorts dates in descending order by default", () => {
    const result = processTransactions(transactions);

    expect(result.data.map((item) => item.order)).toEqual([
      "ORD-003",
      "ORD-002",
      "ORD-001",
    ]);
  });

  it("paginates results and preserves the filtered total", () => {
    const result = processTransactions(transactions, {
      sortBy: "name",
      sortOrder: "asc",
      page: 2,
      pageSize: 1,
    });

    expect(result.total).toBe(3);
    expect(result.data).toHaveLength(1);
    expect(result.data[0].name).toBe("Mike Chen");
    expect(result.page).toBe(2);
    expect(result.pageSize).toBe(1);
  });

  it("clamps invalid pagination values", () => {
    const result = processTransactions(transactions, {
      page: -2,
      pageSize: 500,
    });

    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(100);
  });

  it("returns no results for an unmatched search", () => {
    const result = processTransactions(transactions, {
      search: "not-found",
    });

    expect(result.data).toEqual([]);
    expect(result.total).toBe(0);
  });
});
