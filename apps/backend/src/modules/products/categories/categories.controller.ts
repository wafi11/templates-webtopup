import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Categories } from '@repo/types';
import { CategoriesService } from './categories.service';
import { CategoryRequest, ClassRequestParams } from './categories.dto';

@Controller('category')
export class CategoriesController {
  constructor(private readonly service: CategoriesService) {}

  @Post()
  async Create(@Body() req: CategoryRequest) {
    if (!req || !req.name) {
      throw new BadRequestException('Invalid Body Request');
    }
    return {
      statusCode: HttpStatus.CREATED,
      data: await this.service.Create(req),
    };
  }

  @Get()
  async FindAll(@Query() req: ClassRequestParams) {
    return await this.service.FindAll({
      limit: req.limit,
      offset: req.offset,
      search: req.search,
    });
  }

  // @Get(':id')
  // async FindOne(@Param('id', ParseIntPipe) id: number): Promise<Categories> {
  //   return await this.service.FindOne(id);
  // }

  @Put(':id')
  async Update(
    @Param('id', ParseIntPipe) id: number,
    @Body() req: CategoryRequest,
  ) {
    if (!req || !req.name) {
      throw new BadRequestException('invalid body request - name is required');
    }
    return await this.service.Update(req, id);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    const success = await this.service.Delete(id);
    if (success) {
      return 'SuccessfullY Deleted Category';
    } else {
      return 'Failed to Deleted Category';
    }
  }
}
