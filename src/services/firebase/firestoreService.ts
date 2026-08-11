import {
  doc, setDoc, getDoc, updateDoc, collection, addDoc, query,
  orderBy, limit, getDocs, serverTimestamp, increment, where,
} from "firebase/firestore";
import { db } from "./config";
import { logger } from "@utils/logger";
import { calculateLevel, evaluateNewBadges, updateStreak } from "@utils/gamification";
import type { UserProfile, SavingsEntry, LeaderboardEntry, QuizAttempt } from "@/types";

// ============================================
// Firestore Service
// All reads/writes to Firestore go through this module — screens never
// call the Firestore SDK directly, keeping data access centralized.
// ============================================

const USERS_COLLECTION = "users";
const SAVINGS_COLLECTION = "savingsEntries";
const QUIZ_ATTEMPTS_COLLECTION = "quizAttempts";

export async function createUserProfile(uid: string, name: string, email: string): Promise<void> {
  const profile: Omit<UserProfile, "uid"> = {
    name,
    email,
    points: 0,
    level: 1,
    badges: [],
    currentStreak: 0,
    longestStreak: 0,
    lastChallengeCompletedAt: null,
    createdAt: new Date().toISOString(),
    role: "user",
  };
  await setDoc(doc(db, USERS_COLLECTION, uid), profile);
  logger.info("FirestoreService", "Created user profile", { uid });
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, USERS_COLLECTION, uid));
  if (!snap.exists()) {
    logger.warn("FirestoreService", "User profile not found", { uid });
    return null;
  }
  return { uid, ...(snap.data() as Omit<UserProfile, "uid">) };
}

export async function awardPoints(uid: string, pointsToAdd: number): Promise<UserProfile> {
  const userRef = doc(db, USERS_COLLECTION, uid);
  await updateDoc(userRef, { points: increment(pointsToAdd) });

  const updated = await getUserProfile(uid);
  if (!updated) throw new Error("User profile disappeared after point award");

  const newLevel = calculateLevel(updated.points);
  if (newLevel !== updated.level) {
    await updateDoc(userRef, { level: newLevel });
    updated.level = newLevel;
    logger.info("FirestoreService", "User leveled up", { uid, newLevel });
  }

  const newBadges = evaluateNewBadges(updated, {});
  if (newBadges.length > 0) {
    await updateDoc(userRef, { badges: [...updated.badges, ...newBadges] });
    updated.badges = [...updated.badges, ...newBadges];
  }

  return updated;
}

export async function recordChallengeCompletion(uid: string, pointsReward: number): Promise<UserProfile> {
  const profile = await getUserProfile(uid);
  if (!profile) throw new Error("User profile not found");

  const newStreak = updateStreak(profile.lastChallengeCompletedAt, profile.currentStreak);
  const longestStreak = Math.max(newStreak, profile.longestStreak);

  await updateDoc(doc(db, USERS_COLLECTION, uid), {
    currentStreak: newStreak,
    longestStreak,
    lastChallengeCompletedAt: new Date().toISOString(),
  });

  return awardPoints(uid, pointsReward);
}

export async function logSavingsEntry(uid: string, amount: number, note: string): Promise<void> {
  await addDoc(collection(db, SAVINGS_COLLECTION), {
    userId: uid,
    amount,
    note,
    createdAt: serverTimestamp(),
  } satisfies Omit<SavingsEntry, "id" | "createdAt"> & { createdAt: unknown });
  logger.info("FirestoreService", "Logged savings entry", { uid, amount });
}

export async function getSavingsHistory(uid: string): Promise<SavingsEntry[]> {
  const q = query(
    collection(db, SAVINGS_COLLECTION),
    where("userId", "==", uid),
    orderBy("createdAt", "desc"),
    limit(50)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<SavingsEntry, "id">) }));
}

export async function saveQuizAttempt(attempt: Omit<QuizAttempt, "id">): Promise<void> {
  await addDoc(collection(db, QUIZ_ATTEMPTS_COLLECTION), attempt);
  logger.info("FirestoreService", "Saved quiz attempt", { userId: attempt.userId, score: attempt.score });
}

export async function getLeaderboard(topN: number = 20): Promise<LeaderboardEntry[]> {
  const q = query(collection(db, USERS_COLLECTION), orderBy("points", "desc"), limit(topN));
  const snap = await getDocs(q);
  return snap.docs.map((d, index) => {
    const data = d.data() as UserProfile;
    return { uid: d.id, name: data.name, points: data.points, level: data.level, rank: index + 1 };
  });
}
