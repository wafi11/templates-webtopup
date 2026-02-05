import { Injectable, Post } from '@nestjs/common';
import { VoucherRepository } from './voucher.repository';
import { RequestParams, RequestVoucher } from '@repo/types';

@Injectable()
export class VoucherService {
  constructor(private repo: VoucherRepository) {}

  async Create(req: RequestVoucher) {
    return this.repo.Create(req);
  }

  async FindAll(req: RequestParams) {
    return this.repo.FindAll(req);
  }
  async FindByCode(code: string) {
    return this.repo.FindOneByCode(code);
  }

  async Update(req: RequestVoucher, id: number) {
    return this.repo.Update(req, id);
  }

  async Delete(id: number) {
    return this.repo.Delete(id);
  }
}
