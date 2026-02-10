import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUser, PaginationResponse, RequestParams } from '@repo/types';
import { count, eq, like } from 'drizzle-orm';
import { InjectDb } from 'src/db/db.provider';
import type { DB } from 'src/db/db.provider';
import { usersTable } from 'src/db/schema';

@Injectable()
export class UserRespository {
  constructor(@InjectDb() private db: DB) {}

  async Create(req: CreateUser): Promise<boolean> {
    const validateUser = await this.FindUsersByEmail(req.email);

    if (validateUser.success) {
      throw new BadRequestException('user already exists');
    }

    const [data] = await this.db
      .insert(usersTable)
      .values({
        ...req,
        username: req.email.split('@')[0],
        role_id: 2,
      })
      .returning();

    if (!data) {
      throw new BadRequestException('failed to create');
    }

    return true;
  }

  async FindAllUsers(req: RequestParams) {
    const searchCondition = req.search
      ? like(usersTable.username, `%${req.search}%`)
      : undefined;

    const [data, totalCount] = await Promise.all([
      await this.db
        .select({
          id: usersTable.id,
          fullname: usersTable.fullname,
          username: usersTable.username,
          email: usersTable.email,
          email_verified: usersTable.email_verified,
          image: usersTable.avatar_url,
        })
        .from(usersTable)
        .limit(req.limit)
        .offset(req.offset)
        .where(searchCondition),
      await this.db
        .select({ count: count() })
        .from(usersTable)
        .limit(req.limit)
        .offset(req.offset)
        .where(searchCondition)
        .then((result) => result[0].count),
      ,
    ]);
    const currentPage = Math.floor(req.offset / req.limit) + 1;
    const totalPages = Math.ceil(totalCount / req.limit);

    return {
      data,
      meta: {
        currentPage,
        totalPages,
        totalItems: totalCount,
        itemsPerPage: req.limit,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
      } as PaginationResponse,
    };
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
