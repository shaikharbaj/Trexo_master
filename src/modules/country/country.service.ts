/**
 * @fileoverview
 * country service file to handle all country logic functionality.
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
  NotFoundException,
} from "@nestjs/common";
import { CountryRepository } from "./repository/country.repository";
import {
  CreateCountryBody,
  toggleCountryBody,
  UpdateCountryBody,
} from "./types";

@Injectable()
export class CountryService {
  constructor(private countryRepository: CountryRepository) {}

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    uuid: true,
    is_active: true,
    country_name: true,
    iso_code: true,
    mobile_code: true,
    currency_code: true,
    created_at: true,
    is_deleted: true,
  };

  /**
   * @description
   * Function to check if country exist by given condition
   */
  async isExistByCondition(condition: any) {
    const country = await this.countryRepository.findOneWithoutDelete(
      this.select,
      condition
    );
    return country;
  }

  /**
   * @description
   * Function to fetch all the country
   */
  async fetchAllCountry(page: number, searchText: string) {
    try {
      const countryCondition = {
        select: {
          uuid: true,
          country_name: true,
          iso_code: true,
          mobile_code: true,
          currency_code: true,
          is_active: true,
        },
        where: {
          is_deleted: false,
        },
      };
      if (searchText) {
        countryCondition["where"]["OR"] = [
          {
            country_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            iso_code: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            currency_code: {
              contains: searchText,
              mode: "insensitive",
            },
          },
        ];
      }
      const country = await this.countryRepository.findManyWithPaginate(
        countryCondition.select,
        countryCondition.where,
        page
      );
      return {
        status: true,
        message: "Country fetched successfully.",
        data: country,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all the country for dropdown
   */
  async fetchAllCountryForDropdown() {
    try {
      const country = await this.countryRepository.findMany(
        {
          uuid: true,
          country_name: true,
        },
        {
          is_active: true,
        }
      );
      return {
        status: true,
        message: "Country fetched successfully.",
        data: country,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all deleted the country
   */
  async fetchAllDeletedCountry(page: number, searchText: string) {
    try {
      const countryCondition = {
        select: {
          uuid: true,
          country_name: true,
          iso_code: true,
          mobile_code: true,
          currency_code: true,
          is_active: true,
        },
        where: {
          is_deleted: true,
        },
      };
      if (searchText) {
        countryCondition["where"]["OR"] = [
          {
            country_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
        ];
      }
      const country = await this.countryRepository.findManyWithPaginate(
        countryCondition.select,
        countryCondition.where,
        page
      );
      return {
        status: true,
        message: "Deleted Country fetched successfully.",
        data: country,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the country by id
   */
  async findCountryById(uuid: string) {
    try {
      let condition = { uuid: uuid };
      const country = await this.countryRepository.findOne(
        this.select,
        condition
      );

      if (!country) {
        throw new NotFoundException("Data not found");
      }
      return {
        status: true,
        message: "country fetched successfully",
        data: country,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create country
   */
  async createCountry(auth: any, payload: CreateCountryBody) {
    try {
      //check country with same name is exist or not......
      const isCountryExistWithSameName: any = await this.isExistByCondition({
        country_name: { equals: payload.country_name, mode: "insensitive" },
      });
      if (
        isCountryExistWithSameName &&
        isCountryExistWithSameName?.is_deleted === false
      ) {
        throw new BadRequestException("record is already exist.");
      }
      //Checking country exists with same iso...
      const isExistCountryWithSameISO: any = await this.isExistByCondition({
        iso_code: { equals: payload.iso_code, mode: "insensitive" },
      });
      if (
        isExistCountryWithSameISO &&
        isExistCountryWithSameISO?.is_deleted === false
      ) {
        throw new BadRequestException(
          "country with this iso code already exist."
        );
      }
      //Preparing country upsert payload
      const countryCondition = {
        create: {
          country_name: payload.country_name,
          iso_code: payload.iso_code,
          mobile_code: +payload.mobile_code,
          currency_code: payload.currency_code,
          is_active: payload?.is_active,
          created_by: auth?.id,
        },
        update: {
          country_name: payload.country_name,
          iso_code: payload.iso_code,
          mobile_code: +payload.mobile_code,
          currency_code: payload.currency_code,
          is_active: payload.is_active === true ? true : false,
          updated_by: auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          iso_code: payload.iso_code,
        },
      };
      const createdCountry = await this.countryRepository.upsert(
        countryCondition.create,
        countryCondition.update,
        countryCondition.where
      );
      if (createdCountry) {
        return {
          status: true,
          message: "country created successfully",
        };
      }
      throw new BadRequestException("Error while creating country.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the country status i.e: active and inactive
   */
  async toggleCountryVisibility(
    uuid: string,
    auth: any,
    payload: toggleCountryBody
  ) {
    try {
      //Checking country exist or not
      const country = await this.countryRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!country) {
        throw new NotFoundException("No data found.");
      }
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updateCountry = await this.countryRepository.update(
        { uuid: country.uuid },
        updatePayload
      );
      if (updateCountry) {
        return {
          status: true,
          message: "Country visibility updated successfully",
        };
      }
      throw new BadRequestException("Error while updating country visibility.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the country details
   */
  async updateCountry(uuid: string, auth: any, payload: UpdateCountryBody) {
    try {
      //Chewcking country record exist or not
      let condition = { uuid: uuid };
      const country = await this.countryRepository.findOne(
        this.select,
        condition
      );
      if (!country) {
        throw new NotFoundException("Data not found");
      }
      //Checking country with same iso already exist or not
      const anotherCountryWithSameISO = await this.countryRepository.findOne(
        this.select,
        {
          uuid: { not: uuid },
          iso_code: { equals: payload.iso_code, mode: "insensitive" },
        }
      );
      if (anotherCountryWithSameISO) {
        throw new BadRequestException(
          "country with this iso code already exist."
        );
      }
      //check another country exist with same name..
      const anotherCountryWithSameName = await this.countryRepository.findOne(
        this.select,
        {
          uuid: { not: uuid },
          country_name: { equals: payload.country_name, mode: "insensitive" },
        }
      );
      if (anotherCountryWithSameName) {
        throw new BadRequestException("country with same name already exist.");
      }
      //check already present in deleted record...
      const countryPresentInDeletedRecord = await this.isExistByCondition({
        is_deleted: true,
        country_name: payload.country_name,
      });
      if(countryPresentInDeletedRecord){
        throw new BadRequestException("country already exist in deleted record");
      }
      //Preparing update payload
      const updatePayload = {
        country_name: payload.country_name,
        iso_code: payload.iso_code,
        mobile_code: +payload.mobile_code,
        currency_code: payload.currency_code,
        is_active: payload?.is_active,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const updateCountry = await this.countryRepository.update(
        { uuid: country.uuid },
        updatePayload
      );
      if (updateCountry) {
        return {
          status: true,
          message: "country updated successfully",
        };
      }
      throw new BadRequestException("Error while updating country.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the country
   */
  async deleteCountry(uuid: string, auth: any) {
    try {
      // Checking if record is deleted or not
      const country = await this.countryRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!country) {
        throw new NotFoundException("Data not found");
      }
      const updatePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedCountry = await this.countryRepository.update(
        { uuid: country.uuid },
        updatePayload
      );
      if (deletedCountry) {
        return {
          status: true,
          message: "Country deleted successfully",
        };
      }
      throw new BadRequestException("Error while deleting country.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore deleted the country details
   */
  async restoreCountry(uuid: string, auth: any) {
    try {
      //check country with this id present or not ...
      let condition = { uuid: uuid, is_deleted: true };
      const country = await this.countryRepository.findOne(
        this.select,
        condition
      );
      if (!country) {
        throw new NotFoundException("Data not found");
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
          uuid: country?.uuid,
          is_deleted: true,
        },
      };
      const updatedCountry = await this.countryRepository.update(
        restoreCondition.where,
        restoreCondition.payload
      );
      if (updatedCountry) {
        return {
          status: true,
          message: "country restored successfully",
        };
      }
      throw new BadRequestException("Error while restoring country.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the country details
   */
  async fetchCountry(select: any, condition: any) {
    const country = await this.countryRepository.findOneWithoutDelete(
      select,
      condition
    );
    return country;
  }
}
