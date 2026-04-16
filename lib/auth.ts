export const AUTH_KEY = "isLoggedIn";
const HARDCODED_USERNAME = "admin";
const HARDCODED_PASSWORD = "salik123";

export function login(username: string, password: string): boolean {
  if (username === HARDCODED_USERNAME && password === HARDCODED_PASSWORD) {
    localStorage.setItem(AUTH_KEY, "true");
    return true;
  }
  return false;
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(AUTH_KEY) === "true";
}
