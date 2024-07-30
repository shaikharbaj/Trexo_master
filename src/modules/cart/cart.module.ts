import { Module } from '@nestjs/common';
import { CartRepository } from './repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { GlobalHelper } from 'src/common/helpers/global.helper';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  imports: [PrismaModule,ProductModule],
  controllers: [CartController],
  providers: [CartService, CartRepository, GlobalHelper],
  exports: [CartService],
})
export class CartModule {}
