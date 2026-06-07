import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuthState, User } from "../types";
import { demoUser } from "../data/mockData";

type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Demo login — replace with real API call later
  const login = async (email: string, _password: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 800)); // simulate network
    if (email) {
      const user: User = { ...demoUser, email };
      setState({ user, token: "demo-token", isAuthenticated: true });
      return true;
    }
    return false;
  };

  const register = async (
    name: string,
    email: string,
    _password: string,
  ): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 900));
    if (name && email) {
      const user: User = { ...demoUser, name, email };
      setState({ user, token: "demo-token", isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () =>
    setState({ user: null, token: null, isAuthenticated: false });

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
