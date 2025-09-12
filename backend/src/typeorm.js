import { DataSource } from 'typeorm';
import { Category } from './entity/Category.js';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  logging: false,
  entities: [Category],
});
