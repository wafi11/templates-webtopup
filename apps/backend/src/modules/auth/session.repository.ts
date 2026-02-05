import { Injectable } from '@nestjs/common';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import { CreateSession } from './auth.dto';
import { sessionsTable, usersTable } from 'src/db/schema';
import { nanoid } from 'nanoid';
import { eq, lt } from 'drizzle-orm';

@Injectable()
export class SessionRepository {
  constructor(@InjectDb() private db: DB) {}

  async create(req: CreateSession) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const [data] = await this.db
      .insert(sessionsTable)
      .values({
        id: req.sessionId,
        access_token: req.access_token as string,
        refresh_token: req.refresh_token,
        user_id: req.user_id,
        user_agent: req.userAgent,
        ip_address: req.ipAddress,
        expires_at: expiresAt,
        created_at: new Date(),
      })
      .returning();

    return data;
  }

  async FindByRefreshToken(refreshToken: string) {
    const [session] = await this.db
      .select()
      .from(sessionsTable)
      .where(eq(sessionsTable.refresh_token, refreshToken))
      .limit(1);

    return session;
  }

  async revokeSession(sessionId: string) {
    const data = await this.db
      .delete(sessionsTable)
      .where(eq(sessionsTable.id, sessionId));
    return data;
  }

  async updateAccessToken(sessionId: string, access_token: string) {
    const [data] = await this.db
      .update(sessionsTable)
      .set({
        access_token,
      })
      .where(eq(sessionsTable.id, sessionId))
      .returning();

    return data;
  }

  async revokeAllUserSessions(userId: number) {
    await this.db
      .delete(sessionsTable)
      .where(eq(sessionsTable.user_id, userId));
  }

  async cleanupExpiredSessions() {
    const result = await this.db
      .delete(sessionsTable)
      .where(lt(sessionsTable.expires_at, new Date()));

    return result;
  }
}
