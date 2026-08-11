const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Firebase JS SDK's auth persistence (getReactNativePersistence) relies on
// CommonJS resolution that Metro's newer "package exports" support breaks on
// Expo SDK 53+ with Hermes — it causes initializeAuth() to hang or crash
// silently instead of resolving, which freezes the app on the splash screen.
config.resolver.unstable_enablePackageExports = false;
config.resolver.sourceExts.push("cjs");

module.exports = withNativeWind(config, { input: "./global.css" });
