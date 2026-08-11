import { create } from "zustand";
import type { UserProfile, SavingsEntry } from "@/types";
import {
  getUserProfile, awardPoints, recordChallengeCompletion,
  logSavingsEntry, getSavingsHistory,
} from "@services/firebase/firestoreService";
import { logger } from "@utils/logger";

interface UserState {
  profile: UserProfile | null;
  savingsHistory: SavingsEntry[];
  isLoading: boolean;

  loadProfile: (uid: string) => Promise<void>;
  addPoints: (uid: string, points: number) => Promise<void>;
  completeChallenge: (uid: string, pointsReward: number) => Promise<void>;
  addSavingsEntry: (uid: string, amount: number, note: string) => Promise<void>;
  loadSavingsHistory: (uid: string) => Promise<void>;
  reset: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  profile: null,
  savingsHistory: [],
  isLoading: false,

  loadProfile: async (uid) => {
    set({ isLoading: true });
    try {
      const profile = await getUserProfile(uid);
      set({ profile, isLoading: false });
    } catch (error) {
      logger.error("UserStore", "Failed to load profile", error);
      set({ isLoading: false });
    }
  },

  addPoints: async (uid, points) => {
    const updated = await awardPoints(uid, points);
    set({ profile: updated });
  },

  completeChallenge: async (uid, pointsReward) => {
    const updated = await recordChallengeCompletion(uid, pointsReward);
    set({ profile: updated });
  },

  addSavingsEntry: async (uid, amount, note) => {
    // The write and the history refresh are two separate Firestore calls.
    // If only the refresh fails (e.g. a missing index), the entry was still
    // saved — don't let that surface as "could not log your entry".
    await logSavingsEntry(uid, amount, note);
    try {
      await get().loadSavingsHistory(uid);
    } catch (error) {
      logger.error("UserStore", "Entry saved, but failed to refresh history", error);
    }
  },

  loadSavingsHistory: async (uid) => {
    const history = await getSavingsHistory(uid);
    set({ savingsHistory: history });
  },

  reset: () => set({ profile: null, savingsHistory: [], isLoading: false }),
}));
