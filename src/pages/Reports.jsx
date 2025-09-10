import React from "react";
import { useAuth } from "../context/Auth";

function fmtMoney(n) {
  const v = Number(n || 0);
  return v.toLocaleString("fr-FR", { style: "currency", currency: "MGA" });
}

export default function Reports(){
  const { user } = useAuth();
  const [expenses, setExpenses] = React.useState([]);
  const [cats, setCats] = React.useState([]);

  // filtres
  const now = new Date();
  const [year, setYear] = React.useState(now.getFullYear());
  const [month, setMonth] = React.useState(now.getMonth() + 1); // 1..12
  const [category, setCategory] = React.useState("ALL");

  React.useEffect(() => {
    if(!user) return;
    const allE = JSON.parse(localStorage.getItem("expenses") || "[]");
    const allC = JSON.parse(localStorage.getItem("categories") || "[]");
    setExpenses(allE.filter(e => e.owner === user.user));
    setCats(allC.filter(c => c.owner === user.user));
  }, [user]);

  // derive years list
  const years = React.useMemo(() => {
    const ys = new Set();
    expenses.forEach(e => {
      const y = new Date(e.date).getFullYear();
      if (y) ys.add(y);
    });
    const arr = Array.from(ys);
    return arr.length ? arr.sort((a,b)=>b-a) : [now.getFullYear()];
  }, [expenses]);

  const filtered = expenses.filter(e => {
    const d = new Date(e.date);
    const okYear = d.getFullYear() === Number(year);
    const okMonth = (Number(month) === 0) ? true : (d.getMonth() + 1 === Number(month));
    const okCat = category === "ALL" ? true : e.category === category;
    return okYear && okMonth && okCat;
  });

  // total & par catégorie
  const total = filtered.reduce((s, e) => s + Number(e.amount || 0), 0);

  const byCat = filtered.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount || 0);
    return acc;
  }, {});

  const rows = Object.entries(byCat).sort((a,b)=>b[1]-a[1]); // [[cat, sum], ...]

  // pour couleur: chercher la catégorie définie par l'utilisateur
  const colorOf = (catName) => cats.find(c => c.name === catName)?.color || "#285bde";

  return (
    <div className="container-soft" style={{ width:"100%" }}>
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
          <div>
            <h1 className="h1">Rapports</h1>
            <p className="p-muted">Analyse par période et par catégorie</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="filters">
          <div className="filter">
            <label className="label">Année</label>
            <select className="input" value={year} onChange={e=>setYear(e.target.value)}>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div className="filter">
            <label className="label">Mois</label>
            <select className="input" value={month} onChange={e=>setMonth(e.target.value)}>
              <option value={0}>Tous</option>
              <option value={1}>Janvier</option>
              <option value={2}>Février</option>
              <option value={3}>Mars</option>
              <option value={4}>Avril</option>
              <option value={5}>Mai</option>
              <option value={6}>Juin</option>
              <option value={7}>Juillet</option>
              <option value={8}>Août</option>
              <option value={9}>Septembre</option>
              <option value={10}>Octobre</option>
              <option value={11}>Novembre</option>
              <option value={12}>Décembre</option>
            </select>
          </div>
          <div className="filter">
            <label className="label">Catégorie</label>
            <select className="input" value={category} onChange={e=>setCategory(e.target.value)}>
              <option value="ALL">Toutes</option>
              {cats.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Totaux */}
        <div className="cards-3">
          <div className="card" style={{ padding: 16 }}>
            <div className="p-muted" style={{ fontSize: 13 }}>Total période</div>
            <div style={{ color:"#fff", fontSize: 18, fontWeight:700 }}>{fmtMoney(total)}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="p-muted" style={{ fontSize: 13 }}>Nombre de dépenses</div>
            <div style={{ color:"#fff", fontSize: 18, fontWeight:700 }}>{filtered.length}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div className="p-muted" style={{ fontSize: 13 }}>Catégories actives</div>
            <div style={{ color:"#fff", fontSize: 18, fontWeight:700 }}>{rows.length}</div>
          </div>
        </div>

        {/* Répartition par catégorie */}
        <div className="card" style={{ marginTop: 16, padding: 16 }}>
          <h3 className="h1">Répartition par catégorie</h3>
          {rows.length === 0 ? (
            <p className="p-muted" style={{ marginTop: 8 }}>Aucune donnée pour la période sélectionnée.</p>
          ) : (
            <div className="bars">
              {rows.map(([cat, sum]) => {
                const pct = total > 0 ? Math.round((sum / total) * 100) : 0;
                const col = colorOf(cat);
                return (
                  <div key={cat} className="bar-row">
                    <div className="bar-label">
                      <span className="swatch" style={{ background: col }} />
                      <span>{cat}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill" style={{ width: `${pct}%`, background: hexToBg(col), borderColor: col }} />
                    </div>
                    <div className="bar-value">{fmtMoney(sum)} <span className="p-muted">({pct}%)</span></div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function hexToBg(hex){
  try{
    if(!hex?.startsWith("#") || (hex.length !== 7 && hex.length !== 4)) return "rgba(40,91,222,.25)";
    return hex + "44"; // #RRGGBB44
  }catch{ return "rgba(40,91,222,.25)"; }
}
