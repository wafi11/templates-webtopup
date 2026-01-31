// product-sync.processor.ts
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import type { Job } from 'bull';
import { PRODUCT_SYNC_QUEUE, ProductSyncJobType } from './product-sync.queue';
import { ProductRepository } from '../product.repository';
import { Digiflazz } from 'src/integrations/digiflazz/http.request';

@Processor(PRODUCT_SYNC_QUEUE)
export class ProductSyncProcessor {
  private readonly logger = new Logger(ProductSyncProcessor.name);

  constructor(
    private readonly productRepo: ProductRepository,
    private readonly digiflazz: Digiflazz,
  ) {
    this.logger.log('✅ ProductSyncProcessor initialized');
  }

  @Process(ProductSyncJobType.IMPORT_ALL)
  async handleImportAll(job: Job) {
    this.logger.log(`Starting job ${job.id}: Import all products`);

    try {
      await job.progress(10);

      const products = await this.digiflazz.CheckPrice();

      if (!products || products.length === 0) {
        throw new Error('No products from Digiflazz');
      }

      await job.progress(30);

      const batchSize = 50;
      const totalBatches = Math.ceil(products.length / batchSize);
      let successCount = 0;
      let failCount = 0;

      for (let i = 0; i < totalBatches; i++) {
        const batch = products.slice(i * batchSize, (i + 1) * batchSize);

        this.logger.log(`Processing batch ${i + 1}/${totalBatches}`);

        const results = await Promise.allSettled(
          batch.map((product) =>
            this.productRepo.Create({
              // ⬅️ Langsung ke Repository
              bannerImage: '',
              categoryId: 1,
              code: product.buyer_sku_code,
              description: product.desc,
              isActive:
                product.seller_product_status && product.buyer_product_status,
              name: product.product_name,
              order: 1,
              slug: product.brand,
              thumbnail: '',
              subName: product.category,
            }),
          ),
        );

        results.forEach((result) => {
          if (result.status === 'fulfilled') {
            successCount++;
          } else {
            failCount++;
            this.logger.error(`Failed to create product: ${result.reason}`);
          }
        });

        const progress = 30 + ((i + 1) / totalBatches) * 60;
        await job.progress(Math.round(progress));
      }

      await job.progress(100);

      this.logger.log(
        `Job ${job.id} completed: ${successCount} success, ${failCount} failed`,
      );

      return {
        success: true,
        total: products.length,
        successCount,
        failCount,
      };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  }

  @Process(ProductSyncJobType.SYNC_SINGLE)
  async handleSyncSingle(job: Job<{ sku: string }>) {
    this.logger.log(`Starting job ${job.id}: Sync product ${job.data.sku}`);

    try {
      const products = await this.digiflazz.CheckPrice();

      if (!products) {
        throw new Error('Products Are Limited');
      }

      const product = products.find((p) => p.buyer_sku_code === job.data.sku);

      if (!product) {
        throw new Error(`Product ${job.data.sku} not found`);
      }

      await this.productRepo.Create({
        // ⬅️ Langsung ke Repository
        bannerImage: '',
        categoryId: 1,
        code: product.buyer_sku_code,
        description: product.desc,
        isActive: product.seller_product_status && product.buyer_product_status,
        name: product.product_name,
        order: 1,
        slug: product.brand,
        thumbnail: '',
        subName: product.category,
      });

      return { success: true, sku: job.data.sku };
    } catch (error) {
      this.logger.error(`Job ${job.id} failed:`, error);
      throw error;
    }
  }
}
