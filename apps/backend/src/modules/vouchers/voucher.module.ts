import { Module } from '@nestjs/common';
import { VoucherController } from './voucher.controller';
import { VoucherRepository } from './voucher.repository';
import { VoucherService } from './voucher.service';

@Module({
  controllers: [VoucherController],
  providers: [VoucherRepository, VoucherService],
})
export class VoucherModule {}
