# SaveSmart 💰

**A gamified personal savings and financial literacy app for young adults in Pakistan.**

SaveSmart combines AI-generated quizzes, daily savings challenges, a points/levels/badges gamification engine, and personalized AI saving tips to help young adults (18–30) build consistent, motivated saving habits, not just track transactions.

> **Project Formula:** Domain: Finance · Application Type: Gamified · Tech Stack: React Native + Expo

---

## 📱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React Native + Expo (**SDK 54**) |
| Language | TypeScript |
| Navigation | Expo Router (file-based routing) |
| State Management | Zustand |
| Backend / Auth | Firebase Authentication |
| Database | Firebase Firestore |
| AI Engine | Groq API — Llama 3.3 70B (`llama-3.3-70b-versatile`) |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Local Storage | AsyncStorage |
| Charts | react-native-chart-kit |

> ⚠️ **Expo Go version matters.** This project targets **Expo SDK 54**. Your installed Expo Go app must also support SDK 54 (check via Expo Go → Settings → App Info → Supported SDK). If you see *"Project is incompatible with this version of Expo Go"*, either update Expo Go from the Play Store/App Store, or align the project to whatever SDK your Expo Go currently supports.

---

## 📂 Project Structure

```
SaveSmart-App/
├── app/
│   ├── (auth)/                 # Unauthenticated stack: login, signup, forgot-password
│   ├── (tabs)/                 # Authenticated tabs: home, quiz, dashboard, leaderboard, profile
│   └── _layout.tsx             # Root layout — auth listener + route protection
├── src/
│   ├── components/             # Button, Input, Card, ProgressBar, BadgeChip, ScreenContainer
│   ├── services/
│   │   ├── api/                # Groq API client, service, and fallback data
│   │   ├── firebase/           # Firebase config, auth service, Firestore service
│   │   └── storage/            # AsyncStorage wrapper
│   ├── stores/                 # Zustand stores: authStore, userStore, quizStore
│   ├── constants/               # colors.ts, theme.ts, strings.ts
│   ├── types/                   # Shared TypeScript interfaces
│   ├── utils/                   # validators, formatters, gamification engine, logger
│   └── hooks/                   # useAuth, useGamification, useQuiz
├── firebase/                    # Place google-services.json / GoogleService-Info.plist here
├── firestore.rules              # Firestore security rules (deploy via Firebase CLI)
├── firestore.indexes.json       # Firestore composite index definitions
├── .env.example                 # Template for required environment variables
├── app.json                     # Expo configuration
├── tailwind.config.js           # NativeWind theme (navy / teal palette)
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ and npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo` — no global install required)
- A physical device with **Expo Go** installed, or an Android/iOS simulator
- A free [Groq](https://console.groq.com/) account and a free [Firebase](https://console.firebase.google.com/) account

### 2. Install dependencies

```bash
cd SaveSmart-App
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your own keys:

```bash
cp .env.example .env
```

`.env` is already listed in `.gitignore` — never commit it.

### 4. Get a Groq API key

1. Go to [console.groq.com](https://console.groq.com/) and sign in or create a free account.
2. In the left sidebar, open **API Keys**.
3. Click **Create API Key**, give it a name (e.g. `savesmart-dev`), and copy the key immediately — it's only shown once.
4. Paste it into `.env` as `EXPO_PUBLIC_GROQ_API_KEY`.
5. Leave `EXPO_PUBLIC_GROQ_MODEL` as `llama-3.3-70b-versatile` and `EXPO_PUBLIC_GROQ_API_URL` as `https://api.groq.com/openai/v1/chat/completions` unless you have a reason to change them.

### 5. Set up a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**. Give it a name (e.g. `savesmart-app`) and finish the creation wizard.
2. **Enable Authentication:** go to **Build → Authentication → Get Started**, open the **Sign-in method** tab, and enable **Email/Password**.
3. **Create the database:** go to **Build → Firestore Database → Create Database**. Start in **production mode** and pick a region close to your users.
4. **Deploy the included security rules and indexes:**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # select this project, point it at firestore.rules and firestore.indexes.json
   firebase deploy --only firestore:rules,firestore:indexes
   ```
5. **Register a Web app** to get your client config: go to **Project Settings (⚙️) → General → Your apps → Add app → Web (</>)**. Copy the generated config values into `.env`:
   - `apiKey` → `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `EXPO_PUBLIC_FIREBASE_APP_ID`
6. **For native builds**, also register Android/iOS apps under **Your apps** (matching the bundle identifiers in `app.json`: `com.savesmart.app`) and download:
   - `google-services.json` (Android) → place in `firebase/`
   - `GoogleService-Info.plist` (iOS) → place in `firebase/`

   Both are already excluded via `.gitignore` and referenced in `app.json` under `expo.android.googleServicesFile` / `expo.ios.googleServicesFile`.

### 6. Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` in the terminal to launch an Android/iOS simulator.

---

## 🔑 Environment Variables

All variables are prefixed `EXPO_PUBLIC_` so Expo exposes them to client code at build time. Copy `.env.example` to `.env` and fill in the values below.

| Variable | Required | Description |
|---|---|---|
| `EXPO_PUBLIC_GROQ_API_KEY` | ✅ | Your personal Groq API key from [console.groq.com/keys](https://console.groq.com/keys) |
| `EXPO_PUBLIC_GROQ_MODEL` | Optional | Groq model ID (defaults to `llama-3.3-70b-versatile` in code if unset) |
| `EXPO_PUBLIC_GROQ_API_URL` | Optional | Groq chat completions endpoint (defaults to `https://api.groq.com/openai/v1/chat/completions` if unset) |
| `EXPO_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase Web app API key |
| `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase Auth domain (`<project-id>.firebaseapp.com`) |
| `EXPO_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase Cloud Storage bucket |
| `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase Cloud Messaging sender ID |
| `EXPO_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase Web app ID |
| `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` | Optional | Web client ID for Google Sign-In (scaffolded but requires additional native setup — see [Known Limitations](#-known-limitations--next-steps)) |

The app is designed to fail gracefully: if `EXPO_PUBLIC_GROQ_API_KEY` is missing, AI calls throw a `GroqApiError` and calling code falls back to cached/bundled content instead of crashing. If any `EXPO_PUBLIC_FIREBASE_*` variable is missing, a warning is logged at startup.

---

## 🔐 Security Notice — Firebase Admin SDK Keys

**Never place a Firebase Admin SDK service account JSON file (e.g. `savesmartapp-...-firebase-adminsdk-....json`) anywhere in this project.** That file grants full administrative access to your Firebase project (bypassing all security rules) and is meant for trusted server-side code only — never for a mobile client app, and never committed to a repo or shared in a zip.

This app only ever needs the **public, client-side Firebase Web config** (`EXPO_PUBLIC_FIREBASE_*` in `.env`) and the two platform config files (`google-services.json` / `GoogleService-Info.plist`), which are safe to bundle because they don't grant admin privileges.

If an Admin SDK key was ever generated or shared for this project, go to **Firebase Console → Project Settings → Service Accounts → Manage Service Account Permissions**, find the corresponding key, and **delete/revoke it immediately**, then generate a fresh one only if you actually need server-side admin access (e.g. for a separate backend, not this app).

---

## 🧠 AI Integration

`src/services/api/groqClient.ts` is the low-level HTTP client: it reads `EXPO_PUBLIC_GROQ_API_KEY`/`_MODEL`/`_API_URL`, enforces an **8-second timeout** via `AbortController`, and normalizes all failures into a `GroqApiError`.

`src/services/api/groqService.ts` builds on top of it for two core features:

- **`generateQuiz()`** — zero-shot prompting that instructs Llama 3.3 70B to return a strict JSON array of multiple-choice questions. Falls back to a cached quiz or the bundled defaults in `fallbackData.ts` if the API fails or times out.
- **`generatePersonalizedTip()`** — role-based prompting that frames the model as a supportive financial coach, using the user's recent activity as context. Falls back to a cached or randomly selected default tip on failure.

---

## 🏆 Gamification Engine

Implemented in `src/utils/gamification.ts` as pure, testable functions:

- `calculateLevel(points)` — maps cumulative points to a level using defined thresholds
- `calculateQuizPoints(correct, total)` — awards points per correct answer plus a perfect-score bonus
- `evaluateNewBadges(profile, context)` — checks milestone conditions and returns any newly earned badges
- `updateStreak(lastCompletedAt, currentStreak)` — increments, preserves, or resets a user's daily streak

These are called from `firestoreService.ts` whenever points are awarded or a challenge is completed, keeping business logic decoupled from the database layer.

---

## 🔒 Security Notes

- Firebase credentials and the Groq API key are read from environment variables only — never hard-coded.
- `firestore.rules` restricts each user to reading/writing only their own documents (see the file for full rules).
- `google-services.json`, `GoogleService-Info.plist`, and `.env` are all excluded via `.gitignore`.

---

## 🗺️ Architecture Diagram

For the full system architecture diagram (Mobile App Layer, Firebase Backend, AI Layer, Notification Service, and data flow), see the accompanying project planning document / the architecture section of the final project report submitted alongside this codebase.

---

## 📌 Known Limitations / Next Steps

- **Google Sign-In** is scaffolded via the `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` env variable but requires platform-specific native configuration (see the [`expo-auth-session` Google guide](https://docs.expo.dev/guides/google-authentication/)) to fully enable.
- **PDF report export** in `profile.tsx` is stubbed with a placeholder — wire it to a PDF-generation library (e.g. `expo-print` + `expo-sharing`) to produce a real downloadable file.
- **Push notifications** (daily reminders) are described in the architecture but not yet wired to `expo-notifications` — see the project report's Sprint 3 plan for the intended implementation approach.

---

## 📄 License

MIT License

Copyright (c) 2026 Laiba Taqdis
Riphah International University
Generative AI in Software Development – Final Project

Permission is hereby granted..
