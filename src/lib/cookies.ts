import Cookies from "js-cookie";
import type { TUser } from "@/types/models/user";

const TOKEN_KEY = "user_token";
const USER_KEY = "user_data";

// Cookie options
const cookieOptions = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production", // Only secure in production
  sameSite: "lax" as const,
};

export const cookieManager = {
  // Token management
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, cookieOptions);
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  removeToken: () => {
    Cookies.remove(TOKEN_KEY);
  },

  // User data management
  setUser: (user: TUser) => {
    Cookies.set(USER_KEY, JSON.stringify(user), cookieOptions);
  },

  getUser: (): TUser | null => {
    const userData = Cookies.get(USER_KEY);
    if (!userData) return null;

    try {
      return JSON.parse(userData) as TUser;
    } catch (error) {
      console.error("Error parsing user data from cookies:", error);
      return null;
    }
  },

  removeUser: () => {
    Cookies.remove(USER_KEY);
  },

  // Clear all auth data
  clearAuth: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(USER_KEY);
  },
};
