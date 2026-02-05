import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { UserRespository } from './user.repository';
import { SessionRepository } from './session.repository';

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, UserRespository, SessionRepository],
})
export class AuthModule {}
