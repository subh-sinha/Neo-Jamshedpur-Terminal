import { create } from "zustand";

export const useAuthStore = create((set) => ({
  token: localStorage.getItem("neo-jam-token"),
  user: null,
  setAuth(data) {
    localStorage.setItem("neo-jam-token", data.token);
    set({ token: data.token, user: data.user });
  },
  hydrateUser(user) {
    set({ user });
  },
  logout() {
    localStorage.removeItem("neo-jam-token");
    set({ token: null, user: null });
  }
}));
