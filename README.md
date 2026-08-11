# SaveSmart 💰

**A gamified personal savings and financial literacy app for young adults in Pakistan.**

SaveSmart combines AI-generated quizzes, daily savings challenges, a points/levels/badges gamification engine, and personalized AI saving tips to help young adults (18–30) build consistent, motivated saving habits — not just track transactions.

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
| AI Engine | Groq API — Llama 3.3 70B |
| Styling | NativeWind (Tailwind CSS for React Native) |
| Local Storage | AsyncStorage |
| Charts | react-native-chart-kit |

> ⚠️ **Expo Go version matters.** This project targets **Expo SDK 54**. Your installed Expo Go app must also support SDK 54 (check via Expo Go → Settings → App Info → Supported SDK). If you see *"Project is incompatible with this version of Expo Go"*, either update Expo Go from the Play Store/App Store, or ask to have this project re-aligned to whatever SDK your Expo Go currently supports.

---

## 📂 Project Structure

```
SaveSmart-App/
├── app/
│   ├── (auth)/               # Unauthenticated stack: login, signup, forgot-password
│   ├── (tabs)/                # Authenticated tabs: home, quiz, dashboard, leaderboard, profile
│   └── _layout.tsx            # Root layout — auth listener + route protection
├── src/
│   ├── components/            # Button, Input, Card, ProgressBar, BadgeChip, ScreenContainer
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
├── .env.example                 # Template for required environment variables
├── app.json                     # Expo configuration
├── tailwind.config.js            # NativeWind theme (navy / teal palette)
└── package.json
```

---

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+ and npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (`npx expo` — no global install required)
- A physical device with **Expo Go** installed, or an Android/iOS simulator

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

### 4. Get a Groq API key

1. Go to [console.groq.com/keys](https://console.groq.com/keys)
2. Sign in or create a free account
3. Click **Create API Key**, copy it
4. Paste it into `.env` as `EXPO_PUBLIC_GROQ_API_KEY`

### 5. Set up a Firebase project

1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **Add Project**
2. Once created, go to **Build → Authentication → Get Started** and enable the **Email/Password** sign-in method
3. Go to **Build → Firestore Database → Create Database** (start in production mode)
4. Deploy the included security rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init firestore   # point it at this project, choose firestore.rules
   firebase deploy --only firestore:rules
   ```
5. Go to **Project Settings → General → Your apps**, register a Web app, and copy the config values into `.env` (`EXPO_PUBLIC_FIREBASE_*`)
6. For native builds, also download:
   - `google-services.json` (Android) → place in `firebase/`
   - `GoogleService-Info.plist` (iOS) → place in `firebase/`

### 6. Run the app

```bash
npx expo start
```

Scan the QR code with Expo Go, or press `a` / `i` to launch an Android/iOS simulator.

---

## 🔐 Security Notice — Firebase Admin SDK Keys

**Never place a Firebase Admin SDK service account JSON file (e.g. `savesmartapp-...-firebase-adminsdk-....json`) anywhere in this project.** That file grants full administrative access to your Firebase project (bypassing all security rules) and is meant for trusted server-side code only — never for a mobile client app, and never committed to a repo or shared in a zip.

This app only ever needs the **public, client-side Firebase Web config** (`EXPO_PUBLIC_FIREBASE_*` in `.env`) and the two platform config files (`google-services.json` / `GoogleService-Info.plist`), which are safe to bundle because they don't grant admin privileges.

If an Admin SDK key was ever generated or shared for this project, go to **Firebase Console → Project Settings → Service Accounts → Manage Service Account Permissions**, find the corresponding key, and **delete/revoke it immediately**, then generate a fresh one only if you actually need server-side admin access (e.g. for a separate backend, not this app).

---

## 🧠 AI Integration

The `src/services/api/groqService.ts` module handles two core AI features:

- **`generateQuiz()`** — Zero-shot prompting that instructs Llama 3.3 70B to return a strict JSON array of multiple-choice questions. Falls back to a cached quiz (or bundled default questions in `fallbackData.ts`) if the API fails or times out.
- **`generatePersonalizedTip()`** — Role-based prompting that frames the model as a supportive financial coach, using the user's recent activity as context. Falls back to a cached or randomly selected default tip on failure.

All Groq requests go through `groqClient.ts`, which enforces an 8-second timeout and normalizes errors into a `GroqApiError`.

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
- `firestore.rules` restricts each user to reading/writing only their own documents (see file for full rules).
- `google-services.json` / `GoogleService-Info.plist` and `.env` are excluded via `.gitignore`.

---

## 🗺️ Architecture Diagram

For the full system architecture diagram (Mobile App Layer, Firebase Backend, AI Layer, Notification Service, and data flow), see the accompanying project planning document: `SaveSmart_Project_Planning_Document.docx` / the architecture section of the final project report submitted alongside this codebase.

---

## 📌 Known Limitations / Next Steps

- Google Sign-In is scaffolded via the `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` env variable but requires platform-specific native configuration (see [`expo-auth-session` Google guide](https://docs.expo.dev/guides/google-authentication/)) to fully enable.
- PDF report export in `profile.tsx` is stubbed with a placeholder — wire it to a PDF-generation library (e.g. `expo-print` + `expo-sharing`) to produce a real downloadable file.
- Push notifications (daily reminders) are described in the architecture but not yet wired to `expo-notifications` in this codebase — see the project report's Sprint 3 plan for the intended implementation approach.

---

## 📄 License

This project was built as a university final project submission and is provided as-is for academic purposes.
