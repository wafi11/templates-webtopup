import { Controller, Get, Query } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { ClassRequestParams } from '../products/categories/categories.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private svc: TransactionService) {}

  @Get()
  async FindAllTransactions(@Query() req: ClassRequestParams) {
    return this.svc.FindAllTransaction(req);
  }
}
