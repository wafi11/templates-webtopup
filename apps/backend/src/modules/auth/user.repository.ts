import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUser, RegisterAuth } from '@repo/types';
import { eq } from 'drizzle-orm';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import { usersTable } from 'src/db/schema';

@Injectable()
export class UserRespository {
  constructor(@InjectDb() private db: DB) {}

  private generateUsername(): string {
    const array = new Uint8Array(10);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(36))
      .join('')
      .substring(0, 10);
  }

  async Create(req: CreateUser): Promise<boolean> {
    const validateUser = await this.FindUsersByEmail(req.email);

    if (validateUser.success) {
      throw new BadRequestException('user already exists');
    }

    const [data] = await this.db
      .insert(usersTable)
      .values({
        ...req,
        username: this.generateUsername(),
      })
      .returning();

    if (!data) {
      throw new BadRequestException('failed to create');
    }

    return true;
  }

  async FindMe(id: number) {
    const [data] = await this.db
      .select({
        id: usersTable.id,
        fullname: usersTable.fullname,
        email: usersTable.email,
        email_verified: usersTable.email_verified,
        image: usersTable.avatar_url,
      })
      .from(usersTable)
      .where(eq(usersTable.id, id));

    if (!data) {
      throw new UnauthorizedException('UNAUTHORIZED');
    }

    return data;
  }

  async FindUsersByEmail(
    email: string,
  ): Promise<{ success: boolean; id: number; password?: string }> {
    const [data] = await this.db
      .select({ id: usersTable.id, password: usersTable.password_hash })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (!data) {
      return {
        id: 0,
        success: false,
      };
    }

    return {
      password: data.password as string,
      id: data.id,
      success: true,
    };
  }

  async FindUsersByUsername(
    username: string,
  ): Promise<{ success: boolean; id: number; password?: string }> {
    const [data] = await this.db
      .select({ id: usersTable.id, password: usersTable.password_hash })
      .from(usersTable)
      .where(eq(usersTable.username, username));

    if (!data) {
      return {
        id: 0,
        success: false,
      };
    }

    return {
      password: data.password as string,
      id: data.id,
      success: true,
    };
  }
}
