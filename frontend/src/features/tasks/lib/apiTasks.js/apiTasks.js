import { useUserStore } from "../../../auth/model/useUserStore";
import { ApiClient } from "../../../lib/apiClient";


const tasksApi = new ApiClient({
  baseURL: import.meta.env.NEXT_PUBLIC_API_TASKS_URL,
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

      return token;
    }

    return null;
  },

  onUnauthorized: async () => {
    await useUserStore.getState().refreshToken();
  },
});

export const useTasksApi = {
//   getAll: async () => tasksApi.get("/tasks"),
    getAll: async () => {
        try {
            const response = await fetch("/db.json");
        if (!response.ok) {
            throw new Error("Не удалось загрузить задачи");
        }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Ошибка при получении задач:", error);
            return [];
        }
    },

    getById: async (id) => tasksApi.get(`/tasks/${id}`),

    create: async (data) => tasksApi.post("/tasks", data),

    update: async (id, data) => tasksApi.put(`/tasks/${id}`, data),

    delete: async (id) => tasksApi.delete(`/tasks/${id}`),
};
