"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  refreshAuthState: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(Boolean(auth));
  const refreshRequestRef = useRef(0);

  const refreshAuthState = useCallback(async () => {
    const requestId = ++refreshRequestRef.current;
    const nextUser = auth?.currentUser ?? null;
    setUser(nextUser);

    if (!nextUser) {
      if (requestId === refreshRequestRef.current) {
        setIsAdmin(false);
        setIsLoading(false);
      }
      return;
    }

    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      let session = response.ok ? await response.json() : null;
      if (session?.isAuthenticated !== true) {
        const sessionResponse = await fetch("/api/auth/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ idToken: await nextUser.getIdToken(true) }),
        });
        session = sessionResponse.ok ? await sessionResponse.json() : null;
      }
      if (requestId === refreshRequestRef.current) setIsAdmin(session?.isAdmin === true);
    } catch {
      if (requestId === refreshRequestRef.current) setIsAdmin(false);
    }
    if (requestId === refreshRequestRef.current) setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(auth, () => void refreshAuthState());
  }, [refreshAuthState]);

  return <AuthContext.Provider value={{ user, isAdmin, isLoading, refreshAuthState }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
