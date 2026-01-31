import { Module } from '@nestjs/common';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { PRODUCT_SYNC_QUEUE } from '../products/queue/product-sync.queue';

@Module({
  imports: [
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    BullBoardModule.forFeature({
      name: PRODUCT_SYNC_QUEUE,
      adapter: BullAdapter,
    }),
  ],
})
export class QueueBoardModule {}
