import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, type Auth } from "firebase/auth";
// `getReactNativePersistence` is resolved at runtime via Metro's "react-native"
// package.json field, so it isn't visible to tsc's standard Node module
// resolution. This is a known Firebase JS SDK + Expo/Metro quirk.
// @ts-ignore — resolved correctly by Metro bundler at build/runtime
import { getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@utils/logger";

// ============================================
// Firebase Initialization
// Reads configuration from environment variables (see .env.example).
// Never hard-code Firebase credentials directly in source files.
// ============================================

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

if (missingKeys.length > 0) {
  logger.warn("FirebaseConfig", "Missing Firebase environment variables", missingKeys);
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let authInstance: Auth;
try {
  authInstance = initializeAuth(firebaseApp, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  // initializeAuth throws if called more than once (e.g., during Fast Refresh).
  // Logged rather than swallowed so any other cause (e.g. a Metro/module
  // resolution issue) is visible instead of failing silently.
  logger.warn("FirebaseConfig", "initializeAuth failed, falling back to getAuth", error);
  const { getAuth } = require("firebase/auth");
  authInstance = getAuth(firebaseApp);
}

export const auth = authInstance;
export const db = getFirestore(firebaseApp);

logger.info("FirebaseConfig", "Firebase initialized", { projectId: firebaseConfig.projectId });
