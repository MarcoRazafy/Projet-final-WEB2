import React from "react";

const AuthContext = React.createContext(null);
export const useAuth = () => React.useContext(AuthContext);

/** Gère l'utilisateur connecté (stocké dans localStorage pour la démo) */
export function AuthProvider({ children }) {
  const [user, setUser] = React.useState(() => {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (email) => {
    const u = { email };
    setUser(u);
    localStorage.setItem("auth_user", JSON.stringify(u));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}
