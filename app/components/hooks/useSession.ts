"use client";
import { useEffect, useState, useCallback } from "react";

export interface SessionUser {
  id: string;
  email: string;
  forename?: string;
  surname?: string;
}

interface UseSessionOptions {
  refreshOnFocus?: boolean;
  refreshIntervalMs?: number; // optional polling for demo
}

export function useSession(options: UseSessionOptions = {}) {
  const { refreshOnFocus = true, refreshIntervalMs } = options;
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/me", { cache: "no-store" });
      const data = await res.json();
      setUser(data.user || null);
    } catch (e: any) {
      setError(e.message || "Failed to load session");
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    await fetch("/api/signout", { method: "POST" });
    setUser(null);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (refreshOnFocus) {
      const handler = () => load();
      window.addEventListener("focus", handler);
      return () => window.removeEventListener("focus", handler);
    }
  }, [refreshOnFocus, load]);

  useEffect(() => {
    if (refreshIntervalMs) {
      const id = setInterval(load, refreshIntervalMs);
      return () => clearInterval(id);
    }
  }, [refreshIntervalMs, load]);

  // optimistic update helper
  const updateUser = useCallback((partial: Partial<SessionUser>) => {
    setUser((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  return { user, loading, error, refresh: load, signOut, isAuthenticated: !!user, updateUser };
}
