/**
 * @fileoverview
 * state service file to handle all state logic functionality.
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
import { GlobalHelper } from "src/common/helpers";
import { CountryService } from "../country/country.service";
import { StateRepository } from "./repository";
import { I18nContext, I18nService } from "nestjs-i18n";
import {
  CreateStateBody,
  toggleStateVisibilityBody,
  UpdateStateBody,
} from "./types";

@Injectable()
export class StateService {
  constructor(
    private globalHelper: GlobalHelper,
    private readonly i18n: I18nService,
    private countryService: CountryService,
    private stateRepository: StateRepository
  ) {}

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    uuid: true,
    country_id: true,
    state_name: true,
    short_code: true,
    is_active: true,
    is_deleted: true,
  };

  //Function to get current language
  public getLang(): string {
    const currentLang = I18nContext.current()?.lang;
    return currentLang ? currentLang : "en";
  }

  /**
   * @description
   * Function to check if state exist by given condition
   */
  async isExistByCondition(condition: any) {
    const state = await this.stateRepository.findOneWithoutDelete(
      this.select,
      condition
    );
    return state;
  }

  /**
   * @description
   * Function to fetch all the state
   */
  async fetchAllState(page: number, searchText: string) {
    try {
      const stateCondition = {
        select: {
          uuid: true,
          country_id: true,
          state_name: true,
          short_code: true,
          is_active: true,
        },
        where: {
          is_deleted: false,
        },
      };
      if (searchText) {
        stateCondition["where"]["OR"] = [
          {
            state_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            country: {
              country_name: {
                contains: searchText,
                mode: "insensitive",
              },
            },
          },
        ];
      }
      const state = await this.stateRepository.findManyWithPaginate(
        stateCondition.select,
        stateCondition.where,
        page
      );
      return {
        status: true,
        message: "All states fetched successfully",
        data: state,
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * @description
   * Function to fetch all the state for dropdown
   */
  async fetchAllStateForDropdown(uuid: string) {
    try {
      const condition: any = { is_active: true };
      if (uuid) {
        //check country is exist or not....
        const isCountryExist = await this.countryService.fetchCountry(
          {
            id: true,
            country_name: true,
          },
          { uuid: uuid }
        );
        if (!isCountryExist || isCountryExist.is_deleted) {
          throw new NotFoundException("country does not exist.");
        }
        condition["country_id"] = isCountryExist.id;
      }
      const state = await this.stateRepository.findMany(
        { uuid: true, state_name: true },
        condition
      );
      return {
        status: true,
        message: "All states fetched successfully",
        data: state,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all the state
   */
  async fetchAllDeletedState(page: number, searchText: string) {
    try {
      const stateCondition = {
        select: {
          uuid: true,
          country_id: true,
          state_name: true,
          short_code: true,
          is_active: true,
        },
        where: {
          is_deleted: true,
        },
      };
      if (searchText) {
        stateCondition["where"]["OR"] = [
          {
            state_name: {
              contains: searchText,
              mode: "insensitive",
            },
          },
          {
            country: {
              country_name: {
                contains: searchText,
                mode: "insensitive",
              },
            },
          },
        ];
      }
      const state = await this.stateRepository.findManyWithPaginate(
        stateCondition.select,
        stateCondition.where,
        page
      );
      return {
        status: true,
        message: "All deleted states fetch successfully",
        data: state,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch the state by id
   */
  async findStateById(uuid: string) {
    try {
      const state = await this.stateRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!state) {
        throw new NotFoundException("Data not found");
      }
      return {
        status: true,
        message: "state fetched successfully",
        data: state,
      };
    } catch (error) {
      throw error;
    }
  }
  /**
   * @description
   * Function to create new state
   */
  async createState(auth: any, payload: CreateStateBody) {
    try {
      const lang = this.getLang();
      const isCountryExist: any = await this.countryService.fetchCountry(
        {
          id: true,
          country_name: true,
          is_deleted: true,
        },
        { uuid: payload.country_uuid }
      );
      if (!isCountryExist || isCountryExist.is_deleted) {
        throw new NotFoundException("country does not exist.");
      }
      // Checking if requested state already exist
      const isExistState: any = await this.isExistByCondition({
        country_id: isCountryExist.id,
        OR: [
          {
            state_name: { equals: payload.name, mode: "insensitive" },
          },
          {
            short_code: { equals: payload.short_code, mode: "insensitive" },
          },
        ],
      });
      if (isExistState && !isExistState?.is_deleted) {
        throw new BadRequestException("record is already exist.");
      }

      const stateCondition = {
        create: {
          country_id: isCountryExist.id,
          state_name: this.globalHelper.convertToTitleCase(payload.name),
          short_code: payload.short_code,
          is_active: payload.is_active === "true" ? true : false,
          created_by: auth?.id,
        },
        update: {
          country_id: isCountryExist.id,
          state_name: this.globalHelper.convertToTitleCase(payload.name),
          short_code: payload.short_code,
          is_active: payload.is_active === "true" ? true : false,
          created_at: new Date(),
          created_by: auth?.id,
          updated_by: null,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
      };

      //check state is exist in deleted record.
      const isStateExistInDeletedRecord =
        await this.stateRepository.findOneWithoutDelete(
          { uuid: true, state_name: true },
          {
            country_id: isCountryExist.id,
            is_deleted: true,
            OR: [
              { state_name: { equals: payload.name, mode: "insensitive" } },
              {
                short_code: { equals: payload.short_code, mode: "insensitive" },
              },
            ],
          }
        );
      let createdState: any;
      if (isStateExistInDeletedRecord) {
        createdState = await this.stateRepository.update(
          {
            uuid: isStateExistInDeletedRecord.uuid,
            is_deleted: true,
          },
          stateCondition.update
        );
      } else {
        createdState = await this.stateRepository.create(stateCondition.create);
      }
      if (createdState) {
        return {
          status: true,
          message: "state created successfully",
        };
      }
      throw new BadRequestException("Error while creating state.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the state details
   */
  async updateState(uuid: string, auth: any, payload: UpdateStateBody) {
    try {
      //Checking whether state exits or not
      const stateExist = await this.stateRepository.findOne(
        { id: true, state_name: true, image: true, country_id: true },
        { uuid: uuid }
      );
      if (!stateExist) {
        throw new NotFoundException("State information not found.");
      }
      const isCountryExist = await this.countryService.fetchCountry(
        { id: true, country_name: true, is_deleted: true },
        {
          uuid: payload.country_uuid,
        }
      );
      if (!isCountryExist || isCountryExist.is_deleted) {
        throw new NotFoundException("country does not exist.");
      }
      //checking another state exist with same name..
      const anotherStateExistWithSameName = await this.isExistByCondition({
        uuid: { not: uuid },
        is_deleted: false,
        country_id: isCountryExist.id,
        OR: [
          { state_name: { equals: payload.name, mode: "insensitive" } },
          { short_code: { equals: payload.short_code, mode: "insensitive" } },
        ],
      });
      if (anotherStateExistWithSameName) {
        throw new BadRequestException("record already exist.");
      }
      //checking another state exist with same name in deleted records
      const anotherStateExistWithSameNameWithDeleted =
        await this.isExistByCondition({
          is_deleted: true,
          country_id: isCountryExist.id,
          OR: [
            { state_name: { equals: payload.name, mode: "insensitive" } },
            { short_code: { equals: payload.short_code, mode: "insensitive" } },
          ],
        });
      if (anotherStateExistWithSameNameWithDeleted) {
        throw new BadRequestException(
          "State already exist, In deleted records."
        );
      }
      const statePayload = {
        country_id: isCountryExist.id,
        state_name: this.globalHelper.convertToTitleCase(payload.name),
        short_code: payload.short_code,
        is_active: payload.is_active === "true" ? true : false,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const updatedState = await this.stateRepository.update(
        { uuid: uuid },
        statePayload
      );
      if (updatedState) {
        return {
          status: true,
          message: "state updated successfully",
        };
      }
      throw new BadRequestException("Error while updating state.");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  /**
   * @description
   * Function to restore the deleted state details
   */
  async restoreDeletedState(uuid: string, auth: any) {
    try {
      //Checking whether state exist or not
      const stateExist = await this.stateRepository.findOne(
        { id: true, state_name: true, image: true, country_id: true },
        { uuid: uuid, is_deleted: true }
      );
      if (!stateExist) {
        throw new NotFoundException("State information not found.");
      }

      const statePayload = {
        is_active: true,
        created_at: new Date(),
        updated_by: null,
        created_by: auth?.id,
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
      };
      const restoredState = await this.stateRepository.update(
        { id: stateExist.id, is_deleted: true },
        statePayload
      );
      if (restoredState) {
        return {
          status: true,
          message: "state restored successfully",
        };
      }
      throw new BadRequestException("Error while restoring state.");
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the state
   */
  async deleteState(uuid: string, auth: any) {
    try {
      //Checking whether state exits or not
      const stateExist = await this.stateRepository.findOne(
        { id: true, state_name: true, image: true, country_id: true },
        { uuid: uuid }
      );
      if (!stateExist) {
        throw new NotFoundException("State information not found.");
      }
      const statePayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const state = await this.stateRepository.update(
        { id: stateExist.id },
        statePayload
      );
      if (state) {
        return {
          status: true,
          message: "State deleted successfully",
        };
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the state status i.e: active and inactive
   */
  async toggleStateVisibility(
    uuid: string,
    auth: any,
    payload: toggleStateVisibilityBody
  ) {
    try {
      // Checking if record is deleted or not
      const stateExist = await this.stateRepository.findOne(
        { id: true, state_name: true, image: true, country_id: true },
        { uuid: uuid }
      );
      if (!stateExist) {
        throw new NotFoundException("State information not found.");
      }
      const statePayload = {
        ...payload,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const state = await this.stateRepository.update(
        { id: stateExist.id },
        statePayload
      );
      if (state) {
        return {
          status: true,
          message: "State visibility updated successfully",
        };
      }
      throw new BadRequestException("Error while updating state visibility.");
    } catch (error) {
      throw error;
    }
  }
  /**
   * @description
   * Function to fetch the state according to select and condition
   */
  async fetchState(select: any, condition: any) {
    const state = await this.stateRepository.findOneWithoutDelete(
      select,
      condition
    );
    return state;
  }
}
