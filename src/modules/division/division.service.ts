/**
 * @fileoverview
 * Division service file to handle all division logic functionality.
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
import {
  BadRequestException,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { DivisionRepository } from './repository';
import {
  CreateDivisionBody,
  ToggleDivisionVisibilityBody,
  UpdateDivisionBody
} from './types';

@Injectable()
export class DivisionService {
  constructor(
    private divisionRepository: DivisionRepository,
  ) { }

  /**
 * @description
 * Creating a global variable " select " to use multiple times
 */
  public select: any = {
    uuid: true,
    division_name: true,
    slug: true,
    is_active: true,
    created_at: true,
    is_deleted: true,
  };

  /**
 * @description
 * Function to check if division exist by given condition
 */
  async isExistByCondition(condition: any) {
    const division = await this.divisionRepository.findOneWithoutDelete(
      this.select,
      condition,
    );
    return division;
  }

  /**
 * @description
 * Function to fetch all the division
 */
  async fetchAllDivision(page: number, searchText: string) {
    try {
      const divisionCondition = {
        select: this.select,
        where: {
          is_deleted: false
        },
      };

      if (searchText) {
        divisionCondition['where']['OR'] = [
          {
            division_name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ];
      }

      const division = await this.divisionRepository.findManyWithPaginate(
        page,
        divisionCondition.select,
        divisionCondition.where
      );
      return {
        status: true,
        message: 'Division fetched successfully.',
        data: division,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
  * @description
  * Function to fetch all deleted division
  */
  async fetchAllDeletedDivision(page: number, searchText: string) {
    try {
      const divisionCondition = {
        select: this.select,
        where: {
          is_deleted: true
        },
      };

      if (searchText) {
        divisionCondition['where']['OR'] = [
          {
            division_name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ];
      }

      const division = await this.divisionRepository.findManyWithPaginate(
        page,
        divisionCondition.select,
        divisionCondition.where
      );
      return {
        status: true,
        message: 'Division fetched successfully.',
        data: division,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
* @description
* Function to find all division for dropdown
*/
  async fetchAllDivisionForDropdown() {
    try {
      const division = await this.divisionRepository.findMany(
        {
          uuid: true,
          division_name: true,
        },
        {
          is_active: true,
        },
      );
      return {
        status: true,
        message: 'Division fetched successfully.',
        data: division,
      };
    } catch (error) {
      throw error;
    }
  }


  /**
 * @description
 * Function to fetch the division by id
 */
  async findDivisionById(uuid: string) {
    try {
      let condition = { uuid: uuid };
      const division = await this.divisionRepository.findOne(
        this.select,
        condition,
      );

      if (!division) {
        throw new NotFoundException('Data not found');
      }
      return {
        status: true,
        message: 'Division fetched successfully',
        data: division,
      };
    } catch (error) {
      throw error;
    }
  }


  /**
 * @description
 * Function to create division
 */
  async createDivision(auth: any, payload: CreateDivisionBody) {
    try {

      //Checking Division exists or not
      const isExistDivision: any = await this.isExistByCondition({
        OR: [
          {
            division_name: {
              equals: payload.division_name,
              mode: 'insensitive'
            }
          },
          {
            slug: {
              equals: payload.slug,
              mode: 'insensitive'
            }
          }
        ]
      });

      if (isExistDivision && isExistDivision?.is_deleted === false) {
        throw new BadRequestException(
          'Division already exist.',
        );
      }


      //Preparing division upsert payload
      const divisionCondition = {
        create: {
          division_name: payload.division_name,
          slug: payload.slug,
          is_active: payload.is_active === true ? true : false,
          created_by: auth.id,
        },
        update: {
          division_name: payload.division_name,
          slug: payload.slug,
          is_active: payload.is_active === true ? true : false,
          updated_by: auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          slug: payload.slug
        },
      };
      const createdDivision = await this.divisionRepository.upsert(
        divisionCondition.create,
        divisionCondition.update,
        divisionCondition.where,
      );
      if (createdDivision) {
        return {
          status: true,
          message: 'Division created successfully',
        };
      }
      throw new BadRequestException('Error while creating division.');
    } catch (error) {
      throw error;
    }
  }


  /**
   * @description
   * Function to toggle the division status i.e: active and inactive
   */
  async toggleDivisionVisibility(
    uuid: string,
    auth: any,
    payload: ToggleDivisionVisibilityBody,
  ) {
    try {
      //Checking division exist or not=
      const division = await this.divisionRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!division) {
        throw new NotFoundException('No data found.');
      }
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updateDivision = await this.divisionRepository.update(
        { uuid: division.uuid },
        updatePayload,
      );
      if (updateDivision) {
        return {
          status: true,
          message: 'Division visibility updated successfully',
        };
      }
      throw new BadRequestException('Error while updating division visibility.');
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the division details
   */
  async updateDivision(uuid: string, auth: any, payload: UpdateDivisionBody) {
    try {

      //Checking division record exist or not
      let condition = { uuid: uuid };
      const division = await this.divisionRepository.findOne(
        this.select,
        condition,
      );
      if (!division) {
        throw new NotFoundException('Data not found');
      }
      //Checking division already exist or not
      const anotherDivisionWithSameName = await this.divisionRepository.findOne(
        this.select,
        {
          uuid: { not: uuid },
          OR: [
            {
              division_name: {
                contains: payload.division_name,
                mode: 'insensitive',
              }
            },
            {
              slug: {
                contains: payload.slug,
                mode: 'insensitive',
              }
            }
          ]
        },
      );

      if (anotherDivisionWithSameName) {
        throw new BadRequestException(
          'Division already exist.',
        );
      }
      //Preparing update payload
      const updatePayload = {
        division_name: payload.division_name,
        slug: payload.slug,
        is_active: payload?.is_active,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const updateDivision = await this.divisionRepository.update(
        { uuid: division.uuid },
        updatePayload,
      );
      if (updateDivision) {
        return {
          status: true,
          message: 'Division updated successfully',
        };
      }
      throw new BadRequestException('Error while updating division.');
    } catch (error) {
      throw error;
    }
  }


  /**
    * @description
    * Function to delete the division
    */
  async deleteDivision(uuid: string, auth: any) {
    try {
      // Checking if record is deleted or not
      const division = await this.divisionRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!division) {
        throw new NotFoundException('Data not found');
      }
      const updatePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedDivision = await this.divisionRepository.update(
        { uuid: division.uuid },
        updatePayload,
      );
      if (deletedDivision) {
        return {
          status: true,
          message: 'Division deleted successfully',
        };
      }
      throw new BadRequestException('Error while deleting division.');
    } catch (error) {
      throw error;
    }
  }

  /**
  * @description
  * Function to restore deleted the division details
  */
  async restoreDivision(uuid: string, auth: any) {
    try {
      //check division with this id present or not ...
      let condition = { uuid: uuid, is_deleted: true };
      const division = await this.divisionRepository.findOne(
        this.select,
        condition,
      );
      if (!division) {
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
          uuid: division?.uuid,
          is_deleted: true
        }
      };

      const updatedDivision = await this.divisionRepository.update(restoreCondition.where, restoreCondition.payload);
      if (updatedDivision) {
        return {
          status: true,
          message: 'Division restored successfully',
        };
      }
      throw new BadRequestException('Error while restoring division.');
    } catch (error) {
      throw error;
    }
  }



}

