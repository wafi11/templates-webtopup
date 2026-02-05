import { Injectable } from '@nestjs/common';
import { PaymentMethodRepository } from './payment-method.repository';
import {
  PaymentMethod,
  RequestParams,
  RequestValidationPaymentMethod,
} from '@repo/types';

@Injectable()
export class PaymentMethodService {
  constructor(private repo: PaymentMethodRepository) {}

  async Create(req: RequestValidationPaymentMethod) {
    return await this.repo.Create(req);
  }

  async FindAll(req: RequestParams) {
    return await this.repo.FindAll(req);
  }

  async Update(req: PaymentMethod) {
    return await this.repo.Update(req);
  }

  async Delete(id: number) {
    return this.repo.Delete(id);
  }
}
