import { Injectable } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { RequestParams } from '@repo/types';

@Injectable()
export class TransactionService {
  constructor(private repo: TransactionRepository) {}

  async FindAllTransaction(req: RequestParams) {
    return this.repo.FindAllTransaction(req);
  }
}
