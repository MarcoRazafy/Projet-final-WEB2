import React from "react";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

function isValidEmailOptional(email) {
  const e = String(email ?? "").trim();
  if (!e) return true;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
}

export default function Profile() {
  const { user, logout, updateProfile, updatePassword } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = React.useState(() => ({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    phone:     user?.phone     || "",
    email:     user?.email     || "", // optionnel
    age:       user?.age       || "",
    sex:       user?.sex       || "Homme",
    avatarDataUrl: user?.avatarDataUrl || "",
  }));
  const [sec, setSec] = React.useState({ currentPassword:"", newPassword:"", confirm:"" });
  const [msg, setMsg] = React.useState("");
  const [err, setErr] = React.useState("");

  React.useEffect(()=>{ setMsg(""); setErr(""); }, [user]);

  const onPickAvatar = (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    if(!file.type.startsWith("image/")) { setErr("Le fichier n'est pas une image."); return; }
    const reader = new FileReader();
    reader.onload = () => setForm((f)=>({ ...f, avatarDataUrl: reader.result }));
    reader.readAsDataURL(file);
  };

  const onSaveProfile = (e) => {
    e.preventDefault(); setErr(""); setMsg("");
    if(form.phone && !/^[0-9+\s().-]{6,}$/.test(form.phone)) { setErr("Téléphone invalide."); return; }
    if(!isValidEmailOptional(form.email)) { setErr("Email invalide."); return; }
    try{
      updateProfile({
        firstName: form.firstName,
        lastName:  form.lastName,
        phone:     form.phone,
        email:     form.email,    // optionnel
        age:       form.age,
        sex:       form.sex,
        avatarDataUrl: form.avatarDataUrl,
      });
      setMsg("Profil mis à jour ✅");
    }catch(error){
      setErr(error.message || "Erreur lors de la mise à jour du profil.");
    }
  };

  const onChangePassword = (e) => {
    e.preventDefault(); setErr(""); setMsg("");
    if(!sec.currentPassword || !sec.newPassword || !sec.confirm) { setErr("Remplissez tous les champs."); return; }
    if(sec.newPassword.length < 6){ setErr("Mot de passe trop court (6+)."); return; }
    if(sec.newPassword !== sec.confirm){ setErr("La confirmation ne correspond pas."); return; }
    try{
      updatePassword(sec.currentPassword, sec.newPassword);
      setSec({ currentPassword:"", newPassword:"", confirm:"" });
      setMsg("Mot de passe mis à jour ✅");
    }catch(error){
      setErr(error.message || "Erreur lors du changement de mot de passe.");
    }
  };

  if(!user){
    return (
      <div className="container-soft" style={{ marginTop: 40 }}>
        <div className="card">
          <p className="error">Aucun utilisateur connecté.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-soft" style={{ marginTop: 40 }}>
      {/* Carte: Avatar + infos */}
      <div className="card">
        <h1 className="h1">Mon profil</h1>
        <p className="p-muted">Vos informations personnelles</p>

        <div style={{ display:"flex", gap:24, alignItems:"center", flexWrap:"wrap", marginTop: 12 }}>
          <div className="avatar-box">
            <img
              className="avatar"
              src={form.avatarDataUrl || "https://api.iconify.design/solar/user-bold.svg?color=white"}
              alt="Avatar"
            />
            <label className="avatar-change">
              <input type="file" accept="image/*" className="avatar-input" onChange={onPickAvatar} />
              <i class="fa-solid fa-camera"></i>
            </label>
          </div>

          <div style={{ lineHeight: 1.6 }}>
            <p><strong>Nom d'utilisateur :</strong> {user.user}</p>
            <p><strong>Nom :</strong> {user.lastName || "—"}</p>
            <p><strong>Prénom :</strong> {user.firstName || "—"}</p>
            <p><strong>Email :</strong> {user.email || "—"}</p>
          </div>
        </div>

        {/* Formulaire édition profil */}
        <form onSubmit={onSaveProfile} className="auth-form" style={{ gap:12, marginTop:16 }}>
          <div className="grid-2">
            <div>
              <label className="label">Prénom</label>
              <input className="input" value={form.firstName} onChange={e=>setForm(f=>({...f, firstName: e.target.value}))} />
            </div>
            <div>
              <label className="label">Nom</label>
              <input className="input" value={form.lastName} onChange={e=>setForm(f=>({...f, lastName: e.target.value}))} />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Téléphone</label>
              <input className="input" value={form.phone} onChange={e=>setForm(f=>({...f, phone: e.target.value}))} placeholder="+261 ..." />
            </div>
            <div>
              <label className="label">Email (optionnel)</label>
              <input className="input" type="email" value={form.email} onChange={e=>setForm(f=>({...f, email: e.target.value}))} placeholder="exemple@mail.com" />
            </div>
          </div>

          <div className="grid-2">
            <div>
              <label className="label">Âge</label>
              <input className="input" type="number" min="10" max="120" value={form.age} onChange={e=>setForm(f=>({...f, age: e.target.value}))} />
            </div>
            <div>
              <label className="label">Sexe</label>
              <select className="input" value={form.sex} onChange={e=>setForm(f=>({...f, sex: e.target.value}))}>
                <option>Homme</option>
                <option>Femme</option>
                <option>Autre</option>
                <option>Préférer ne pas dire</option>
              </select>
            </div>
          </div>

          <button className="btn" type="submit"><i class="fa-solid fa-floppy-disk"></i> Enregistrer les modifications</button>
        </form>

        {msg && <div className="note">{msg}</div>}
        {err && <div className="error">{err}</div>}
      </div>

      {/* Carte: Sécurité */}
      <div className="card mt-12">
        <h2 className="h1">Sécurité</h2>
        <p className="p-muted">Changer votre mot de passe</p>

        <form onSubmit={onChangePassword} className="auth-form" style={{ gap:12, marginTop: 10 }}>
          <label className="label">Mot de passe actuel</label>
          <input className="input" type="password" value={sec.currentPassword} onChange={e=>setSec(s=>({...s, currentPassword: e.target.value}))} />

          <div className="grid-2">
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input className="input" type="password" value={sec.newPassword} onChange={e=>setSec(s=>({...s, newPassword: e.target.value}))} placeholder="min. 6 caractères" />
            </div>
            <div>
              <label className="label">Confirmer</label>
              <input className="input" type="password" value={sec.confirm} onChange={e=>setSec(s=>({...s, confirm: e.target.value}))} />
            </div>
          </div>

          <button className="btn" type="submit"><i class="fa-solid fa-key"></i> Mettre à jour le mot de passe</button>
        </form>
      </div>

      {/* Déconnexion */}
      <div className="card mt-12" style={{ textAlign: "center" }}>
        <button
          className="btn"
          onClick={() => { logout(); navigate("/login", { replace: true }); }}
        >
          <i class="fa-solid fa-right-from-bracket"></i> Se déconnecter
        </button>
      </div>
    </div>
  );
}
