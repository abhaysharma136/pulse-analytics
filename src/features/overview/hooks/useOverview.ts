import { useQuery } from "@tanstack/react-query";
import { getOverview } from "@/services/analytics";

export function useOverview() {
  return useQuery({
    queryKey: ["analytics", "overview"],
    queryFn: ({ signal }) => getOverview(signal),
  });
}
