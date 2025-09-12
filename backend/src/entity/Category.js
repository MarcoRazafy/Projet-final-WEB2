import { EntitySchema } from 'typeorm';

export const Category = new EntitySchema({
  name: 'Category',
  tableName: 'category',
  columns: {
    id: {
      type: 'int',
      primary: true,
      generated: true,
    },
    name: {
      type: 'varchar',
    },
  },
});
