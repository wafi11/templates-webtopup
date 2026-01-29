// apps/backend/src/db/db.provider.ts
import { Inject } from '@nestjs/common';
import db, { DB } from './client';

export const DB_PROVIDER = 'DB_PROVIDER'; // 👈 Nama lebih jelas

export const InjectDb = () => Inject(DB_PROVIDER);

export const DbProvider = {
  // 👈 Rename jadi DbProvider (capital D)
  provide: DB_PROVIDER,
  useValue: db,
};

// Export type untuk convenience
export type { DB };
