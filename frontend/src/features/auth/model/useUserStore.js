import {create} from "zustand";
import { useAuthApi } from "../lib/apiUser";
export const useUserStore = create((set, get) => ({
  name: "",
  accessToken: "",
  isLoggedIn: false,

  setUser: ({ name, accessToken }) =>
    set(() => ({
      name,
      accessToken,
      isLoggedIn: true,
    })),

  clearUser: () =>
    set(() => ({
      name: "",
      accessToken: "",
      isLoggedIn: false,
    })),

  login: async (data) => {
    const response = await useAuthApi.login("/login", data);
    const { name, accessToken } = response;

    set({
      name,
      accessToken,
      isLoggedIn: true,
    });

    return response;
  },

  reg: async (data) => {
    const response = await useAuthApi.reg("/register", data);
    return response;
  },

  logout: async () => {
    await useAuthApi.logout("/logout");
    set({
      name: "",
      accessToken: "",
      isLoggedIn: false,
    });
  },
}));