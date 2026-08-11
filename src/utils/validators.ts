export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

export function isPositiveNumber(value: number): boolean {
  return typeof value === "number" && !Number.isNaN(value) && value > 0;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateSignUpForm(name: string, email: string, password: string): ValidationResult {
  if (!isNonEmpty(name)) return { valid: false, error: "Name is required." };
  if (!isValidEmail(email)) return { valid: false, error: "Please enter a valid email address." };
  if (!isValidPassword(password)) return { valid: false, error: "Password must be at least 8 characters." };
  return { valid: true };
}
