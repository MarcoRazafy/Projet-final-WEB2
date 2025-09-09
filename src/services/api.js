const API_URL = 'http://localhost:3000/api';

export async function getCategories(token) {
  const res = await fetch(`${API_URL}/categories`, {
    headers: { 
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error('Erreur API ' + res.status);
  return await res.json();
}
