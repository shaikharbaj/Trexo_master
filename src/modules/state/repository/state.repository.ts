import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { PaginateFunction, paginator } from "src/modules/prisma/paginator";
import { PrismaService } from "src/modules/prisma/prisma.service";

//Defining per page record in pagination
const paginate: PaginateFunction = paginator({ perPage: 10 });
@Injectable()
export class StateRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOneWithoutDelete(select: any, where: any = {}) {
    return this.prismaService.state.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any = {}) {
    return this.prismaService.state.findFirst({
      select: select,
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any = {}) {
    return this.prismaService.state.findMany({
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
      this.prismaService.state,
      {
        select: select,
        where: {
          is_deleted: false,
          ...where,
        },
      },
      { page }
    );
  }

  /**
   * @description
   * Function to save record
   */
  async create(payload: any) {
    return this.prismaService.state.create({ data: payload });
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any) {
    console.log(where);
    return this.prismaService.state.update({
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
    return this.prismaService.state.upsert({
      create: create,
      update: update,
      where: where,
    });
  }
}
