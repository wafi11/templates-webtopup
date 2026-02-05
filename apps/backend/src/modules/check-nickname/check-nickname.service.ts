import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ResponseCheckNickname } from '@repo/types';
import { eq } from 'drizzle-orm';
import type { DB } from 'src/db/client';
import { InjectDb } from 'src/db/db.provider';
import { productsTable } from 'src/db/schema';

@Injectable()
export class CheckNicknameService {
  private url: string;
  constructor(@InjectDb() private readonly db: DB) {
    this.url = 'https://api.isan.eu.org/nickname';
  }
  async Cek(
    productId: number,
    gameId: string,
    zoneId?: string,
  ): Promise<ResponseCheckNickname | null> {
    const [code_check_nickname] = await this.db
      .select({
        code: productsTable.code_check_nickname,
      })
      .from(productsTable)
      .where(eq(productsTable.id, productId));

    if (!code_check_nickname) {
      throw new BadRequestException('Code Not Found');
    }
    try {
      const postData = await fetch(`${this.url}/${code_check_nickname.code}`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          id: gameId,
          server: zoneId,
        }),
      });

      const data = await postData.json();
      return data as ResponseCheckNickname;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
