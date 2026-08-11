export const STRINGS = {
  appName: "SaveSmart",
  tagline: "Save smart. Learn fast. Level up.",
  errors: {
    genericAuth: "Something went wrong. Please try again.",
    invalidEmail: "Please enter a valid email address.",
    weakPassword: "Password must be at least 8 characters.",
    emailInUse: "An account with this email already exists.",
    wrongCredentials: "Incorrect email or password.",
    network: "You appear to be offline. Please check your connection.",
    aiUnavailable: "AI service is temporarily unavailable. Showing a cached quiz instead.",
  },
  gamification: {
    levelUp: "Level Up! You've reached Level",
    badgeEarned: "New Badge Earned:",
    streakLost: "Your streak was reset — every day is a fresh start!",
  },
} as const;
