import { Module } from '@nestjs/common';
import { ExcelHelper, GlobalHelper } from 'src/common/helpers';
import { PrismaModule } from '../prisma/prisma.module';
import { TaxRepository } from './repository';
import { TaxController } from './tax.controller';
import { TaxService } from './tax.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaxController],
  providers: [TaxService, TaxRepository, ExcelHelper, GlobalHelper],
})
export class TaxModule {}
