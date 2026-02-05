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
import { FormFieldsService } from './form-fields.service';
import { ClassRequestFormFields } from './form-fields.dto';
import { ClassRequestParams, FormFields } from '@repo/types';
import { IsNumberString, IsOptional } from 'class-validator';

export class SubProduct extends ClassRequestParams {
  @IsOptional()
  @IsNumberString()
  product_id: string;
}
@Controller('form-fields')
export class FormFieldsController {
  constructor(private svc: FormFieldsService) {}

  @Post()
  async Create(@Body() req: ClassRequestFormFields) {
    return this.svc.Create(req);
  }

  @Get()
  async FindAll(@Query() req: SubProduct) {
    return this.svc.FindAll(
      {
        limit: req.limit,
        offset: req.offset,
        search: req.search as string,
      },
      parseInt(req.product_id),
    );
  }

  @Put(':id')
  async Update(
    @Body() req: ClassRequestFormFields,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.svc.Update(req, id);
  }

  @Delete(':id')
  async Delete(@Param('id', ParseIntPipe) id: number) {
    return this.svc.Delete(id);
  }
}
