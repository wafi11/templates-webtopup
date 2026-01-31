import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class ClassRequestParams {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset: number = 0;

  @IsOptional()
  @IsString()
  search: string | null = null;
}

export class CategoryRequest {
  @IsString()
  @MinLength(5, {
    message: 'Name Min 5 Characters',
  })
  @MaxLength(150, {
    message: 'Name Value Too Long',
  })
  name: string;

  @IsString()
  @MaxLength(500, {
    message: 'Icon Value Too Long',
  })
  icon: string;

  @IsBoolean()
  is_active: boolean;

  @IsInt()
  @Min(0, {
    message: 'Order Must not be negative',
  })
  order: number = 0;
}
