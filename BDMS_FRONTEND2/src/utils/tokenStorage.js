// Centralized localStorage access for auth state, so components never touch
// localStorage directly (keeps storage keys and shape in one place).

const ACCESS_TOKEN_KEY = "bdms_access_token";
const REFRESH_TOKEN_KEY = "bdms_refresh_token";
const USER_KEY = "bdms_user";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isAuthenticated() {
  return !!getAccessToken();
}

export function getUserRole() {
  const user = getStoredUser();
  return user?.role ?? null;
}

export function isAdmin() {
  return getUserRole() === "ADMIN";
}

export function isDonor() {
  return getUserRole() === "DONOR";
}

export function isHospital() {
  return getUserRole() === "HOSPITAL";
}

export function updateStoredUser(updatedUser) {
  setStoredUser(updatedUser);
}
