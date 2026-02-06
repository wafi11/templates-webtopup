import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterAuth } from '@repo/types';
import { AuthRepository } from './auth.repository';
import { UserRespository } from './user.repository';
import { SessionRepository } from './session.repository';
import { nanoid } from 'nanoid';
import { LoginResponse } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private authRepo: AuthRepository,
    private userRepo: UserRespository,
    private sessionRepo: SessionRepository,
  ) {}

  private generateSessionId() {
    return nanoid(32);
  }
  async Register(req: RegisterAuth): Promise<boolean> {
    const hashedPassword = await this.authRepo.hashPassword(req.password);

    if (!hashedPassword) {
      throw new BadRequestException('Invalid Credentials');
    }

    const data = await this.userRepo.Create({
      avatar_url: 'https://avatar.iran.liara.run/public',
      email: req.email,
      fullname: req.fullname,
      password: req.password,
      password_hash: hashedPassword,
    });

    return data;
  }

  async Login(
    email: string,
    password: string,
    ipAddress: string,
    userAgent: string,
  ): Promise<LoginResponse> {
    const validateEmail = await this.userRepo.FindUsersByEmail(email);
    if (!validateEmail.success) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const validatePassword = await this.authRepo.verifyPassword(
      password,
      validateEmail.password as string,
    );

    if (!validatePassword) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const sessionID = this.generateSessionId();
    const access_token = await this.authRepo.generateToken(
      {
        session_id: sessionID,
        sub: validateEmail.id.toString(),
      },
      15 * 60 * 1000,
    );

    const refresh_token = await this.authRepo.generateToken(
      {
        session_id: sessionID,
        sub: validateEmail.id.toString(),
      },
      24 * 60 * 60 * 1000,
    );

    const session = await this.sessionRepo.create({
      access_token,
      ipAddress,
      refresh_token,
      sessionId: sessionID,
      user_id: validateEmail.id,
      userAgent,
    });

    return {
      tokens: {
        accessToken: access_token,
        expiresAt: session.expires_at,
        refreshToken: session.refresh_token,
        sessionId: sessionID,
      },
    };
  }

  async findMe(id: number) {
    return this.userRepo.FindMe(id);
  }

  async refreshToken(refresh_token: string): Promise<string> {
    const verifyToken = await this.authRepo.verifyToken(refresh_token);
    console.log(refresh_token);
    const access_token = await this.authRepo.generateToken(
      {
        session_id: verifyToken.session_id,
        sub: verifyToken.sub,
      },
      15 * 60 * 1000,
    );

    const data = await this.sessionRepo.updateAccessToken(
      verifyToken.session_id,
      access_token,
    );

    if (!data) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    return access_token;
  }

  async Logout(sessionId: string) {
    const data = await this.sessionRepo.revokeSession(sessionId);
    return data;
  }
}
