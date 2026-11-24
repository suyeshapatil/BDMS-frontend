import { createContext, useState, useEffect, useCallback } from "react";
import authApi from "../api/authApi";
import {
  getAccessToken,
  getStoredUser,
  setTokens,
  setStoredUser,
  clearAuthStorage,
} from "../utils/tokenStorage";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser());
  const [isInitializing, setIsInitializing] = useState(true);

  // Auto-login: if a token + user already exist in storage, restore the session
  // without requiring the person to log in again on every page refresh.
  useEffect(() => {
    const token = getAccessToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
    }
    setIsInitializing(false);
  }, []);

  const persistSession = useCallback((authResponse) => {
    const { accessToken, refreshToken, ...userInfo } = authResponse;
    setTokens(accessToken, refreshToken);
    setStoredUser(userInfo);
    setUser(userInfo);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const response = await authApi.login(credentials);
      persistSession(response.data.data);
      return response.data.data;
    },
    [persistSession],
  );

  const register = useCallback(
    async (payload) => {
      const response = await authApi.register(payload);
      persistSession(response.data.data);
      return response.data.data;
    },
    [persistSession],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Logout is a client-side token discard regardless of API outcome.
    } finally {
      clearAuthStorage();
      setUser(null);
    }
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isInitializing,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
