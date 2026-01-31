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
import { ProductItemsService } from './product-items.service';
import { CreateProductItemsRequest } from './product-items.dto';
import { ClassRequestParams } from '../categories/categories.dto';

@Controller('product-item')
export class ProductItemsController {
  constructor(private svc: ProductItemsService) {}
  @Post()
  async Create(@Body() req: CreateProductItemsRequest) {
    return this.svc.Create(req);
  }

  @Get()
  async FindAll(@Query() req: ClassRequestParams) {
    return this.svc.FindAll(req);
  }

  @Put(':id')
  async Update(
    @Body() req: CreateProductItemsRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.Update(req, id);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.Delete(id);
  }
}
