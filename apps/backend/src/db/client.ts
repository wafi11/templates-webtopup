// apps/backend/src/db/client.ts
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema'; // 👈 Import schema

const db = drizzle(process.env.DATABASE_URL!, { schema }); // 👈 Pass schema

export type DB = typeof db;

export default db;
