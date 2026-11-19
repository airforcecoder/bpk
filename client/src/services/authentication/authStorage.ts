const AUTH_KEY = "admin_authenticated";

export function loginUser(): void {
  localStorage.setItem(AUTH_KEY, "true");
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isAuthenticated(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}