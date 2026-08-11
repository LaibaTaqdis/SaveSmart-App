import { create } from "zustand";
import type { User } from "firebase/auth";
import type { AuthStatus } from "@/types";
import { subscribeToAuthChanges, logIn, logOut, signUp, resetPassword } from "@services/firebase/authService";
import { logger } from "@utils/logger";

interface AuthState {
  firebaseUser: User | null;
  status: AuthStatus;
  errorMessage: string | null;

  initialize: () => () => void; // returns unsubscribe function
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  status: "idle",
  errorMessage: null,

  initialize: () => {
    set({ status: "loading" });
    const unsubscribe = subscribeToAuthChanges((user) => {
      set({
        firebaseUser: user,
        status: user ? "authenticated" : "unauthenticated",
      });
      logger.info("AuthStore", "Auth state changed", { authenticated: !!user });
    });
    return unsubscribe;
  },

  login: async (email, password) => {
    set({ status: "loading", errorMessage: null });
    try {
      const user = await logIn(email, password);
      set({ firebaseUser: user, status: "authenticated" });
    } catch (error: any) {
      set({ status: "error", errorMessage: error?.message ?? "Login failed" });
      throw error;
    }
  },

  signup: async (name, email, password) => {
    set({ status: "loading", errorMessage: null });
    try {
      const user = await signUp(name, email, password);
      set({ firebaseUser: user, status: "authenticated" });
    } catch (error: any) {
      set({ status: "error", errorMessage: error?.message ?? "Sign up failed" });
      throw error;
    }
  },

  logout: async () => {
    await logOut();
    set({ firebaseUser: null, status: "unauthenticated" });
  },

  forgotPassword: async (email) => {
    try {
      await resetPassword(email);
    } catch (error: any) {
      set({ errorMessage: error?.message ?? "Password reset failed" });
      throw error;
    }
  },

  clearError: () => set({ errorMessage: null }),
}));
