import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { ClassRequestParams } from '../products/categories/categories.dto';

@Controller('user')
export class UserController {
  constructor(private svc: UserService) {}

  @Get()
  async FindAll(@Query() req: ClassRequestParams) {
    return this.svc.FindAll(req);
  }
}
