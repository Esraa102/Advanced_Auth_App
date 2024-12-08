import axios from "axios";
import { create } from "zustand";
import { baseUrl } from "../constants";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: true,
  setUser: (data) => set({ user: data }),
  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const response = await axios.get(`${baseUrl}/auth/check-auth`, {
        withCredentials: true,
      });
      set({ isLoading: false, user: response.data.user });
    } catch (error) {
      set({ isLoading: false });
      console.log(error);
    }
  },
}));

export default useAuthStore;
