import { create } from "zustand";
import { useAuthApi } from "../lib/apiUser";

export const useUserStore = create((set, get) => ({
  name: "",
  accessToken: "",
  isLoggedIn: true,
  avatar:"/profile.svg",

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
    let response;

    try {
      response = await useAuthApi.login("/login", data);
      const { name, accessToken } = response;

      set({
        name,
        accessToken,
        isLoggedIn: true,
      });
    } catch (e) {
      throw e;
    }

    return response;
  },

  reg: async (data) => {
    let response;
    try {
      response = await useAuthApi.reg("/register", data);
    } catch (e) {
      throw e;
    }
    return response;
  },

  logout: async () => {
    try {
      await useAuthApi.logout("/logout");
      set({
        name: "",
        accessToken: "",
        isLoggedIn: false,
      });
    } catch (e) {
      set({
        name: "",
        accessToken: "",
        isLoggedIn: false,
      });
      throw e;
    }
  },
}));
