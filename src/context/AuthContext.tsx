import { createContext, useContext, useState, type ReactNode } from "react";

const ADMIN_USER = "GUERNICAMOTORS";
const ADMIN_PASS = "12345";
const SESSION_KEY = "guernica_admin_session";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });

  function login(user: string, pass: string): boolean {
    if (user === ADMIN_USER && pass === ADMIN_PASS) {
      try {
        localStorage.setItem(SESSION_KEY, "1");
      } catch { /* ignore storage errors */ }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
