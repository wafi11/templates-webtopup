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
import { VoucherService } from './voucher.service';
import { CreateVoucherDto } from './voucher.dto';
import { ClassRequestParams } from '../products/categories/categories.dto';

@Controller('voucher')
export class VoucherController {
  constructor(private svc: VoucherService) {}
  @Post()
  async Create(@Body() req: CreateVoucherDto) {
    console.log(req);
    return this.svc.Create(req);
  }

  @Get()
  async FindAll(@Query() req: ClassRequestParams) {
    return this.svc.FindAll({
      ...req,
      search: req.search as string,
    });
  }
  @Get(':code')
  async FindOneByCode(@Param('code') code: string) {
    return this.svc.FindByCode(code);
  }

  @Put(':id')
  async Update(
    @Body() req: CreateVoucherDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.Update(req, id);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.Delete(id);
  }
}
