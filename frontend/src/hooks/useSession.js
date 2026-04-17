import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/services";
import { useAuthStore } from "../store/authStore";

export function useSession() {
  const token = useAuthStore((state) => state.token);
  const hydrateUser = useAuthStore((state) => state.hydrateUser);

  const query = useQuery({
    queryKey: ["session"],
    queryFn: authApi.me,
    enabled: Boolean(token)
  });

  useEffect(() => {
    if (query.data) {
      hydrateUser(query.data);
    }
  }, [query.data, hydrateUser]);

  return query;
}
