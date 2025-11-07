import { create } from "zustand";

const useAuth = create((set) => ({
  token: null,
  user: null,
  setAuth: (token, user) => set({ token, user }),
  clear: () => set({ token: null, user: null }),
}));

export default useAuth;
