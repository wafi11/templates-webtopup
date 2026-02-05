import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PaymentMethodService } from './payment-method.service';
import type { ClassRequestPaymentMethod, PaymentMethod } from '@repo/types';
import { ClassRequestParams } from '../products/categories/categories.dto';

@Controller('payment-method')
export class PaymentMethodController {
  constructor(private svc: PaymentMethodService) {}
  @Post()
  async Create(@Body() req: ClassRequestPaymentMethod) {
    return this.svc.Create(req);
  }

  @Get()
  async FindAll(@Query() req: ClassRequestParams) {
    return this.svc.FindAll(req);
  }

  @Put(':id')
  async Update(@Body() req: PaymentMethod) {
    return this.svc.Update(req);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.Delete(id);
  }
}
