/**
 * @fileoverview
 * Contact us repository file to handle all contact us table operations
 *
 * @version
 * API version 1.0.
 *
 * @author
 * KATALYST TEAM
 *
 * @license
 * Licensing information, if applicable.
 */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PaginateFunction, paginator } from 'src/modules/prisma/paginator';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class ContactUsRepository {
  constructor(private prismaService: PrismaService) { }
  /**
    * @description
    * Function to find first matching record for given condition
    */
  async findOneWithoutDelete(select: any, where: any = {}) {
    return this.prismaService.contactUs.findFirst({
      select: select,
      where: where,
    });
  }

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any = {}) {
    return this.prismaService.contactUs.findFirst({
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
    return this.prismaService.contactUs.create({ data: payload });
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any = {}) {
    return this.prismaService.contactUs.findMany({
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
  async findManyWithPaginate(page: number, select: any, where: any = {}) {
    const pageNumber = page ? page : 1;
    return paginate(
      this.prismaService.contactUs,
      {
        select: select,
        where: {
          is_deleted: false,
          ...where,
        },
      },
      { page: pageNumber },
    );
  }

  /**
 * @description
 * Function to hard delete record
 */
  delete(where: any) {
    return this.prismaService.contactUs.delete({
      where: where
    });
  }
}
