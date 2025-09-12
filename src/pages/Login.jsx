import React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/Auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [user, setUser] = React.useState("");      
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");

  const onSubmit = (e) => {
    e.preventDefault(); setError("");
    if (!user.trim() || !password.trim()) {
      setError("Nom d'utilisateur et mot de passe requis."); return;
    }
    try{
      login(user, password);
      navigate(from, { replace: true });
    }catch(err){
      setError(err.message || "Identifiants invalides.");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <h1 className="auth-title">Connexion</h1>
        <p className="auth-sub">Accédez à votre gestion de dépense.</p>

        <form onSubmit={onSubmit} className="auth-form">
          <label className="label">Nom d'utilisateur</label>
          <input className="input" placeholder="ex: marco24" value={user} onChange={e=>setUser(e.target.value)} />

          <label className="label">Mot de passe</label>
          <input type="password" className="input" placeholder="••••••" value={password} onChange={e=>setPassword(e.target.value)} />

          {error && <div className="error" style={{marginTop:12}}>{error}</div>}

          <button type="submit" className="btn" style={{width:"100%", marginTop: 16}}><i class="fa-solid fa-right-to-bracket"></i> Se connecter</button>
        </form>

        <p className="auth-hint">
          Pas de compte ? <Link to="/register" style={{color:"#fff", textDecoration:"underline"}}>Créer un compte</Link>
        </p>
      </div>
    </div>
  );
}
