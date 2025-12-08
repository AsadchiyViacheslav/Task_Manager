import { api } from "../../../../shared/lib/api";

export const useTasksApi = {
    getAll: async () =>
        api.get("/tasks"),

    getById: async (taskId) =>
        api.get(`/tasks/${taskId}`),

    create: async (data) =>
        api.post("/tasks", data),

    update: async (taskId, data) =>
        api.put(`/tasks/${taskId}`, data),

    delete: async (taskId) =>
        api.delete(`/tasks/${taskId}`),
};