import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/Auth";

function isValidEmailOptional(email) {
  const e = String(email ?? "").trim();
  if (!e) return true; 
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default function Register(){
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    user: "",
    firstName: "",
    lastName: "",
    phone: "",
    email: "",   
    age: "",
    sex: "Homme",
    password: "",
    confirm: "",
    avatarDataUrl: "",
  });

  const [error, setError] = React.useState("");
  const [ok, setOk] = React.useState("");

  const onChange = (k,v)=> setForm(f=>({...f,[k]:v}));

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    if(!file.type.startsWith("image/")) { setError("Le fichier n'est pas une image."); return; }
    const reader = new FileReader();
    reader.onload = () => setForm(f=>({ ...f, avatarDataUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if(!form.user.trim()) return "Nom d'utilisateur requis.";
    if(!form.firstName.trim() || !form.lastName.trim()) return "Nom et prénom requis.";
    if(form.phone && !/^[0-9+\s().-]{6,}$/.test(form.phone)) return "Téléphone invalide.";
    if(!isValidEmailOptional(form.email)) return "Email invalide.";
    const ageNum = Number(form.age);
    if(!Number.isFinite(ageNum) || ageNum < 10 || ageNum > 120) return "Âge invalide.";
    if(form.password.length < 6) return "Mot de passe : 6 caractères min.";
    if(form.password !== form.confirm) return "La confirmation ne correspond pas.";
    return "";
  };

  const onSubmit = (e) => {
    e.preventDefault(); setError(""); setOk("");
    const err = validate();
    if(err){ setError(err); return; }
    try{
      register({
        user:      form.user.trim(),
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        phone:     form.phone.trim(),
        email:     form.email.trim(),
        age:       Number(form.age),
        sex:       form.sex,
        password:  form.password,
        avatarDataUrl: form.avatarDataUrl,
      });
      setOk("Compte créé ✅ Vous pouvez vous connecter.");
      setTimeout(()=> navigate("/login"), 800);
    }catch(err){
      setError(err.message || "Erreur d'inscription.");
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card" style={{maxWidth: 700}}>
        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-sub">Inscrivez-vous pour gérer vos dépenses.</p>

        {/* Avatar + username */}
        <div className="grid-2">
          <div>
            
            <label className="label">Nom d'utilisateur (obligatoire)</label>
            <input className="input" value={form.user} onChange={e=>onChange("user", e.target.value)} placeholder="ex: marco24" />
          </div>
        </div>

        <form onSubmit={onSubmit} className="auth-form" style={{gap:12, marginTop: 10}}>
          <div className="grid-2">
            <div>
              <label className="label">Prénom</label>
              <input className="input" value={form.firstName} onChange={e=>onChange("firstName", e.target.value)} />
            </div>
            <div>
              <label className="label">Nom</label>
              <input className="input" value={form.lastName} onChange={e=>onChange("lastName", e.target.value)} />
            </div>
          </div>

          <label className="label">Téléphone</label>
          <input className="input" value={form.phone} onChange={e=>onChange("phone", e.target.value)} placeholder="+261 ..." />

          <div className="grid-2">
            <div>
              <label className="label">Email (optionnel)</label>
              <input className="input" type="email" value={form.email} onChange={e=>onChange("email", e.target.value)} placeholder="exemple@mail.com" />
            </div>
            <div>
              <label className="label">Âge</label>
              <input className="input" type="number" min="10" max="120" value={form.age} onChange={e=>onChange("age", e.target.value)} />
            </div>
          </div>

          <label className="label">Sexe</label>
          <select className="input" value={form.sex} onChange={e=>onChange("sex", e.target.value)}>
            <option>Homme</option>
            <option>Femme</option>
            <option>Autre</option>
            <option>Préférer ne pas dire</option>
          </select>

          <div className="grid-2">
            <div>
              <label className="label">Mot de passe</label>
              <input className="input" type="password" value={form.password} onChange={e=>onChange("password", e.target.value)} placeholder="min. 6 caractères" />
            </div>
            <div>
              <label className="label">Confirmer le mot de passe</label>
              <input className="input" type="password" value={form.confirm} onChange={e=>onChange("confirm", e.target.value)} placeholder="retapez le mot de passe" />
            </div>
          </div>

          {error && <div className="error">{error}</div>}
          {ok && <div className="note">{ok}</div>}

          <button type="submit" className="btn" style={{width:"100%", marginTop: 8,}}>Créer le compte</button>
        </form>

        <p className="auth-hint" style={{marginTop:12}}>
          Déjà un compte ? <Link to="/login" style={{color:"#fff", textDecoration:"underline"}}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}
