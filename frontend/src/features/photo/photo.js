import { api } from "../../shared/lib/api";

export const usePhotoApi = {
    upload: async (taskId, file) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post(`/tasks/${taskId}/photo`, formData)
    },

    delete: async (taskId) =>
        api.delete(`/tasks/${taskId}/photo`),

    get: async (path) =>
        api.get(`/tasks/${path}`),
};