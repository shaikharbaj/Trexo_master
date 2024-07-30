/**
 * @fileoverview
 * city service file to handle all city logic functionality.
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
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { GlobalHelper } from "src/common/helpers";
import { StateService } from "../state/state.service";
import { CityRepository } from "./repository";
import {
  CreateCityBody,
  ToggleCityVisibilityBody,
  UpdateCityBody,
} from "./types";

@Injectable()
export class CityService {
  constructor(
    private cityRepository: CityRepository,
    private stateService: StateService,
    private globalHelper: GlobalHelper
  ) {}
  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    uuid: true,
    state_id: true,
    city_name: true,
    is_deleted: true,
  };

  /**
   * @description
   * Function to check if city exist by given condition
   */
  async isExistByCondition(condition: any) {
    const city = await this.cityRepository.findOneWithoutDelete(
      this.select,
      condition
    );
    return city;
  }

  /**
   * @description
   * Function to fetch all the city
   */
  async fetchAllCity(page: number, searchText: string) {
    try {
      const cityCondition = {
        select: {
          uuid: true,
          state_id: true,
          city_name: true,
          is_active: true,
        },
        where: {
          is_deleted: false,
        },
      };
      if (searchText) {
        cityCondition["where"]["OR"] = [
          {
            city_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            state: {
              state_name: {
                contains: searchText,
                mode: "insensitive",
              },
            },
          },
        ];
      }
      const city = await this.cityRepository.findManyWithPaginate(
        cityCondition.select,
        cityCondition.where,
        page
      );
      return {
        status: true,
        message: "city fetched successfully.",
        data: city,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all the city for dropdown
   */
  async fetchAllCityForDropdown(uuid: string) {
    try {
      const condition: any = { is_active: true };

      if (uuid) {
        //check state is exist or not....
        const isStateExist = await this.stateService.fetchState(
          { id: true, state_name: true, is_deleted: true },
          {
            uuid: uuid,
          }
        );
        if (!isStateExist || isStateExist?.is_deleted) {
          throw new NotFoundException("state does not exist.");
        }
        condition["state_id"] = isStateExist.id;
      }
      const city = await this.cityRepository.findMany(
        { uuid: true, city_name: true },
        condition
      );
      return {
        status: true,
        message: "city fetched successfully.",
        data: city,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all deleted city
   */
  async fetchAllDeletedCity(page: number, searchText: string) {
    try {
      const cityCondition = {
        select: {
          uuid: true,
          state_id: true,
          city_name: true,
          is_active: true,
        },
        where: {
          is_deleted: true,
        },
      };
      if (searchText) {
        cityCondition["where"]["OR"] = [
          {
            city_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            state: {
              state_name: {
                contains: searchText,
                mode: "insensitive",
              },
            },
          },
        ];
      }
      const city = await this.cityRepository.findManyWithPaginate(
        cityCondition.select,
        cityCondition.where,
        page
      );
      return {
        status: true,
        message: "All Deleted Cities fetched successfully.",
        data: city,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the city by id
   */
  async findCityById(uuid: string) {
    try {
      let condition = { uuid: uuid };
      const city = await this.cityRepository.findOne(this.select, condition);

      if (!city) {
        throw new NotFoundException("Data not found");
      }
      return {
        status: true,
        message: "city fetched successfully",
        data: city,
      };
    } catch (error) {
      throw error;
    }
  }

  /* @description
   * Function to create new city
   */
  async createCity(auth: any, payload: CreateCityBody) {
    try {
      //  check state exist or not.....
      const isStateExist = await this.stateService.fetchState(
        { id: true, state_name: true, is_deleted: true },
        {
          uuid: payload.state_uuid,
        }
      );
      if (!isStateExist || isStateExist?.is_deleted) {
        throw new NotFoundException("state does not exist.");
      }
      let cityName = this.globalHelper.convertToTitleCase(payload.name);
      // Checking if requested city already exist
      const isExistCity = await this.isExistByCondition({
        AND: [{ state_id: +isStateExist.id }, { city_name: cityName }],
      });

      if (isExistCity && !isExistCity?.is_deleted) {
        throw new BadRequestException("City already exist.");
      }
      const cityCondition = {
        create: {
          state_id: isStateExist.id,
          city_name: cityName,
          is_active: payload.is_active === "true" ? true : false,
          created_by: auth?.id,
        },
        update: {
          state_id: isStateExist.id,
          city_name: payload.name,
          is_active: payload.is_active === "true" ? true : false,
          updated_by: +auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          state_id_city_name: {
            state_id: isStateExist.id,
            city_name: cityName,
          },
        },
      };
      const createdCity = await this.cityRepository.upsert(
        cityCondition.create,
        cityCondition.update,
        cityCondition.where
      );
      if (createdCity) {
        return {
          status: true,
          message: "City created successfully.",
        };
      }
      throw new ForbiddenException("Error while creating city.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the city details
   */
  async updateCity(uuid: string, auth: any, payload: UpdateCityBody) {
    try {
      //Checking whether state esits or not.
      const cityExist = await this.cityRepository.findOne(
        { id: true, city_name: true, state_id: true },
        { uuid: uuid }
      );
      if (!cityExist) {
        throw new NotFoundException("city information not found.");
      }

      const isStateExist = await this.stateService.fetchState(
        { id: true, state_name: true, is_deleted: true },
        {
          uuid: payload.state_uuid,
        }
      );
      if (!isStateExist || isStateExist?.is_deleted) {
        throw new NotFoundException("state does not exist.");
      }

      //checking another city exist with same name..
      const anotherCityExistWithSameName = await this.isExistByCondition({
        uuid: { not: uuid },
        AND: [
          { state_id: isStateExist.id },
          { city_name: payload.name },
          { is_deleted: false },
        ],
      });

      if (anotherCityExistWithSameName) {
        throw new BadRequestException("city already exist.");
      }

      // //checking another state exist with same name in deleted records
      const anotherCityExistWithSameNameWithDeleted =
        await this.isExistByCondition({
          is_deleted: true,
          AND: [
            { state_id: isStateExist.id },
            { city_name: this.globalHelper.convertToTitleCase(payload.name) },
          ],
        });

      if (anotherCityExistWithSameNameWithDeleted) {
        throw new BadRequestException(
          "city already exist, In deleted records."
        );
      }
      const cityPayload = {
        state_id: isStateExist.id,
        city_name: this.globalHelper.convertToTitleCase(payload.name),
        is_active: payload.is_active === "true" ? true : false,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const updatedCity = await this.cityRepository.update(
        { uuid: uuid },
        cityPayload
      );

      if (updatedCity) {
        return {
          status: true,
          message: "city updated successfully",
        };
      }
      throw new BadRequestException("Error while updating state.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore the deleted city details
   */
  async restoreDeletedCity(uuid: string, auth: any) {
    try {
      // //Checking city details exist or not
      let condition = { uuid: uuid, is_deleted: true };
      const isCityExist = await this.cityRepository.findOne(
        this.select,
        condition
      );
      if (!isCityExist) {
        throw new NotFoundException("City information not found.");
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
          uuid: uuid,
          is_deleted: true,
        },
      };

      const restoredCity = await this.cityRepository.update(
        restoreCondition.where,
        restoreCondition.payload
      );

      if (restoredCity) {
        return {
          status: true,
          message: "City restored successfully",
        };
      }
      throw new BadRequestException("Error while restoring city.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the city
   */
  async deleteCity(uuid: string, auth: any) {
    try {
      // Checking if record is deleted or not
      const isExist = await this.cityRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!isExist) {
        throw new NotFoundException("No data found.");
      }
      const cityPayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedcity = await this.cityRepository.update(
        { uuid },
        cityPayload
      );
      if (deletedcity) {
        return {
          status: true,
          message: "City deleted successfully",
        };
      }
      throw new BadRequestException("Error while deleting city.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the city status i.e: active and inactive
   */
  async toggleCityVisibility(
    uuid: string,
    auth: any,
    payload: ToggleCityVisibilityBody
  ) {
    try {
      //Checking city exist or not
      const city = await this.cityRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!city) {
        throw new NotFoundException("No data found.");
      }
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updatecity = await this.cityRepository.update(
        { uuid: uuid },
        updatePayload
      );
      if (updatecity) {
        return {
          status: true,
          message: "city visibility updated successfully",
        };
      }
      throw new BadRequestException("Error while updating city visibility.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the city according to select and condition'
   */
  async fetchCity(select: any, condition: any) {
    const city = await this.cityRepository.findOneWithoutDelete(
      select,
      condition
    );
    return city;
  }
}
