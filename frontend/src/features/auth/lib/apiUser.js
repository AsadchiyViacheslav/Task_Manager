import { ApiClient } from "../../lib/apiClient";
import { useUserStore } from "../model/useUserStore";

const authApi = new ApiClient({
  baseURL: "/api/auth",
  timeout: 10000,
  onUnauthorized: async () => {
    await useUserStore.getState().refreshToken();
  },
});

export const useAuthApi = {
  reg: async (data) => {
    return authApi.post("/register", data);
  },

  login: async (data) => {
    return authApi.post("/login", data);
  },

  refresh: async () => authApi.post("/refresh"),

  logout: async () => authApi.post("/logout"),
};
