import { Injectable } from '@nestjs/common';
import { UserRespository } from './user.repository';
import { RequestParams } from '@repo/types';

@Injectable()
export class UserService {
  constructor(private repo: UserRespository) {}

  async FindAll(req: RequestParams) {
    return this.repo.FindAllUsers(req);
  }
}
