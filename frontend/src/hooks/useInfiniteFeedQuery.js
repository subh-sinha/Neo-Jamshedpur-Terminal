import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteFeedQuery({ queryKey, fetchAll, pageSize = 6 }) {
  return useInfiniteQuery({
    queryKey,
    initialPageParam: 0,
    queryFn: async ({ pageParam }) => {
      const allItems = await fetchAll();
      const start = pageParam * pageSize;
      const items = allItems.slice(start, start + pageSize);
      return {
        items,
        nextPage: start + pageSize < allItems.length ? pageParam + 1 : undefined,
        total: allItems.length
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage
  });
}
