import { create } from "zustand";
import { useTasksApi } from "../lib/apiTasks.js/apiTasks";

export const useTasksStore = create((set, get) => ({
  tasks: [],
  loading: false,
  completedStats: [],

  getAll: async () => {
    set({ loading: true });
    try {
      const data = await useTasksApi.getAll();
      const tasksWithImg = data.map(task => ({
        ...task,
        img: task.photoPath,
      }));
      
      set({ tasks: tasksWithImg, loading: false });
      return tasksWithImg;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  getById: async (id) => {
    const existing = get().tasks.find(t => t.id === id);
    if (existing) return existing;

    set({ loading: true });
    try {
      const task = await useTasksApi.getById(id);
      const taskWithImg = { ...task, img: task.photoPath };

      set((state) => ({
        tasks: [...state.tasks, taskWithImg],
        loading: false,
      }));

      return taskWithImg;
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
      set((state) => {
        const tasks = state.tasks.map((t) => (t.id === id ? { ...t, ...updatedFields } : t));
        const taskBefore = state.tasks.find(t => t.id === id);
        const today = new Date().toISOString().split("T")[0];

        let completedStats = [...state.completedStats];

        if (updatedFields.progress === 100 && taskBefore?.progress !== 100) {
          const existing = completedStats.find(item => item.date === today);
          if (existing) {
            existing.count += 1;
          } else {
            completedStats.push({ date: today, count: 1 });
          }
        }

        if (updatedFields.progress < 100 && taskBefore?.progress === 100) {
          const existing = completedStats.find(item => item.date === today);
          if (existing) {
            existing.count = Math.max(existing.count - 1, 0);
          }
        }

        return { tasks, loading: false, completedStats };
      });
      return updatedTask;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },

  deleteTask: async (id) => {
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

  getCompletedStats: async () => {
    set({ loading: true });
    try {
      const data = await useTasksApi.getCompletedStats();
      set({ completedStats: data, loading: false });
      return data;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },
}));
