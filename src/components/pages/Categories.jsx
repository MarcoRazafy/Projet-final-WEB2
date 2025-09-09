import { useState } from 'react';

const initialCategories = [
  {
    id: 1,
    name: 'Alimentation',
    color: '#09c47e',
    total: 45.67,
    count: 1,
    percent: 5.0,
    recentLabel: 'Courses Carrefour',
    recentAmount: 45.67
  },
  {
    id: 2,
    name: 'Transport',
    color: '#3a8ee6',
    total: 1.90,
    count: 1,
    percent: 0.2,
    recentLabel: 'Ticket de métro',
    recentAmount: 1.90
  },
  {
    id: 3,
    name: 'Logement',
    color: '#9665ea',
    total: 850.00,
    count: 1,
    percent: 92.5,
    recentLabel: 'Loyer',
    recentAmount: 850.00
  },
  {
    id: 4,
    name: 'Loisirs',
    color: '#ffb302',
    total: 12.50,
    count: 1,
    percent: 1.4,
    recentLabel: 'Cinéma',
    recentAmount: 12.50
  },
  {
    id: 5,
    name: 'Santé',
    color: '#ea4c4c',
    total: 8.90,
    count: 1,
    percent: 1.0,
    recentLabel: 'Pharmacie',
    recentAmount: 8.90
  },
  {
    id: 6,
    name: 'Vêtements',
    color: '#ed6ec7',
    total: 0.00,
    count: 0,
    percent: 0.0,
    recentLabel: '',
    recentAmount: 0.00
  }
];

const randomColor = () => {
  const colors = ['#09c47e', '#3a8ee6', '#9665ea', '#ffb302', '#ea4c4c', '#ed6ec7'];
  return colors[Math.floor(Math.random() * colors.length)];
};

export default function Categories() {
  const [categories, setCategories] = useState(initialCategories);

  const handleEdit = (id) => {
    const newName = prompt('Modifier le nom:', categories.find(cat => cat.id === id).name);
    if (newName) {
      setCategories(categories.map(cat =>
        cat.id === id ? { ...cat, name: newName } : cat
      ));
    }
  };

  const handleDelete = (id) => {
    const cat = categories.find(c => c.id === id);
    if (cat.count === 0) {
      setCategories(categories.filter(cat => cat.id !== id));
    } else {
      alert("Impossible de supprimer une catégorie utilisée !");
    }
  };

  const handleAddCategory = () => {
    const name = prompt('Nom de la nouvelle catégorie :');
    if (!name || !name.trim()) return alert('Le nom est obligatoire');

    const newId = categories.length ? Math.max(...categories.map(c => c.id)) + 1 : 1;

    const newCategory = {
      id: newId,
      name: name.trim(),
      color: randomColor(),
      total: 0,
      count: 0,
      percent: 0,
      recentLabel: '',
      recentAmount: 0,
    };

    setCategories([...categories, newCategory]);
  };

  return (
    <div style={{ position: 'relative', paddingTop: '120px', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Catégories</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // 3 colonnes
        gap: '20px',
        justifyItems: 'center',
      }}>
        {categories.map(cat => (
          <div key={cat.id} style={{
            width: '320px',
            border: '2px solid #3192ea',
            borderRadius: '17px',
            padding: '20px',
            color: '#fff',
            backgroundColor: '#1a1f2b',
            boxShadow: '0 2px 18px #0001',
            position: 'relative',
          }}>
            <div style={{ fontWeight: 'bold', fontSize: '22px', marginBottom: '10px', color: cat.color }}>
              {cat.name}
              <span style={{ float: 'right' }}>
                <button title="Éditer" onClick={() => handleEdit(cat.id)} style={{ marginRight: 12 }}>✏️</button>
                <button title="Supprimer" onClick={() => handleDelete(cat.id)}>🗑️</button>
              </span>
            </div>
            <div style={{ marginBottom: '7px' }}>Total&nbsp;: <span style={{ fontWeight: 'bold' }}>{cat.total.toFixed(2)} €</span></div>
            <div style={{ marginBottom: '7px' }}>Dépenses&nbsp;: <b>{cat.count}</b></div>
            <div style={{ marginBottom: '15px' }}>
              Pourcentage du total&nbsp;: <b>{cat.percent}%</b>
              <div style={{
                height: '6px',
                background: '#24263a',
                borderRadius: '4px',
                overflow: 'hidden',
                marginTop: '5px',
                marginBottom: '5px'
              }}>
                <div style={{
                  width: `${cat.percent}%`,
                  height: '100%',
                  background: cat.color
                }}></div>
              </div>
            </div>
            {cat.count > 0 ? (
              <div>
                <span style={{ fontSize: '15px' }}>Dépenses récentes</span>:&nbsp;
                <span>{cat.recentLabel}</span>
                <span style={{ float: 'right' }}>{cat.recentAmount.toFixed(2)} €</span>
              </div>
            ) : (
              <div style={{ color: '#d0d0d0', fontStyle: 'italic' }}>
                <span role="img" aria-label="tag">🏷️</span> Aucune dépense dans cette catégorie
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleAddCategory}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: '#3192ea',
          color: '#fff',
          padding: '10px 24px',
          fontSize: '17px',
          borderRadius: '11px',
          border: 'none',
          fontWeight: 'bold',
          cursor: 'pointer',
          zIndex: 1000,
        }}
      >
        + Nouvelle Catégorie
      </button>
    </div>
  );
}
