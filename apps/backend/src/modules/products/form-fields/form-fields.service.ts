import { Injectable } from '@nestjs/common';
import { FormFields, RequestFormField, RequestParams } from '@repo/types';
import { FormFieldsRepository } from './form-fields.repository';

@Injectable()
export class FormFieldsService {
  constructor(private repo: FormFieldsRepository) {}
  async Create(req: RequestFormField) {
    return await this.repo.Create(req);
  }

  async FindAll(req: RequestParams, productId: number) {
    return await this.repo.FindAll(req, productId);
  }

  async Update(req: RequestFormField, id: number) {
    return await this.repo.Update(req, id);
  }

  async Delete(id: number) {
    return this.repo.Delete(id);
  }
}
