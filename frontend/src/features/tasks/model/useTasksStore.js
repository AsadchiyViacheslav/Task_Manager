import { create } from "zustand";
import { useTasksApi } from "../lib/apiTasks.js/apiTasks";

export const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: false,

  getAll: async () => {
    set({ loading: true });
    try {
      const data = await useTasksApi.getAll();
      set({ tasks: data, loading: false });
      return data;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  getById: async (id) => {
    set({ loading: true });
    try {
      const task = await useTasksApi.getById(id);
      set({ loading: false });
      return task;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  create: async (task) => {
    set({ loading: true });
    try {
      const newTask = await useTasksApi.create(task);
      set((state) => ({ tasks: [...state.tasks, newTask], loading: false }));
      return newTask;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  update: async (id, updatedFields) => {
    set({ loading: true });
    try {
      const updatedTask = await useTasksApi.update(id, updatedFields);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updatedFields } : t)),
        loading: false,
      }));
      return updatedTask;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  delete: async (id) => {
    set({ loading: true });
    try {
      await useTasksApi.delete(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        loading: false,
      }));
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  setProgress: (id, progress) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, progress } : t)),
    }));
  },
}));
