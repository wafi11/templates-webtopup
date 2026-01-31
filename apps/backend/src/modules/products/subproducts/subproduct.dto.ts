import { IsString, MaxLength, MinLength } from 'class-validator';

export class ClassSubProductRequest {
  @IsString()
  @MinLength(4, {
    message: 'Sub Product Name Min length 4 Characters',
  })
  @MaxLength(100, {
    message: 'Sub Product Name Max 100 length Characters',
  })
  name: string;

  @IsString()
  @MinLength(50, {
    message: 'Sub Product Icon Min length 4 Characters',
  })
  @MaxLength(500, {
    message: 'Sub Product Icon Max length 500 Characters',
  })
  icon: string;

  order: number;

  @IsString()
  @MinLength(2, {
    message: 'Sub Product Code Min length 2 Characters',
  })
  @MaxLength(50, {
    message: 'Sub Product Code Max length 50 Characters',
  })
  code: string;
  isActive: boolean;
  productId: number;
}
