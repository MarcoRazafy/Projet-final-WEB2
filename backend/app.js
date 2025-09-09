const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let categoriesDB = [
  { id: '1', userId: 'u1', name: 'Alimentation' },
  { id: '2', userId: 'u1', name: 'Transport' },
];

// Middleware d’authentification simple (ex: JWT)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.sendStatus(401);
  const token = authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, 'SECRET', (err, user) => {
    if (err) return res.sendStatus(403);
    req.userId = user.id;
    next();
  });
}

app.get('/api/categories', authenticateToken, (req, res) => {
  res.json(categoriesDB.filter(c => c.userId === req.userId));
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nom requis' });
  const newCat = { id: Date.now().toString(), userId: req.userId, name };
  categoriesDB.push(newCat);
  res.status(201).json(newCat);
});

app.listen(3000, () => console.log('Backend en écoute sur port 3000'));
