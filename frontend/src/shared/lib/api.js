import { useUserStore } from "../../features/auth/model/useUserStore";
import { ApiClient } from "../../features/lib/apiClient";

export const api = new ApiClient({
  baseURL: "/api",
  timeout: 10000,
  onUnauthorized: async () => {
    try {
      await useUserStore.getState().refreshToken();
    } catch (e) {
      console.error("Не удалось обновить токен", e);
    }
  },
});
