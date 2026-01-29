import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  message: string;

  @ApiPropertyOptional()
  data?: T;

  @ApiPropertyOptional()
  errors?: any;

  @ApiPropertyOptional()
  timestamp?: string;

  constructor(success: boolean, message: string, data?: T, errors?: any) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
    this.timestamp = new Date().toISOString();
  }
}

export class PaginatedResponseDto<T> extends ResponseDto<T[]> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  constructor(
    data: T[],
    total: number,
    offset: number,
    limit: number,
    message = 'Data retrieved successfully',
  ) {
    super(true, message, data);
    this.total = total;
    this.offset = offset;
    this.limit = limit;
  }
}
