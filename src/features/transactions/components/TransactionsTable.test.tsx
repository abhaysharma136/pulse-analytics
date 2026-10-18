import { describe, expect, it, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TransactionsTable, { type Transaction } from "./TransactionsTable";

const transactions: Transaction[] = [
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
    status: "Completed",
    date: "2026-10-12",
    initials: "MC",
  },
];

function renderTable(
  overrides: Partial<React.ComponentProps<typeof TransactionsTable>> = {},
) {
  const props = {
    data: transactions,
    search: "",
    onSearchChange: vi.fn(),
    status: "all",
    onStatusChange: vi.fn(),
    sortBy: "date" as const,
    onSortByChange: vi.fn(),
    sortOrder: "desc" as const,
    onSortOrderChange: vi.fn(),
    page: 1,
    pageSize: 1,
    total: 2,
    onPageChange: vi.fn(),
    isFetching: false,
    onViewAll: vi.fn(),
    ...overrides,
  };

  render(<TransactionsTable {...props} />);
  return props;
}

describe("TransactionsTable", () => {
  it("renders transaction rows and the result count", () => {
    renderTable();

    expect(screen.getByText("Alice Brown")).toBeInTheDocument();
    expect(screen.getByText("Mike Chen")).toBeInTheDocument();
    expect(
      screen.getByText("Showing 1–1 of 2 transactions"),
    ).toBeInTheDocument();
  });

  it("sends search text to the parent and resets to page 1", async () => {
    const user = userEvent.setup();
    const props = renderTable({ page: 2 });

    await user.type(
      screen.getByRole("textbox", { name: "Search transactions" }),
      "alice",
    );

    expect(props.onSearchChange).toHaveBeenCalled();
    expect(props.onSearchChange).toHaveBeenCalledTimes(5);
    expect(props.onSearchChange).toHaveBeenLastCalledWith("e");
    expect(props.onPageChange).toHaveBeenCalledWith(1);
  });

  it("sends the selected status to the parent and resets pagination", async () => {
    const user = userEvent.setup();
    const props = renderTable({ page: 2 });

    await user.selectOptions(
      screen.getByRole("combobox", {
        name: "Filter by transaction status",
      }),
      "Completed",
    );

    expect(props.onStatusChange).toHaveBeenCalledWith("Completed");
    expect(props.onPageChange).toHaveBeenCalledWith(1);
  });

  it("changes the sort field and selects its default direction", async () => {
    const user = userEvent.setup();
    const props = renderTable();

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Sort transactions by" }),
      "amount",
    );

    expect(props.onSortByChange).toHaveBeenCalledWith("amount");
    expect(props.onSortOrderChange).toHaveBeenCalledWith("asc");
    expect(props.onPageChange).toHaveBeenCalledWith(1);
  });

  it("toggles the sort direction when the current field is selected again", async () => {
    const user = userEvent.setup();
    const props = renderTable({
      sortBy: "amount",
      sortOrder: "asc",
    });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Sort transactions by" }),
      "amount",
    );

    expect(props.onSortOrderChange).toHaveBeenCalledWith("desc");
    expect(props.onPageChange).toHaveBeenCalledWith(1);
  });

  it("moves to the next page and disables pagination at the boundaries", async () => {
    const user = userEvent.setup();
    const props = renderTable();

    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Next page" }));
    expect(props.onPageChange).toHaveBeenCalledWith(2);

    // Unmount the first table before rendering the last-page state.
    cleanup();

    renderTable({ page: 2 });

    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("shows an empty state when there are no results", () => {
    renderTable({ data: [], total: 0 });

    expect(screen.getByText("No transactions found")).toBeInTheDocument();
    expect(
      screen.getByText("Showing 0–0 of 0 transactions"),
    ).toBeInTheDocument();
  });

  it("shows the fetching status", () => {
    renderTable({ isFetching: true });

    expect(screen.getByText("Updating transactions...")).toBeInTheDocument();
  });
});
