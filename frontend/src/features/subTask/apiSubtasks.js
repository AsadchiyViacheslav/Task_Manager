import { api } from "../../shared/lib/api";

export const useSubTasksApi = {
    getAll: async (taskId) =>
        api.get(`/tasks/${taskId}/subtasks`),

    getById: async (taskId, subTaskId) =>
        api.get(`/tasks/${taskId}/subtasks/${subTaskId}`),

    create: async (taskId, data) =>
        api.post(`/tasks/${taskId}/subtasks`, data),

    update: async (taskId, subTaskId, data) =>{
        console.log(data)
        return api.put(`/tasks/${taskId}/subtasks/${subTaskId}`, data)},

    delete: async (taskId, subTaskId) =>
        api.delete(`/tasks/${taskId}/subtasks/${subTaskId}`),
};
