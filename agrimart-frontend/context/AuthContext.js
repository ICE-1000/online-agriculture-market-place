'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api, getToken, setToken } from '@/lib/api';

const AuthContext = createContext(null);
const VIEW_MODE_KEY = 'agrimart_view_mode';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('consumer');

  const loadMe = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await api.me();
      setUser(me);
      const storedMode =
        typeof window !== 'undefined' ? localStorage.getItem(VIEW_MODE_KEY) : null;
      setViewMode(storedMode || me.role || 'consumer');
    } catch (err) {
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = useCallback(async (username, password) => {
    const result = await api.login({ username, password });
    setToken(result.token);
    setUser(result.user);
    setViewMode(result.user.role || 'consumer');
    if (typeof window !== 'undefined') {
      localStorage.setItem(VIEW_MODE_KEY, result.user.role || 'consumer');
    }
    return result.user;
  }, []);

  const register = useCallback(async (payload) => {
    return api.register(payload);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    if (typeof window !== 'undefined') localStorage.removeItem(VIEW_MODE_KEY);
  }, []);

  // "Simulation" toggle from Settings. The backend blocks real role changes
  // (userController.updateProfile rejects a `role` field), so this only
  // switches which navigation/home layout is shown locally.
  const switchViewMode = useCallback(() => {
    setViewMode((prev) => {
      const next = prev === 'farmer' ? 'consumer' : 'farmer';
      if (typeof window !== 'undefined') localStorage.setItem(VIEW_MODE_KEY, next);
      return next;
    });
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await api.me();
      setUser(me);
    } catch (err) {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      viewMode,
      isFarmer: viewMode === 'farmer',
      login,
      register,
      logout,
      switchViewMode,
      refreshUser,
    }),
    [user, loading, viewMode, login, register, logout, switchViewMode, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
