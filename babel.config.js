module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    // NOTE: Do NOT add "react-native-reanimated/plugin" manually here.
    // Starting with Expo SDK 54 + Reanimated v4, babel-preset-expo
    // automatically configures the required react-native-worklets/plugin.
    // Adding it manually causes a "Duplicate plugin/preset detected" build error.
    plugins: [],
  };
};
