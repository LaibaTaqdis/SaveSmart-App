import AsyncStorage from "@react-native-async-storage/async-storage";
import { logger } from "@utils/logger";

// ============================================
// AsyncStorage Wrapper
// Provides typed get/set/remove helpers with JSON serialization and
// consistent error handling so screens never touch AsyncStorage directly.
// ============================================

export const STORAGE_KEYS = {
  ONBOARDING_SEEN: "savesmart:onboardingSeen",
  LAST_SCREEN: "savesmart:lastScreen",
  CACHED_QUIZ: "savesmart:cachedQuiz",
  CACHED_TIP: "savesmart:cachedTip",
} as const;

export async function setItem<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    logger.error("AsyncStorageService", `Failed to set item: ${key}`, error);
  }
}

export async function getItem<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch (error) {
    logger.error("AsyncStorageService", `Failed to get item: ${key}`, error);
    return null;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    logger.error("AsyncStorageService", `Failed to remove item: ${key}`, error);
  }
}
