import "../global.css";
import React, { useEffect } from "react";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useAuthListener } from "@hooks/useAuth";
import { useAuthStore } from "@stores/authStore";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* no-op if already hidden */
});

/**
 * Root layout — mounts the global auth listener and redirects users
 * between the (auth) and (tabs) route groups based on authentication state.
 */
export default function RootLayout() {
  useAuthListener();
  const status = useAuthStore((s) => s.status);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (status === "idle" || status === "loading") return;

    const inAuthGroup = segments[0] === "(auth)";

    if (status === "authenticated" && inAuthGroup) {
      router.replace("/(tabs)/home");
    } else if (status === "unauthenticated" && !inAuthGroup) {
      router.replace("/(auth)/login");
    }

    SplashScreen.hideAsync().catch(() => {});
  }, [status, segments, router]);

  return (
    <>
      <StatusBar style="light" backgroundColor="#0B1E3D" />
      <Slot />
    </>
  );
}
