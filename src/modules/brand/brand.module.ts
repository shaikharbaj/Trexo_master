import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { BrandController } from "./brand.controller";
import { BrandService } from "./brand.service";
import { BrandRepository } from "./repository";

@Module({
  imports: [PrismaModule],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [BrandService],
})
export class BrandModule {}
