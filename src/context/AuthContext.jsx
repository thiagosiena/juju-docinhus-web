import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const isAuthenticated = !!token;

  function login(newToken) {
    setToken(newToken);
    localStorage.setItem("token", newToken);
    localStorage.setItem("adminAuth", "true");
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("adminAuth");
  }

  const value = useMemo(
    () => ({
      token,
      isAuthenticated,
      login,
      logout,
    }),
    [token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
