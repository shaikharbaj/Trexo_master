import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DivisionController } from './division.controller';
import { DivisionService } from './division.service';
import { DivisionRepository } from './repository/division.repository';


@Module({
    imports: [PrismaModule,],
    controllers: [DivisionController],
    providers: [DivisionService, DivisionRepository],
    exports: [DivisionService]
})
export class DivisionModule { }
