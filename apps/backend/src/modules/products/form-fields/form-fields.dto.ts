import { IsNumber, IsString } from 'class-validator';

export class ClassRequestFormFields {
  @IsString()
  label: string;

  @IsString()
  value: string;

  @IsString()
  type: string;

  @IsString()
  valuesOption: string;

  @IsNumber()
  order: number;

  @IsNumber()
  productId: number;
}
