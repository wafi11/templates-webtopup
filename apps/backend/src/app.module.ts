import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from 'config/configuration';
import { DbModule } from './db/db.module';
import { PaymentMethodModule } from './modules/payment-methods/payment-method.module';
import { CategoriesModule } from './modules/products/categories/categories.module';
import { ProductItemsModules } from './modules/products/product-items/product-items.module';
import { ProductModule } from './modules/products/product.module';
import { SubProductModule } from './modules/products/subproducts/subproduct.module';
import { FormFieldsModule } from './modules/products/form-fields/form-fields.module';
import { CheckNicknameModule } from './modules/check-nickname/check-nickname.module';
import { VoucherModule } from './modules/vouchers/voucher.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    JwtModule.register({
      global: true,
      secret: JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis.host', 'localhost'),
          port: configService.get('redis.port', 6379),
        },
      }),
      inject: [ConfigService],
    }),
    DbModule,
    AuthModule,
    CheckNicknameModule,
    CategoriesModule,
    ProductModule,
    SubProductModule,
    ProductItemsModules,
    PaymentMethodModule,
    FormFieldsModule,
    VoucherModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
