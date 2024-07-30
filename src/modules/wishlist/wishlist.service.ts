/**
 * @fileoverview
 * WishList service file to handle all uom logic functionality.
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
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { I18nContext, I18nService } from "nestjs-i18n";
import { WishlistRepository } from "./repository";
import { AddToWishListBody } from "./types";
import { GlobalHelper } from "src/common/helpers";
import { ProductService } from "../product/product.service";

@Injectable()
export class WishlistService {
  constructor(
    private readonly i18n: I18nService,
    private wishlistRepository: WishlistRepository,
    private globalHelper: GlobalHelper,
    private productService: ProductService
  ) {}

  /**
   * @description
   * Creating a global variable " select " to use multiple times
   */
  public select: any = {
    uuid: true,
    product: {
      select: {
        uuid: true,
      },
    },
  };

  //Function to get current language
  public getLang(): string {
    const currentLang = I18nContext.current()?.lang;
    return currentLang ? currentLang : "en";
  }

  /**
   * @description
   * Function to fetch all the product from wishlist
   */
  async fetchAllWishList(page: number, searchText: string) {
    try {
      const lang = this.getLang();
      const wishlistCondition = {
        select: {
          id: true,
          product_id: true,
          product: {
            select: {
              uuid: true,
              title: true,
              category_id: true,
              category: {
                select: {
                  uuid: true,
                  category_name: true,
                },
              },
              brand_id: true,
              brand: {
                select: {
                  uuid: true,
                  brand_name: true,
                },
              },
              uom_id: true,
              uom: {
                select: {
                  uuid: true,
                  uom_code: true,
                },
              },
              slug: true,
              description: true,
              tags: true,
              template_suffix: true,
              is_active: true,
            },
          },
        },
        where: {},
      };
      if (searchText) {
        wishlistCondition["where"]["OR"] = [
          {
            product: {
              title: {
                contains: searchText,
                mode: "insensitive",
              },
            },
          },
        ];
      }
      const wishlist = await this.wishlistRepository.findManyWithPaginate(
        wishlistCondition.select,
        wishlistCondition.where,
        page
      );
      return {
        status: true,
        message: this.i18n.t(
          "wishlist._all_product_from_wishlist_fetch_successfully_",
          { lang }
        ),
        data: wishlist,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to add product to wishlist
   */
  async AddToWishlist(auth: any, payload: AddToWishListBody) {
    try {
      const lang = this.getLang();
      //check product is exist or not.
      const isProductExist = await this.productService.fetchProduct(
        { uuid: true, id: true, title: true },
        { uuid: payload.product_uuid }
      );
      if (!isProductExist) {
        throw new NotFoundException(
          this.i18n.t("wishlist._product_is_not_exist_with_this_uuid_", {
            lang,
          })
        );
      }
      //check already is present in wishlist...
      const isProductIsAlreadyInWishlist =
        await this.wishlistRepository.findOne(
          { id: true, product_id: true },
          { product_id: isProductExist.id, user_id: auth.id }
        );
      if (isProductIsAlreadyInWishlist) {
        throw new ConflictException(
          this.i18n.t("wishlist._product_is_already_exist_in_wishlist_", {
            lang,
          })
        );
      }
      //add product to wishlist....
      const wishlistPayload = {
        product_id: isProductExist.id,
        user_id: auth.id,
        created_by: auth.id,
      };
      const product = await this.wishlistRepository.create(wishlistPayload);
      if (product) {
        return {
          status: true,
          message: this.i18n.t(
            "wishlist._product_successfully_added_in_wishlist_",
            {
              lang,
            }
          ),
        };
      }
      throw new BadRequestException(
        this.i18n.t("wishlist._error_while_adding_product_to_wishlist_", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to remove the product from wishlist
   */
  async removeFromWishList(id: number, auth: any) {
    try {
      const lang = this.getLang();
      //check product is exist or not.....
      const isProductIsExistInWishlist = await this.wishlistRepository.findOne(
        { id: true, product_id: true },
        { id: id }
      );
      if (!isProductIsExistInWishlist) {
        throw new NotFoundException(
          this.i18n.t("wishlist._we_could_not_find_what_you_are_looking_for", {
            lang,
          })
        );
      }
      const product = await this.wishlistRepository.delete({
        id: +id,
      });
      if (product) {
        return {
          status: true,
          message: this.i18n.t(
            "wishlist._product_successfully_removed_from_wishlist_",
            {
              lang,
            }
          ),
        };
      }
      throw new BadRequestException(
        this.i18n.t("wishlist._error_while_removing_product_from_wishlist_", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }
}
