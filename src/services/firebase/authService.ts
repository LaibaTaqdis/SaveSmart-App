import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./config";
import { createUserProfile } from "./firestoreService";
import { logger } from "@utils/logger";
import type { ApiError } from "@/types";

// ============================================
// Authentication Service
// Wraps Firebase Auth calls with consistent logging and error normalization.
// ============================================

function normalizeAuthError(error: any): ApiError {
  const code = error?.code ?? "auth/unknown";
  const messages: Record<string, string> = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 8 characters.",
    "auth/user-not-found": "Incorrect email or password.",
    "auth/wrong-password": "Incorrect email or password.",
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/network-request-failed": "You appear to be offline. Please check your connection.",
  };
  return { code, message: messages[code] ?? "Something went wrong. Please try again." };
}

export async function signUp(name: string, email: string, password: string): Promise<User> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    await updateProfile(credential.user, { displayName: name });
    await createUserProfile(credential.user.uid, name, email.trim());
    logger.info("AuthService", "User signed up successfully", { uid: credential.user.uid });
    return credential.user;
  } catch (error) {
    logger.error("AuthService", "Sign-up failed", error);
    throw normalizeAuthError(error);
  }
}

export async function logIn(email: string, password: string): Promise<User> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    logger.info("AuthService", "User logged in", { uid: credential.user.uid });
    return credential.user;
  } catch (error) {
    logger.error("AuthService", "Login failed", error);
    throw normalizeAuthError(error);
  }
}

export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
    logger.info("AuthService", "User logged out");
  } catch (error) {
    logger.error("AuthService", "Logout failed", error);
    throw normalizeAuthError(error);
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email.trim());
    logger.info("AuthService", "Password reset email sent", { email });
  } catch (error) {
    logger.error("AuthService", "Password reset failed", error);
    throw normalizeAuthError(error);
  }
}

export function subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
