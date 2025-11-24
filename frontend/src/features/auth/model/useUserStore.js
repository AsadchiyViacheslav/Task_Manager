<<<<<<< HEAD
import {create} from "zustand";
import { useAuthApi } from "../lib/apiUser";
=======
import { create } from "zustand";
import { useAuthApi } from "../lib/apiUser";

>>>>>>> login-front
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
<<<<<<< HEAD
    const response = await useAuthApi.login("/login", data);
    const { name, accessToken } = response;

    set({
      name,
      accessToken,
      isLoggedIn: true,
    });
=======
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
>>>>>>> login-front

    return response;
  },

  reg: async (data) => {
<<<<<<< HEAD
    const response = await useAuthApi.reg("/register", data);
=======
    let response;
    try {
      response = await useAuthApi.reg("/register", data);
    } catch (e) {
      throw e;
    }
>>>>>>> login-front
    return response;
  },

  logout: async () => {
<<<<<<< HEAD
    await useAuthApi.logout("/logout");
    set({
      name: "",
      accessToken: "",
      isLoggedIn: false,
    });
  },
}));
=======
    try {
      await useAuthApi.logout("/logout");
      set({
        name: "",
        accessToken: "",
        isLoggedIn: false,
      });
    } catch (e) {
      throw e;
    }
  },
}));
>>>>>>> login-front
