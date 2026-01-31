import {
  IsString,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductItemsRequest {
  @IsString({ message: 'Product name must be a string' })
  @MinLength(8, { message: 'Product name must be at least 8 characters' })
  @MaxLength(100, { message: 'Product name must not exceed 100 characters' })
  name: string;

  @IsString({ message: 'Product code must be a string' })
  @MinLength(8, { message: 'Product code must be at least 8 characters' })
  @MaxLength(50, { message: 'Product code must not exceed 50 characters' })
  code: string;

  @IsNumber({}, { message: 'Sub product ID must be a number' })
  @Type(() => Number)
  subProductId: number;

  @IsBoolean({ message: 'isActive must be a boolean value' })
  @Type(() => Boolean)
  isActive: boolean;

  @IsNumber({}, { message: 'Base price must be a number' })
  @Min(0, { message: 'Base price must be greater than or equal to 0' })
  @Type(() => Number)
  basePrice: number;

  @IsOptional()
  @IsNumber({}, { message: 'Discount price must be a number' })
  @Min(0, { message: 'Discount price must be greater than or equal to 0' })
  @Type(() => Number)
  discountPrice: number | null;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  @Type(() => Number)
  stock: number | null;

  @IsBoolean({ message: 'isBestSeller must be a boolean value' })
  @Type(() => Boolean)
  isBestSeller: boolean;

  @IsNumber({}, { message: 'Order must be a number' })
  @Min(0, { message: 'Order must be greater than or equal to 0' })
  @Type(() => Number)
  order: number;
}

export class UpdateProductItemsRequest {
  @IsOptional()
  @IsString({ message: 'Product name must be a string' })
  @MinLength(8, { message: 'Product name must be at least 8 characters' })
  @MaxLength(100, { message: 'Product name must not exceed 100 characters' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Product code must be a string' })
  @MinLength(8, { message: 'Product code must be at least 8 characters' })
  @MaxLength(50, { message: 'Product code must not exceed 50 characters' })
  code?: string;

  @IsOptional()
  @IsNumber({}, { message: 'Sub product ID must be a number' })
  @Type(() => Number)
  subProductId?: number;

  @IsOptional()
  @IsBoolean({ message: 'isActive must be a boolean value' })
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Base price must be a number' })
  @Min(0, { message: 'Base price must be greater than or equal to 0' })
  @Type(() => Number)
  basePrice?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Discount price must be a number' })
  @Min(0, { message: 'Discount price must be greater than or equal to 0' })
  @Type(() => Number)
  discountPrice?: number | null;

  @IsOptional()
  @IsNumber({}, { message: 'Stock must be a number' })
  @Min(0, { message: 'Stock must be greater than or equal to 0' })
  @Type(() => Number)
  stock?: number | null;

  @IsOptional()
  @IsBoolean({ message: 'isBestSeller must be a boolean value' })
  @Type(() => Boolean)
  isBestSeller?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'Order must be a number' })
  @Min(0, { message: 'Order must be greater than or equal to 0' })
  @Type(() => Number)
  order?: number;
}
