import { ApiClient } from "../../lib/apiClient";
import { useUserStore } from "../model/useUserStore";


const authApi = new ApiClient({
  baseURL: import.meta.env.NEXT_PUBLIC_API_AUTH_URL,
  timeout: 10000,
  getAuthToken: async () => {
    if (typeof window !== "undefined") {
      let token = useUserStore.getState().token;

      const isTokenValid = (jwt) => {
        if (!jwt) return false;
        try {
          const [, payloadBase64] = jwt.split(".");
          const payloadJson = atob(payloadBase64);
          const payload = JSON.parse(payloadJson);
          const now = Math.floor(Date.now() / 1000);
          return payload.exp && payload.exp > now;
        } catch (error) {
          console.log("Ошибка при проверке JWT:", error);
          return false;
        }
      };

    //   if (!token || !isTokenValid(token)) {
    //     await useTokenStore.getState().refreshToken();
    //     token = useTokenStore.getState().token;
    //   }

    //   console.log(token);
      return token;
    }

    return null;
  },

  onUnauthorized: async () => {
    await useUserStore.getState().refreshToken();
  },
});

export const useAuthApi = {
    reg: async (data) =>
        authApi.post("/register", data,undefined,null),

    login: async (data) =>
        authApi.post("/login", data,undefined,null),

    // refresh: () => tokenApi.post<{access_token}>("/refresh"),

    logout: async () => authApi.post("/logout"),

}