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
import { ClassProductRequest, ClassRequestParamsProduct } from './product.dto';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  constructor(private svc: ProductService) {}
  @Post()
  async Create(@Body() req: ClassProductRequest) {
    return this.svc.Create(req);
  }

  @Get()
  async FindAll(@Query() req: ClassRequestParamsProduct) {
    return this.svc.FindAll(req, req.category);
  }

  @Get('search')
  async Search(
    @Query('query') query: string,
    @Query('limit') limit: string,
    @Query('cursor') cursor?: string,
  ) {
    return this.svc.Search(query, parseInt(limit), cursor);
  }

  @Get(':slug')
  async FindBySlug(@Param('slug') slug: string) {
    return this.svc.FindBySlug(slug);
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
