"use client";

import { onAuthStateChanged, type User } from "firebase/auth";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { auth } from "@/lib/firebase";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(auth));

  useEffect(() => {
    if (!auth) {
      return;
    }

    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  return <AuthContext.Provider value={{ user, isLoading }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
