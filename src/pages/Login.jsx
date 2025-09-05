import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Email et mot de passe requis.");
      return;
    }
    // Démo: on accepte tout email/mdp non vides
    login(email.trim());
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Se connecter</h1>
        <p className="auth-sub">Accédez à votre gestion de dépense.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            placeholder="exemple@mail.com"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <label className="label">Mot de passe</label>
          <input
            type="password"
            className="input"
            placeholder="••••••"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />

          {error && <div className="error mt-6">{error}</div>}

          <button type="submit" className="btn" style={{width:"100%", marginTop: 16}}>
            🔑 Connexion
          </button>
        </form>

        <p className="auth-hint">Démo : utilisez n’importe quel email et mot de passe.</p>
      </div>
    </div>
  );
}
