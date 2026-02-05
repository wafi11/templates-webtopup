import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsDate,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateVoucherDto {
  @IsString()
  @IsNotEmpty({ message: 'Voucher Name is required' })
  @MinLength(7, { message: 'Voucher Name must be at least 7 characters' })
  @MaxLength(100, { message: 'Voucher Name must not exceed 100 characters' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Voucher Code is required' })
  @MinLength(4, { message: 'Voucher Code must be at least 4 characters' })
  @MaxLength(10, { message: 'Voucher Code must not exceed 10 characters' })
  code: string;

  @IsString()
  @IsOptional()
  @MaxLength(200, {
    message: 'Voucher Description must not exceed 200 characters',
  })
  description: string;

  @IsString()
  @IsNotEmpty()
  marginPercentage: string;

  @IsNumber()
  @Min(0)
  marginAmount: number;

  @IsString()
  @IsNotEmpty({ message: 'Voucher Calculation is required' })
  @MinLength(3, {
    message: 'Voucher Calculation must be at least 3 characters',
  })
  @MaxLength(20, {
    message: 'Voucher Calculation must not exceed 20 characters',
  })
  calculationType: string;

  @IsBoolean()
  onlyProduct: boolean;

  @IsString()
  @IsOptional()
  productIds: string | null;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Max usage must be at least 1' })
  maxUsage: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  currentUsage: number;

  @IsNumber()
  @IsOptional()
  @Min(1, { message: 'Max usage per user must be at least 1' })
  maxUsagePerUser: number; // Typo fix: maxUsagePerUsage -> maxUsagePerUser

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'Start date is required' })
  startedAt: Date;

  @IsDate()
  @Type(() => Date)
  @IsNotEmpty({ message: 'End date is required' })
  endAt: Date;
}
