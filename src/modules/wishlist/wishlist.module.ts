import { Module } from '@nestjs/common';
import { WishlistRepository } from './repository';
import { PrismaModule } from '../prisma/prisma.module';
import { ProductModule } from '../product/product.module';
import { GlobalHelper } from 'src/common/helpers/global.helper';
import { WishlistController } from './wishlist.controller';
import { WishlistService } from './wishlist.service';

@Module({
  imports: [PrismaModule,ProductModule],
  controllers: [WishlistController],
  providers: [WishlistService, WishlistRepository, GlobalHelper],
  exports: [WishlistService],
})
export class WishlistModule {}
