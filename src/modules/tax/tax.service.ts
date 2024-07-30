/**
 * @fileoverview
 * Tax service file to handle all Tax logic functionality.
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
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { TaxRepository } from './repository';
import { ExcelHelper } from 'src/common/helpers';

@Injectable()
export class TaxService {
  constructor(
    private taxRepository: TaxRepository,
    private excelHelper: ExcelHelper,
  ) { }

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    uuid: true,
    tax_name: true,
    description: true,
    tax_type: true,
    value_type: true,
    tax_value: true,
    is_active: true,
  };

  /**
   * @description
   * Function to fetch all the tax with pagination
   */
  async fetchAllTax(page: number, searchText: string) {
    try {
      let filter: any = {};
      if (searchText) {
        filter = {
          OR: [
            { tax_name: { contains: searchText, mode: 'insensitive' } },
            { description: { contains: searchText, mode: 'insensitive' } },
          ],
        };
      }

      const tax = await this.taxRepository.findManyWithPaginate(
        page,
        this.select,
        filter,
      );
      return {
        status: true,
        message: 'Tax fetched successfully.',
        data: tax,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
 * @description
 * Function to fetch all deleted the tax
 */
  async fetchAllDeletedTax(page: number, searchText: string) {
    try {
      const taxCondition = {
        select: {
          uuid: true,
          tax_name: true,
          description: true,
          tax_type: true,
          value_type: true,
          tax_value: true,
          is_active: true,
        },
        where: {
          is_deleted: true,
        },
      };
      if (searchText) {
        taxCondition['where']['OR'] = [
          {
            tax_name: {
              contains: searchText,
              mode: 'insensitive',
            },
            description: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ];
      }
      const tax = await this.taxRepository.findManyWithPaginate(
        page,
        taxCondition.select,
        taxCondition.where,
      );
      return {
        status: true,
        message: 'Deleted Tax fetched successfully.',
        data: tax,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the tax by id
   */
  async findTaxById(uuid: string) {
    try {
      let condition = { uuid: uuid };
      const tax = await this.taxRepository.findOne(
        this.select,
        condition,
      );
      if (!tax) {
        throw new NotFoundException('Data not found.')
      }
      return {
        status: true,
        message: 'Tax fetched successfully.',
        data: tax,
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  /**
   * @description
   * Function to create new tax
   */
  async createTax(auth: any, payload: any) {
    try {
      // Checking if requested tax already exist
      const isExistTax = await this.isExistByCondition({
        tax_name: payload.tax_name,
      });
      if (isExistTax) {
        throw new ConflictException('Tax already exist.')
      }

      // Create payload
      const taxPayload = {
        tax_name: payload.tax_name,
        description: payload.description,
        tax_type: payload.tax_type,
        value_type: payload.value_type,
        tax_value: payload.tax_value,
        is_active: payload.is_active,
        updated_by: auth.id,
        created_by: auth.id,
      };

      // Restore payload
      const restoreTaxPayload = {
        tax_name: payload.tax_name,
        description: payload.description,
        tax_type: payload.tax_type,
        value_type: payload.value_type,
        tax_value: payload.tax_value,
        is_active: payload.is_active,
        created_at: new Date(),
        created_by: auth.id,
        updated_by: null,
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
      };

      await this.taxRepository.upsert(
        {
          is_deleted: true,
          tax_name: payload.tax_name,
        },
        taxPayload,
        restoreTaxPayload,
      );
      return {
        status: true,
        message: 'Tax created successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the tax details
   */
  async updateTax(auth: any, uuid: string, payload: any) {
    try {
      // Checking if requested tax already exist
      const tax = await this.taxRepository.findOne(this.select, {
        uuid: { not: uuid },
        tax_name: payload.tax_name,
      });
      if (tax) {
        throw new ConflictException('Tax type already exist.');
      }

      // Update payload
      const taxPayload = {
        tax_name: payload.tax_name,
        description: payload.description,
        tax_type: payload.tax_type,
        value_type: payload.value_type,
        tax_value: payload.tax_value,
        is_active: payload.is_active,
        updated_by: auth.id,
      };
      await this.taxRepository.update({ uuid: uuid }, taxPayload);
      return {
        status: true,
        message: 'Tax updated successfully',
      };
    } catch (error) {
      console.log(error);

      throw error;
    }
  }

  /**
   * @description
   * Function to delete the tax
   */
  async deleteTax(auth: any, uuid: string) {
    try {
      // Checking if record is deleted or not
      const tax = await this.taxRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!tax) {
        throw new NotFoundException('No data found.')
      }

      // Delete payload
      const taxPayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth.id,
      };
      await this.taxRepository.update({ uuid: tax.uuid }, taxPayload);
      return {
        status: true,
        message: 'Tax deleted successfully',
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the tax status i.e: active and inactive
   */
  async toggleTaxVisibility(uuid: string, payload: any, auth: any) {
    try {
      // Checking if record is deleted or not
      const tax = await this.taxRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!tax) {
        throw new NotFoundException('No data found.')
      }
      // Update is_active payload
      const taxPayload = {
        is_active: payload.is_active,
        updated_by: auth.id,
      };
      const updateTax = await this.taxRepository.update(
        { uuid: tax.uuid },
        taxPayload
      );
      if (updateTax) {
        return {
          status: true,
          message: 'Tax visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating tax visibility.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to import the tax excel file
   */
  async importTax(auth: any, file: any) {
    try {
      const excelData = await this.excelHelper.readFile(
        file.buffer.data,
        'buffer',
      );
      const validateExcelHeaderResponse =
        await this.excelHelper.validateExcelHeader(excelData[0], 'tax');
      if (validateExcelHeaderResponse === true) {
        const formattedData = await this.excelHelper.formatExcelData(excelData);
        if (formattedData.length === 0) {
          throw new RpcException('Error while formatting excel data');
        }

        //With promise example
        const promises = formattedData.map((data: any, index: number) => {
          return new Promise(async (resolve) => {
            let whereCondition = { id: data.id };
            let createPayload = {
              id: data.id,
              tax_name: '',
              description: '',
              tax_type: '',
              value_type: '',
              tax_value: '',
              is_active: true,
              created_by: auth.id,
            };
            let updatePayload = {
              id: data.id,
              tax_name: '',
              description: '',
              tax_type: '',
              value_type: '',
              tax_value: '',
              is_active: true,
              updated_by: auth.id,
            };
            await this.taxRepository.upsert(
              whereCondition,
              createPayload,
              updatePayload,
            );
            resolve(true);
          });
        });

        return Promise.all(promises).then(() => {
          return {
            status: true,
            message: 'Tax imported successfully',
          };
        });
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to check if tax exist by given condition
   */
  async isExistByCondition(condition: any) {
    const isExist = await this.taxRepository.findOne(this.select, condition);
    if (isExist) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * @description
   * Function to fetch taxes by condition
   */
  async fetchTaxesByCondition(select: any, where: any) {
    try {
      return await this.taxRepository.findMany(select, where)
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore deleted the tax details
   */
  async restoreTax(uuid: string, auth: any) {
    try {
      //check tax with this id present or not ...
      let condition = { uuid: uuid, is_deleted: true };
      const tax = await this.taxRepository.findOne(
        this.select,
        condition,
      );
      if (!tax) {
        throw new NotFoundException('Data not found');
      }
      //Preparing restore payload
      const restoreCondition = {
        payload: {
          is_active: true,
          updated_by: auth.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          uuid: tax?.uuid,
          is_deleted: true,
        },
      };
      const updatedTax = await this.taxRepository.update(
        restoreCondition.where,
        restoreCondition.payload,
      );
      if (updatedTax) {
        return {
          status: true,
          message: 'tax restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring tax.');
    } catch (error) {
      throw error;
    }
  }
}
