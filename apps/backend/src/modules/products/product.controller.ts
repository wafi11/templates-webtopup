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
import { ProductService } from './product.service';
import { ClassProductRequest } from './product.dto';
import { ClassRequestParams } from './categories/categories.dto';

@Controller('product')
export class ProductController {
  constructor(private svc: ProductService) {}
  @Post()
  async Create(@Body() req: ClassProductRequest) {
    return this.svc.Create(req);
  }

  @Get()
  async FindAll(@Query() req: ClassRequestParams) {
    return this.svc.FindAll(req);
  }

  @Get('digiflazz')
  async GetProductsFromDigiflazz() {
    return await this.svc.GetProductsFromDigiflazz();
  }

  @Put(':id')
  async Update(
    @Body() req: ClassProductRequest,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.Update(req, id);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.Delete(id);
  }
}
