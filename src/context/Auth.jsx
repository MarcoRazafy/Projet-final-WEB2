import React from "react";

const AuthContext = React.createContext(null);
export const useAuth = () => React.useContext(AuthContext);

// helpers
const norm = (v) => String(v ?? "").trim().toLowerCase();

export function AuthProvider({ children }) {
  const [users, setUsers] = React.useState(() => {
    const raw = localStorage.getItem("auth_users");
    return raw ? JSON.parse(raw) : [];
  });
  const [user, setUser] = React.useState(() => {
    const raw = localStorage.getItem("auth_current");
    return raw ? JSON.parse(raw) : null;
  });

  // REGISTER (username obligatoire, email optionnel)
  const register = (payload) => {
    const username = norm(payload.user);
    if (!username) throw new Error("Nom d'utilisateur requis.");

    const existsUser = users.some((u) => norm(u.user) === username);
    if (existsUser) throw new Error("Ce nom d'utilisateur est déjà pris.");

    const email = (payload.email ?? "").trim();
    if (email) {
      const existsEmail = users.some((u) => norm(u.email) === norm(email));
      if (existsEmail) throw new Error("Un compte existe déjà avec cet email.");
    }

    if (!payload.password || String(payload.password).length < 6) {
      throw new Error("Mot de passe : 6 caractères minimum.");
    }

    const newUser = {
      user: payload.user.trim(),
      firstName: payload.firstName?.trim() || "",
      lastName: payload.lastName?.trim() || "",
      phone: payload.phone?.trim() || "",
      email: payload.email?.trim() || "", // optionnel
      age: Number(payload.age) || "",
      sex: payload.sex || "",
      password: String(payload.password),
      avatarDataUrl: payload.avatarDataUrl || "", // <- nouvelle clé pour la photo
    };

    const next = [...users, newUser];
    setUsers(next);
    localStorage.setItem("auth_users", JSON.stringify(next));
    return true;
  };

  // LOGIN (username + password)
  const login = (userInput, password) => {
    const username = norm(userInput);
    if (!username) throw new Error("Nom d'utilisateur requis.");
    if (!password) throw new Error("Mot de passe requis.");

    const found = users.find((u) => norm(u.user) === username);
    if (!found) throw new Error("Utilisateur introuvable.");
    if (found.password !== password) throw new Error("Mot de passe invalide.");

    setUser(found);
    localStorage.setItem("auth_current", JSON.stringify(found));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_current");
  };

  // UPDATE PROFILE (firstName, lastName, phone, email (facultatif), age, sex, avatarDataUrl)
  const updateProfile = (patch) => {
    if (!user) throw new Error("Non authentifié.");
    const idx = users.findIndex((u) => norm(u.user) === norm(user.user));
    if (idx === -1) throw new Error("Utilisateur introuvable.");

    const email = (patch.email ?? "").trim();
    if (email && norm(email) !== norm(users[idx].email)) {
      // si un nouvel email est fourni, contrôle d'unicité
      const existsEmail = users.some((u, i) => i !== idx && norm(u.email) === norm(email));
      if (existsEmail) throw new Error("Email déjà utilisé par un autre compte.");
    }

    const updated = {
      ...users[idx],
      firstName: patch.firstName?.trim() ?? users[idx].firstName,
      lastName:  patch.lastName?.trim()  ?? users[idx].lastName,
      phone:     patch.phone?.trim()     ?? users[idx].phone,
      email:     email || "", // email optionnel
      age:       patch.age ?? users[idx].age,
      sex:       patch.sex ?? users[idx].sex,
      avatarDataUrl: patch.avatarDataUrl ?? users[idx].avatarDataUrl,
    };

    const next = [...users];
    next[idx] = updated;
    setUsers(next);
    localStorage.setItem("auth_users", JSON.stringify(next));

    setUser(updated);
    localStorage.setItem("auth_current", JSON.stringify(updated));
    return true;
  };

  // UPDATE PASSWORD (vérifie ancien mdp)
  const updatePassword = (currentPassword, newPassword) => {
    if (!user) throw new Error("Non authentifié.");
    if (String(currentPassword) !== String(user.password)) throw new Error("Mot de passe actuel incorrect.");
    if (!newPassword || String(newPassword).length < 6) throw new Error("Nouveau mot de passe trop court (6+).");

    const idx = users.findIndex((u) => norm(u.user) === norm(user.user));
    if (idx === -1) throw new Error("Utilisateur introuvable.");

    const updated = { ...users[idx], password: String(newPassword) };

    const next = [...users];
    next[idx] = updated;
    setUsers(next);
    localStorage.setItem("auth_users", JSON.stringify(next));

    setUser(updated);
    localStorage.setItem("auth_current", JSON.stringify(updated));
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        users, user, isAuthenticated: !!user,
        register, login, logout,
        updateProfile, updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
