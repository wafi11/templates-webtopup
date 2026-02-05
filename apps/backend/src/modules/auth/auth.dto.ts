import { IsString } from 'class-validator';

export interface JWTPayload {
  sub: string;
  session_id: string;
}

export class ClassRegisterAuth {
  @IsString()
  fullname: string;
  @IsString()
  email: string;
  @IsString()
  password: string;
}
export class ClassLoginAuth {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class CreateSession {
  sessionId: string;
  ipAddress: string;
  userAgent: string;
  access_token: string;
  refresh_token: string;
  user_id: number;
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  expiresAt: Date;
}

export interface LoginResponse {
  tokens: AuthTokens;
}
