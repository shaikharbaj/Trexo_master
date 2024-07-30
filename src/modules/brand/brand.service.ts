/**
 * @fileoverview
 * Brand service file to handle all brand logic functionality.
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
import { I18nContext, I18nService } from "nestjs-i18n";
import { BrandRepository } from "./repository";
import {
  CreateBrandBody,
  ToggleBrandVisibilityBody,
  UpdateBrandBody,
} from "./types";

@Injectable()
export class BrandService {
  constructor(
    private readonly i18n: I18nService,
    private brandRepository: BrandRepository
  ) {}

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    uuid: true,
    brand_name: true,
    image: true,
    brand_associations: true,
    is_active: true,
    created_at: true,
    is_deleted: true,
  };

  //Function to get current language
  public getLang(): string {
    const currentLang = I18nContext.current()?.lang;
    return currentLang ? currentLang : "en";
  }

  /**
   * @description
   * Function to check if brand exist by given condition
   */
  async isExistByCondition(condition: any) {
    const brand = await this.brandRepository.findOneWithoutDelete(
      this.select,
      condition
    );
    return brand;
  }

  /**
   * @description
   * Function to fetch all the brand
   */
  async fetchAllBrand(page: number, searchText: string) {
    try {
      const lang = this.getLang();
      const brandCondition = {
        select: {
          uuid: true,
          image: true,
          brand_name: true,
          brand_associations: true,
          is_active: true,
        },
        where: searchText
          ? {
              brand_name: {
                contains: searchText,
                mode: "insensitive",
              },
            }
          : {},
      };
      const brand = await this.brandRepository.findManyWithPaginate(
        page,
        brandCondition.select,
        brandCondition.where
      );
      return {
        status: true,
        message: this.i18n.t("brand._brand_fetched_successfully", { lang }),
        data: brand,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch all deleted the brand
   */
  async fetchAllDeletedBrand(page: number, searchText: string) {
    try {
      const lang = this.getLang();
      const brandCondition = {
        select: {
          uuid: true,
          image: true,
          brand_name: true,
          brand_associations: true,
          is_active: true,
        },
        where: {
          AND: [
            { is_deleted: true },
            searchText
              ? {
                  brand_name: {
                    contains: searchText,
                    mode: "insensitive",
                  },
                }
              : {},
          ],
        },
      };
      const brand = await this.brandRepository.findManyWithPaginate(
        page,
        brandCondition.select,
        brandCondition.where
      );
      return {
        status: true,
        message: this.i18n.t("brand._brand_fetched_successfully", { lang }),
        data: brand,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to find all brand for dropdown
   */
  async fetchAllBrandForDropdown() {
    try {
      const lang = this.getLang();
      const brandCondition = {
        select: {
          uuid: true,
          brand_name: true,
        },
        where: {
          is_active: true,
        },
      };
      const brand = await this.brandRepository.findMany(
        brandCondition.select,
        brandCondition.where
      );
      return {
        status: true,
        message: this.i18n.t("brand._brand_fetched_successfully", { lang }),
        data: brand,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to fetch brand
   */
  async fetchBrand(select: any, condition: any) {
    const brand = await this.brandRepository.findOneWithoutDelete(
      select,
      condition
    );
    return brand;
  }

  /**
   * @description
   * Function to fetch the brand by id
   */
  async findBrandById(uuid: string) {
    try {
      const lang = this.getLang();
      const brandCondition = {
        select: {
          uuid: true,
          image: true,
          brand_name: true,
          is_active: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const brand = await this.brandRepository.findOne(
        brandCondition.select,
        brandCondition.where
      );
      if (!brand) {
        throw new NotFoundException(
          this.i18n.t("brand._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      return {
        status: true,
        message: this.i18n.t("brand._brand_fetched_successfully", { lang }),
        data: brand,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to create brand
   */
  async createBrand(auth: any, payload: CreateBrandBody) {
    try {
      const lang = this.getLang();
      const brandCondition = {
        select: {
          id: true,
          is_deleted: true
        },
        where: {
          brand_name: payload.brand_name
        },
      };
      const brand: any = await this.brandRepository.findOneWithoutDelete(
        brandCondition.select,
        brandCondition.where
      );
      if (brand && brand.is_deleted === false) {
        throw new BadRequestException(
          this.i18n.t("brand._record_already_exists", { lang })
        );
      }
      //Preparing brand upsert payload
      const brandUpsertCondition = {
        create: {
          brand_name: payload.brand_name,
          is_active: payload.is_active === true ? true : false,
          created_by: auth.id,
        },
        update: {
          is_active: payload.is_active === true ? true : false,
          updated_by: auth?.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          brand_name: payload.brand_name,
        },
      }
      const createdBrand = await this.brandRepository.upsert(brandUpsertCondition.create, brandUpsertCondition.update, brandUpsertCondition.where);
      if (createdBrand) {
        return {
          status: true,
          message: this.i18n.t("brand._brand_created_successfully", { lang }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("brand._error_while_creating_brand", { lang })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to toggle the brand status i.e: active and inactive
   */
  async toggleBrandVisibility(
    uuid: string,
    auth: any,
    payload: ToggleBrandVisibilityBody
  ) {
    try {
      const lang = this.getLang();
      //Checking brand exist or not
      const brandCondition = {
        select: {
          id: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const brand = await this.brandRepository.findOne(
        brandCondition.select,
        brandCondition.where
      );
      if (!brand) {
        throw new NotFoundException(
          this.i18n.t("brand._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      const updatePayload = {
        is_active: payload.is_active,
        updated_by: auth?.id,
      };
      const updateBrand = await this.brandRepository.update(
        { id: brand.id },
        updatePayload
      );
      if (updateBrand) {
        return {
          status: true,
          message: this.i18n.t("brand._brand_visibility_updated_successfullt", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("brand._error_while_updating_brand_visibility", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the brand details
   */
  async updateBrand(uuid: string, auth: any, payload: UpdateBrandBody) {
    try {
      const lang = this.getLang();
      //Chewcking brand record exist or not
      const brandCondition = {
        select: {
          id: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const brand = await this.brandRepository.findOne(
        brandCondition.select,
        brandCondition.where
      );
      if (!brand) {
        throw new NotFoundException(
          this.i18n.t("brand._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      const brandNameCondition = {
        select: {
          id: true,
          brand_name: true,
        },
        where: {
          id: { not: brand.id },
          brand_name: {
            contains: payload.brand_name,
            mode: "insensitive",
          },
        },
      };
      //Checking brand already exist or not
      const anotherBrandWithSameName = await this.brandRepository.findOne(
        brandNameCondition.select,
        brandNameCondition.where
      );
      if (anotherBrandWithSameName) {
        throw new BadRequestException(
          this.i18n.t("brand._brand_with_same_name_already_exists", {
            lang,
          })
        );
      }
      //Preparing update payload
      const brandPayload = {
        brand_name: payload.brand_name,
        updated_by: auth?.id,
      };
      const updateBrand = await this.brandRepository.update(
        { id: brand.id },
        brandPayload
      );
      if (updateBrand) {
        return {
          status: true,
          message: this.i18n.t("brand._brand_updated_successfully", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("brand._error_while_updating_brand", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to delete the brand
   */
  async deleteBrand(uuid: string, auth: any) {
    try {
      const lang = this.getLang();
      // Checking if record is deleted or not
      const brandCondition = {
        select: {
          id: true,
        },
        where: {
          uuid: uuid,
        },
      };
      const brand = await this.brandRepository.findOne(
        brandCondition.select,
        brandCondition.where
      );
      if (!brand) {
        throw new NotFoundException(
          this.i18n.t("brand._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      const brandPayload = {
        is_active: false,
        is_deleted: true,
        deleted_at: new Date(),
        deleted_by: auth?.id,
      };
      const deletedBrand = await this.brandRepository.update(
        { id: brand.id },
        brandPayload
      );
      if (deletedBrand) {
        return {
          status: true,
          message: this.i18n.t("brand._brand_deleted_successfully", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("brand._error_while_deleting_brand", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to restore deleted the brand details
   */
  async restoreBrand(uuid: string, auth: any) {
    try {
      const lang = this.getLang();
      //check brand with this id present or not ...
      const brandCondition = {
        select: {
          id: true,
        },
        where: {
          uuid: uuid,
          is_deleted: true,
        },
      };
      const brand = await this.brandRepository.findOne(
        brandCondition.select,
        brandCondition.where
      );
      if (!brand) {
        throw new NotFoundException(
          this.i18n.t("brand._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      //Preparing restore payload
      const restoreBrandCondition = {
        payload: {
          is_active: true,
          updated_by: auth.id,
          is_deleted: false,
          deleted_at: null,
          deleted_by: null,
        },
        where: {
          id: brand?.id,
          is_deleted: true,
        },
      };
      const updatedBrand = await this.brandRepository.update(
        restoreBrandCondition.where,
        restoreBrandCondition.payload
      );
      if (updatedBrand) {
        return {
          status: true,
          message: this.i18n.t("brand._brand_restore_successfully", {
            lang,
          }),
        };
      }
      throw new BadRequestException(
        this.i18n.t("brand._error_while_restoring_brand", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }
}
