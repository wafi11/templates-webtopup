// auth.repository.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { JWTPayload } from './auth.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthRepository {
  constructor(private jwtService: JwtService) {}

  /**
   * Generate JWT token
   * @param payload - JWT payload
   * @param expiresIn - '15m', '30d', etc (NOT milliseconds!)
   */
  async generateToken(payload: JWTPayload, expiresIn: number): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      algorithm: 'HS256',
      expiresIn,
    });
  }

  async verifyToken(token: string): Promise<JWTPayload> {
    return await this.jwtService.verifyAsync<JWTPayload>(token, {
      algorithms: ['HS256'],
    });
  }

  /**
   * Hash password dengan bcrypt
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12); // ✅ Async version
  }

  /**
   * Verify password
   * @param plainPassword - Password dari user input
   * @param hashedPassword - Password hash dari database
   */
  async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword); // ✅ Urutan benar
  }
}
