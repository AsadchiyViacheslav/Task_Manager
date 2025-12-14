import { create } from "zustand";
import { useAuthApi } from "../lib/apiUser";

export const useUserStore = create((set, get) => ({
  name: "",
  isLoggedIn: false,
  avatar: "/profile.svg",

  setUser: ({ name }) =>
    set(() => ({
      name,
      isLoggedIn: true,
    })),

  clearUser: () =>
    set(() => ({
      name: "",
      isLoggedIn: false,
    })),

  login: async (data) => {
    try {
      const response = await useAuthApi.login(data);
      const name = response?.username || "";
      set({
        name,
        isLoggedIn: true,
      });
      return response;
    } catch (e) {
      throw e;
    }
  },

  reg: async (data) => {
    try {
      const response = await useAuthApi.reg(data);
      console.log("Регистрация успешна:", response);

      const name = response?.username || "";

      set({
        name,
        isLoggedIn: true,
      });

      if (data.email && data.password) {
        const loginResponse = await useAuthApi.login({
          email: data.email,
          password: data.password,
        });

        const loginName = loginResponse?.username || name;
        set({
          name: loginName,
          isLoggedIn: true,
        });

        return loginResponse;
      }

      return response;
    } catch (e) {
      console.error("Ошибка при регистрации или логине:", e);
      throw e;
    }
  },

  logout: async () => {
    try {
      await useAuthApi.logout();
      set({
        name: "",
        isLoggedIn: false,
      });
    } catch (e) {
      throw e;
    }
  },

  refreshToken: async () => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }
    set({
      isLoggedIn:true,
    })
    console.log("ok")
  } catch (e) {
    console.error("Refresh token failed", e);
    throw e;
  }
},

}));
