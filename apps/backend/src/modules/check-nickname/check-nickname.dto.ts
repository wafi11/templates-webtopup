import { IsInt, IsOptional, IsString } from 'class-validator';

export class CheckNicknameRequest {
  @IsString()
  id: string;
  @IsString()
  @IsOptional()
  server?: string;
  @IsInt()
  game: number;
}
