import { create } from "zustand";

const useAuth = create((set) => ({
  token: "",
  setToken: (token) => set({ token }),
  clear: () => set({ token: "" }),
}));

export default useAuth;
