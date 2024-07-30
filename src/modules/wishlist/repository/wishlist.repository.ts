/**
 * @fileoverview
 * Wishlist repository file to handle all wishlist table operations
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
export class WishlistRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any = {}) {
    return this.prismaService.wishlist.findFirst({
      select: select,
      where: {
        // is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to save record
   */
  async create(payload: any) {
    return this.prismaService.wishlist.create({ data: payload });
  }

  /**
   * @description
   * Function to fetch matching records for given condition without pagination
   */
  async findMany(select: any, where: any = {}) {
    return this.prismaService.wishlist.findMany({
      select: select,
      where: {
        // is_deleted: false,
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
      this.prismaService.wishlist,
      {
        select: select,
        where: {
          // is_deleted: false,
          ...where,
        },
      },
      { page },
    );
  }

  /**
   * @description
   * Function to hard delete record
   */
  delete(where: any) {
    return this.prismaService.wishlist.delete({
      where: where,
    });
  }
}
