// ============================================
// Standardized console logger for SaveSmart
// Usage: logger.info("AuthService", "User logged in", { uid })
// ============================================

type LogLevel = "INFO" | "WARN" | "ERROR" | "DEBUG";

function log(level: LogLevel, scope: string, message: string, meta?: unknown) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}] [${scope}]`;

  switch (level) {
    case "ERROR":
      console.error(prefix, message, meta ?? "");
      break;
    case "WARN":
      console.warn(prefix, message, meta ?? "");
      break;
    case "DEBUG":
      if (__DEV__) console.debug(prefix, message, meta ?? "");
      break;
    default:
      console.log(prefix, message, meta ?? "");
  }
}

export const logger = {
  info: (scope: string, message: string, meta?: unknown) => log("INFO", scope, message, meta),
  warn: (scope: string, message: string, meta?: unknown) => log("WARN", scope, message, meta),
  error: (scope: string, message: string, meta?: unknown) => log("ERROR", scope, message, meta),
  debug: (scope: string, message: string, meta?: unknown) => log("DEBUG", scope, message, meta),
};
