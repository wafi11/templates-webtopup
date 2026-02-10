import { IsBoolean, IsInt, IsString } from 'class-validator';
import { ClassRequestParams } from './categories/categories.dto';

export class ClassRequestParamsProduct extends ClassRequestParams {
  @IsString()
  category: string;
}

export class ClassProductRequest {
  @IsString()
  name: string;

  @IsString()
  subName: string;

  @IsString()
  slug: string;

  @IsInt()
  categoryId: number;

  @IsString()
  description: string;

  @IsString()
  thumbnail: string;

  @IsString()
  bannerImage: string;

  @IsString()
  code: string;

  @IsBoolean()
  isActive: boolean;

  @IsInt()
  order: number;
}
