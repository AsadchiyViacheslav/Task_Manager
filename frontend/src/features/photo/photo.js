import { api } from "../../shared/lib/api";

export const usePhotoApi = {
    upload: async (taskId, file) => {
        const formData = new FormData();
        formData.append("file", file);
        return api.post(`/tasks/${taskId}/photo`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },

    delete: async (taskId) =>
        api.delete(`/tasks/${taskId}/photo`),

    get: async (taskId) =>
        api.get(`/tasks/${taskId}/photo`),
};