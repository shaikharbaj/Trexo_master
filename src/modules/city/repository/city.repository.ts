import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginateFunction, paginator } from 'src/modules/prisma/paginator';

//Defining per page record in pagination
const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class CityRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOneWithoutDelete(select: any, where: any = {}) {
    return this.prismaService.city.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any = {}) {
    return this.prismaService.city.findFirst({
      select: select,
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to save record
   */
  async create(payload: any) {
    return this.prismaService.city.create({ data: payload });
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any = {}) {
    return this.prismaService.city.findMany({
      select: select,
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to fetch matching records for given condition with pagination
   */
  async findManyWithPaginate(select: {}, where: any, page: number = 1) {
    return paginate(
      this.prismaService.city,
      {
        select: select,
        where: {
          is_deleted: false,
          ...where,
        },
      },
      { page },
    );
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any) {
    return this.prismaService.city.update({
      where: {
        is_deleted: false,
        ...where,
      },
      data: payload,
    });
  }

  /**
   * @description
   * Function to upsert record
   */
  upsert(create: any, update: any, where: any) {
    return this.prismaService.city.upsert({
      create: create,
      update: update,
      where: where,
    });
  }
}
