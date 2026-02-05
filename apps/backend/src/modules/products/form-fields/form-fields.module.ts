import { Module } from '@nestjs/common';
import { FormFieldsController } from './form-fields.controller';
import { FormFieldsRepository } from './form-fields.repository';
import { FormFieldsService } from './form-fields.service';

@Module({
  controllers: [FormFieldsController],
  providers: [FormFieldsRepository, FormFieldsService],
})
export class FormFieldsModule {}
