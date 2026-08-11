import { useEffect } from "react";
import { useAuthStore } from "@stores/authStore";
import { useUserStore } from "@stores/userStore";

/**
 * Subscribes to Firebase auth state on mount and keeps the user profile
 * store in sync whenever the authenticated user changes.
 * Call this once, near the root of the app (see app/_layout.tsx).
 */
export function useAuthListener() {
  const initialize = useAuthStore((s) => s.initialize);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const loadProfile = useUserStore((s) => s.loadProfile);
  const resetUser = useUserStore((s) => s.reset);

  useEffect(() => {
    const unsubscribe = initialize();
    return unsubscribe;
  }, [initialize]);

  useEffect(() => {
    if (firebaseUser) {
      loadProfile(firebaseUser.uid);
    } else {
      resetUser();
    }
  }, [firebaseUser, loadProfile, resetUser]);
}

export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const errorMessage = useAuthStore((s) => s.errorMessage);
  const login = useAuthStore((s) => s.login);
  const signup = useAuthStore((s) => s.signup);
  const logout = useAuthStore((s) => s.logout);
  const forgotPassword = useAuthStore((s) => s.forgotPassword);
  const clearError = useAuthStore((s) => s.clearError);

  return {
    status,
    firebaseUser,
    errorMessage,
    isAuthenticated: status === "authenticated",
    login,
    signup,
    logout,
    forgotPassword,
    clearError,
  };
}
