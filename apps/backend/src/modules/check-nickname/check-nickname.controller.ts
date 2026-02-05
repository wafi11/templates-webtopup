import { Body, Controller, Post } from '@nestjs/common';
import { ResponseCheckNickname } from '@repo/types';
import { CheckNicknameRequest } from './check-nickname.dto';
import { CheckNicknameService } from './check-nickname.service';

@Controller('check-nickname')
export class CheckNicknameController {
  constructor(private svc: CheckNicknameService) {}

  @Post()
  async Check(
    @Body() req: CheckNicknameRequest,
  ): Promise<ResponseCheckNickname | null> {
    return await this.svc.Cek(req.game, req.id, req.server);
  }
}
