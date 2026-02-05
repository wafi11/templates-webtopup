import { Module } from '@nestjs/common';
import { CheckNicknameController } from './check-nickname.controller';
import { CheckNicknameService } from './check-nickname.service';

@Module({
  controllers: [CheckNicknameController],
  providers: [CheckNicknameService],
})
export class CheckNicknameModule {}
