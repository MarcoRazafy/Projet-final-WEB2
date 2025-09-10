import React from "react";
import { useAuth } from "../context/Auth";
import { useNavigate } from "react-router-dom";

function fmtMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString("fr-FR", { style: "currency", currency: "MGA" });
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [expenses, setExpenses] = React.useState([]);
  const [cats, setCats] = React.useState([]);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [form, setForm] = React.useState({
    label: "", amount: "", category: "Autres",
    date: new Date().toISOString().slice(0, 10), note: "",
  });
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!user) return;
    const allE = JSON.parse(localStorage.getItem("expenses") || "[]");
    setExpenses(allE.filter(e => e.owner === user.user));
    const allC = JSON.parse(localStorage.getItem("categories") || "[]");
    const mine = allC.filter(c => c.owner === user.user);
    setCats(mine);
    if (mine.length) setForm(f => ({ ...f, category: mine[0].name }));
  }, [user]);

  const persist = (nextForUser) => {
    const all = JSON.parse(localStorage.getItem("expenses") || "[]");
    const merged = [...all.filter(e => e.owner !== user.user), ...nextForUser];
    localStorage.setItem("expenses", JSON.stringify(merged));
    setExpenses(nextForUser);
  };

  const onSubmit = (e) => {
    e.preventDefault(); setError("");
    const amount = Number(form.amount);
    if (!form.label.trim()) return setError("Intitulé requis.");
    if (!Number.isFinite(amount) || amount <= 0) return setError("Montant invalide (>0).");
    if (!form.date) return setError("Date requise.");

    const item = {
      id: crypto.randomUUID(),
      owner: user.user,
      label: form.label.trim(),
      amount, category: form.category, date: form.date,
      note: form.note.trim(), createdAt: Date.now()
    };
    const next = [item, ...expenses]; persist(next);

    setForm({ label:"", amount:"", category: cats[0]?.name || "Autres", date: new Date().toISOString().slice(0,10), note:"" });
    setOpenAdd(false);
  };

  const onDelete = (id) => persist(expenses.filter(e => e.id !== id));
  const total = expenses.reduce((s, e) => s + Number(e.amount || 0), 0);

  return (
    <div className="container-soft" style={{ width: "100%" }}>
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h1 className="h1">Dashboard</h1>
            <p className="p-muted">Résumé de vos dépenses</p>
          </div>

          <div style={{ display:"flex", gap:8 }}>
            <button className="btn" onClick={() => setOpenAdd(true)}><i class="fa-solid fa-plus"></i> Ajouter une dépense</button>
          </div>
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12, marginTop:16 }}>
          <div className="card" style={{ padding:16 }}>
            <div className="p-muted" style={{ fontSize:13 }}>Total</div>
            <div style={{ color:"#fff", fontSize:18, fontWeight:700 }}>{fmtMoney(total)}</div>
          </div>
          <div className="card" style={{ padding:16 }}>
            <div className="p-muted" style={{ fontSize:13 }}>Nombre de dépenses</div>
            <div style={{ color:"#fff", fontSize:18, fontWeight:700 }}>{expenses.length}</div>
          </div>
          <div className="card" style={{ padding:16 }}>
            <div className="p-muted" style={{ fontSize:13 }}>Dernière update</div>
            <div style={{ color:"#fff", fontSize:14, fontWeight:600 }}>
              {expenses[0]?.date ? new Date(expenses[0].date).toLocaleDateString("fr-FR") : "—"}
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
          <h2 className="h1">Vos dépenses</h2>
          {expenses.length > 0 && <div className="p-muted" style={{ fontSize: 13 }}>{expenses.length} élément{expenses.length>1?"s":""}</div>}
        </div>

        {expenses.length === 0 ? (
          <p className="p-muted" style={{ marginTop: 12 }}>Aucune dépense. Cliquez sur <strong>“Ajouter une dépense”</strong>.</p>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>Intitulé</th><th>Catégorie</th><th>Montant</th><th>Date</th><th>Note</th><th style={{width:80}}></th></tr>
              </thead>
              <tbody>
                {expenses.map(e => (
                  <tr key={e.id}>
                    <td>{e.label}</td>
                    <td>
                      <button
                        className="chip" style={{ cursor:"pointer", background:"rgba(40,91,222,.18)", borderColor:"#285bde" }}
                        onClick={() => {
                          const d = new Date(e.date);
                          navigate(`/reports?category=${encodeURIComponent(e.category)}&year=${d.getFullYear()}&month=${d.getMonth()+1}`);
                        }}
                        title="Voir les rapports pour cette catégorie"
                      >
                        {e.category}
                      </button>
                    </td>
                    <td style={{ fontWeight:700 }}>{fmtMoney(e.amount)}</td>
                    <td>{new Date(e.date).toLocaleDateString("fr-FR")}</td>
                    <td className="td-note">{e.note || "—"}</td>
                    <td><button className="btn btn-danger" onClick={()=>onDelete(e.id)}>Suppr.</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {openAdd && (
        <div className="modal-backdrop" onClick={()=>setOpenAdd(false)}>
          <div className="modal" onClick={(e)=>e.stopPropagation()}>
            <h3 className="h1" style={{ marginBottom: 8 }}>Ajouter une dépense</h3>
            <form onSubmit={onSubmit} className="auth-form" style={{ gap: 10 }}>
              <label className="label">Intitulé</label>
              <input className="input" value={form.label} onChange={e=>setForm(f=>({...f, label:e.target.value}))} placeholder="Ex : Déjeuner équipe" autoFocus />

              <div className="grid-2">
                <div>
                  <label className="label">Montant</label>
                  <input className="input" type="number" min="0" step="0.01" value={form.amount} onChange={e=>setForm(f=>({...f, amount:e.target.value}))} placeholder="ex: 15000" />
                </div>
                <div>
                  <label className="label">Catégorie</label>
                  <select className="input" value={form.category} onChange={e=>setForm(f=>({...f, category:e.target.value}))}>
                    {(cats.length ? cats.map(c=>c.name) : ["Autres"]).map(name => <option key={name} value={name}>{name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div>
                  <label className="label">Date</label>
                  <input className="input" type="date" value={form.date} onChange={e=>setForm(f=>({...f, date:e.target.value}))} />
                </div>
                <div>
                  <label className="label">Note (optionnel)</label>
                  <input className="input" value={form.note} onChange={e=>setForm(f=>({...f, note:e.target.value}))} placeholder="ex: partagé avec Ana" />
                </div>
              </div>

              {error && <div className="error">{error}</div>}

              <div style={{ display:"flex", gap:8, justifyContent:"flex-end" }}>
                <button type="button" className="btn" onClick={()=>setOpenAdd(false)} style={{ background:"#4f5868" }}>Annuler</button>
                <button type="submit" className="btn">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
