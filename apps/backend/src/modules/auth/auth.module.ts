import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthRepository } from './auth.repository';
import { AuthService } from './auth.service';
import { SessionRepository } from './session.repository';
import { UserController } from './user.controller';
import { UserRespository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [AuthController, UserController],
  providers: [
    AuthService,
    UserService,
    AuthRepository,
    UserRespository,
    SessionRepository,
  ],
})
export class AuthModule {}
