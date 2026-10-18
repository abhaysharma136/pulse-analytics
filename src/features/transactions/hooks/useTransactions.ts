import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/analytics";

type UseTransactionsParams = {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "name" | "amount" | "date";
  sortOrder?: "asc" | "desc";
  status?: string;
};

export function useTransactions({
  search = "",
  page = 1,
  pageSize = 10,
  sortBy = "date",
  sortOrder = "desc",
  status = "all",
}: UseTransactionsParams = {}) {
  return useQuery({
    queryKey: [
      "transactions",
      { search, status, sortBy, sortOrder, page, pageSize },
    ],
    queryFn: ({ signal }) =>
      getTransactions({
        search,
        status,
        sortBy,
        sortOrder,
        page,
        pageSize,
        signal,
      }),
    placeholderData: (previousData) => previousData,
  });
}
