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
import { SubProductService } from './subproduct.service';
import { ClassSubProductRequest } from './subproduct.dto';
import { ClassRequestParams } from '../categories/categories.dto';

@Controller('sub-product')
export class SubProductController {
  constructor(private readonly svc: SubProductService) {}

  @Post()
  async Create(@Body() req: ClassSubProductRequest) {
    return this.svc.Create(req);
  }

  @Get()
  async FindAll(@Query() req: ClassRequestParams) {
    return this.svc.FindAll(req);
  }

  @Put(':id')
  async Update(
    @Body() req: ClassSubProductRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.Update(req, id);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.Delete(id);
  }
}
