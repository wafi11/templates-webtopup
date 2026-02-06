// auth/auth.controller.ts
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { ClassLoginAuth, ClassRegisterAuth } from './auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';

interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    session_id: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() req: ClassRegisterAuth) {
    return this.authService.Register(req);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() dto: ClassLoginAuth,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.Login(
      dto.email,
      dto.password,
      req.ip || req.headers['x-forwarded-for']?.toString() || 'unknown',
      req.headers['user-agent'] || 'unknown',
    );

    res.cookie('access_token', result.tokens.accessToken, {
      httpOnly: true,
      secure: false, // false untuk HTTP localhost
      sameSite: 'lax', // Ubah dari 'none' ke 'lax'
      maxAge: 15 * 60 * 1000,
      path: '/', // Tambahkan ini
    });

    res.cookie('refresh_token', result.tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path: '/',
    });
    return {
      success: true,
    };
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest) {
    const userId = parseInt(req.user?.sub as string);
    const user = await this.authService.findMe(userId);

    return {
      success: true,
      data: {
        user,
      },
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const result = await this.authService.refreshToken(refreshToken);

    res.cookie('access_token', result, {
      httpOnly: true,
      secure: false, // false untuk HTTP localhost
      sameSite: 'lax', // Ubah dari 'none' ke 'lax'
      maxAge: 15 * 60 * 1000,
      path: '/', // Tambahkan ini
    });
    return {
      success: true,
      message: 'Token refreshed',
    };
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: AuthenticatedRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sessionId = req.user?.session_id;

    if (sessionId) {
      await this.authService.Logout(sessionId);
    }

    // ✅ Clear cookies
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return {
      success: true,
      message: 'Logged out successfully',
    };
  }
}
