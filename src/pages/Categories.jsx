import React from "react";
import { useAuth } from "../context/Auth";

const PRESET_COLORS = [
  "#285bde", "#4f5868", "#22c55e", "#ef4444", "#f59e0b", "#14b8a6", "#a855f7"
];

const DEFAULTS = [
  { name: "Alimentation", color: "#f59e0b"},
  { name: "Transport",   color: "#14b8a6"},
  { name: "Logement",    color: "#4f5868"},
  { name: "Loisirs",     color: "#a855f7"},
  { name: "Santé",       color: "#ef4444"},
  { name: "Éducation",   color: "#285bde"},
  { name: "Autres",      color: "#9ca3af"},
];

export default function Categories(){
  const { user } = useAuth();
  const [cats, setCats] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [editing, setEditing] = React.useState(null);
  const [form, setForm] = React.useState({ name: "", color: "#285bde"});
  const [error, setError] = React.useState("");

  // charger
  React.useEffect(() => {
    if (!user) return;
    const raw = localStorage.getItem("categories") || "[]";
    const all = JSON.parse(raw);
    const mine = all.filter(c => c.owner === user.user);
    if (mine.length === 0) {
      // seed defaults pour l'utilisateur
      const seeded = DEFAULTS.map(d => ({ id: crypto.randomUUID(), owner: user.user, ...d, createdAt: Date.now() }));
      const merged = [...all, ...seeded];
      localStorage.setItem("categories", JSON.stringify(merged));
      setCats(seeded);
    } else {
      setCats(mine);
    }
  }, [user]);

  const persist = (nextForUser) => {
    const raw = localStorage.getItem("categories") || "[]";
    const all = JSON.parse(raw);
    const others = all.filter(c => c.owner !== user.user);
    const merged = [...others, ...nextForUser];
    localStorage.setItem("categories", JSON.stringify(merged));
    setCats(nextForUser);
  };

  const onAdd = () => {
    setEditing(null);
    setForm({ name: "", color: "#285bde"});
    setError("");
    setOpen(true);
  };

  const onEdit = (cat) => {
    setEditing(cat.id);
    setForm({ name: cat.name, color: cat.color});
    setError("");
    setOpen(true);
  };

  const onDelete = (id) => {
    persist(cats.filter(c => c.id !== id));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim()) { setError("Nom requis."); return; }

    if (editing) {
      const next = cats.map(c => c.id === editing ? { ...c, name: form.name.trim(), color: form.color,} : c);
      persist(next);
    } else {
      const newCat = {
        id: crypto.randomUUID(),
        owner: user.user,
        name: form.name.trim(),
        color: form.color,
        createdAt: Date.now()
      };
      persist([newCat, ...cats]);
    }
    setOpen(false);
  };

  return (
    <div className="container-soft" style={{ width: "100%" }}>
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
          <div>
            <h1 className="h1">Catégories</h1>
            <p className="p-muted">Gérez vos catégories de dépenses</p>
          </div>
          <button className="btn" onClick={onAdd}><i class="fa-solid fa-plus"></i> Nouvelle catégorie</button>
        </div>

        {cats.length === 0 ? (
          <p className="p-muted" style={{ marginTop: 12 }}>Aucune catégorie.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Couleur</th>
                  <th></th>
                  <th style={{ width: 130 }}></th>
                </tr>
              </thead>
              <tbody>
                {cats.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 600 }}>
                      <span className="chip" style={{ background: hexToBg(c.color), borderColor: c.color }}>
                         {c.name}
                      </span>
                    </td>
                    <td>
                      <span className="swatch" style={{ background: c.color }} />
                      <code style={{ marginLeft: 8, color:"#b2bbc9" }}></code>
                    </td>
                    <td>
                      <div style={{ display:"flex", justifyContent: "end" , gap:6 }}>
                        <button className="btn" onClick={() => onEdit(c)} style={{ background:"#4f5868" }}>Éditer</button>
                        <button className="btn btn-danger" onClick={() => onDelete(c.id)}>Suppr.</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {open && (
        <div className="modal-backdrop" onClick={() => setOpen(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3 className="h1" style={{ marginBottom: 8 }}>{editing ? "Modifier la catégorie" : "Nouvelle catégorie"}</h3>

            <form onSubmit={onSubmit} className="auth-form" style={{ gap:10 }}>
              <div>
                <label className="label">Nom</label>
                <input className="input" value={form.name} onChange={e=>setForm(f=>({...f, name: e.target.value}))} placeholder="ex: Courses, Taxi..." />
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Couleur</label>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {PRESET_COLORS.map(col => (
                      <button
                        type="button"
                        key={col}
                        className="color-btn"
                        style={{ outline: form.color === col ? `2px solid ${col}` : "none" }}
                        onClick={()=> setForm(f=>({...f, color: col}))}
                        title={col}
                      >
                        <span className="swatch" style={{ background: col }} />
                      </button>
                    ))}
                    <input
                      type="color"
                      className="color-picker"
                      value={form.color}
                      onChange={(e)=> setForm(f=>({...f, color: e.target.value}))}
                      title="Couleur personnalisée"
                    />
                  </div>
                </div>

               
              </div>

              {error && <div className="error">{error}</div>}

              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button type="button" className="btn" onClick={()=>setOpen(false)} style={{ background:"#4f5868" }}>Annuler</button>
                <button type="submit" className="btn">{editing ? "Enregistrer" : "Ajouter"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// légère transparence de fond pour la pastille
function hexToBg(hex){
  try{
    if(!hex?.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) return "rgba(178,187,201,.1)";
    // simple fallback : on met une transparence
    return hex + "22"; 
  }catch{ return "rgba(178,187,201,.1)"; }
}
