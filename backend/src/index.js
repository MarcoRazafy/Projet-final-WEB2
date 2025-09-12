import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './typeorm.js';
import { Category } from './entity/Category.js';

const app = express();
app.use(express.json());

// Exemple route API
app.get('/api/categories', async (req, res) => {
  const categories = await AppDataSource.manager.find(Category);
  res.json(categories);
});

app.post('/api/categories', async (req, res) => {
  const category = AppDataSource.manager.create(Category, req.body);
  await AppDataSource.manager.save(category);
  res.status(201).json(category);
});

const PORT = process.env.PORT || 3002;
AppDataSource.initialize().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
}).catch((error) => console.error(error));
