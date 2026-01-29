// apps/backend/src/db/db.module.ts
import { Global, Module } from '@nestjs/common';
import { DbProvider } from './db.provider';

@Global() // 👈 Biar bisa dipakai di semua module tanpa import
@Module({
  providers: [DbProvider],
  exports: [DbProvider],
})
export class DbModule {}
