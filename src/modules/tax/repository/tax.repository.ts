/**
 * @fileoverview
 * Tax repository file to handle all Tax table operations
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
import { PaginateFunction, paginator } from 'src/modules/prisma/paginator';
import { PrismaService } from 'src/modules/prisma/prisma.service';

const paginate: PaginateFunction = paginator({ perPage: 10 });

@Injectable()
export class TaxRepository {
  constructor(private prismaService: PrismaService) {}

  /**
   * @description
   * Function to find first matching record for given condition
   */
  async findOne(select: any, where: any = {}) {
    return await this.prismaService.tax.findFirst({
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
    return await this.prismaService.tax.findMany({
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
  async findManyWithPaginate(page: number = 1, select: any, where: any = {}) {
    return await paginate(
      this.prismaService.tax,
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
   * Function to fetch all records
   */
  async findAll() {
    return await this.prismaService.tax.findMany();
  }

  /**
   * @description
   * Function to save record
   */
  async create(payload: any) {
    return await this.prismaService.tax.create({ data: payload });
  }

  /**
   * @description
   * Function to save multiple record at once
   */
  async createMany(payload: any) {
    return await this.prismaService.tax.createMany({ data: payload });
  }

  /**
   * @description
   * Function to update existing record
   */
  async update(where: any, payload: any) {
    return await this.prismaService.tax.update({
      where: {
        is_deleted: false,
        ...where,
      },
      data: payload,
    });
  }

  /**
   * @description
   * Function to update multiple existing record at once
   */
  async updateMany(where: any, payload: any) {
    return await this.prismaService.tax.updateMany({
      where: {
        is_deleted: false,
        ...where,
      },
      data: payload,
    });
  }

  /**
   * @description
   * Function to upsert particular record
   */
  async upsert(where: any, createPayload: any, updatePayload: any) {
    return await this.prismaService.tax.upsert({
      where: {
        is_deleted: false,
        ...where,
      },
      update: updatePayload,
      create: createPayload,
    });
  }

  /**
   * @description
   * Function to delete existing record
   */
  async delete(where: any) {
    return await this.prismaService.tax.delete({
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }

  /**
   * @description
   * Function to delete multiple existing record at once
   */
  async deleteMany(where: any) {
    return await this.prismaService.tax.deleteMany({
      where: {
        is_deleted: false,
        ...where,
      },
    });
  }
}
