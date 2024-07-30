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
} from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { CartRepository } from './repository';
import { AddToCartBody, UpdateCartBody } from './types';
import { GlobalHelper } from 'src/common/helpers';
import { ProductService } from '../product/product.service';

@Injectable()
export class CartService {
  constructor(
    private readonly i18n: I18nService,
    private cartRepository: CartRepository,
    private globalHelper: GlobalHelper,
    private productService: ProductService,
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
    return currentLang ? currentLang : 'en';
  }

  /**
   * @description
   * Function to fetch all the product from cart.
   */
  async fetchAllCart(page: number, searchText: string) {
    try {
      const lang = this.getLang();
      const cartCondition = {
        select: {
          uuid: true,
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
        cartCondition['where']['OR'] = [
          {
            product: {
              title: {
                contains: searchText,
                mode: 'insensitive',
              },
            },
          },
        ];
      }
      const wishlist = await this.cartRepository.findManyWithPaginate(
        cartCondition.select,
        cartCondition.where,
        page,
      );
      return {
        status: true,
        message: this.i18n.t(
          'cart._all_product_from_cart_fetch_successfully_',
          { lang },
        ),
        data: wishlist,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to add product to cart.
   */
  async AddToCart(auth: any, payload: AddToCartBody) {
    try {
      const lang = this.getLang();
      const isProductExist = await this.productService.fetchProduct(
        { uuid: true, id: true },
        { uuid: payload.product_uuid },
      );

      if (!isProductExist) {
        throw new NotFoundException(
          this.i18n.t('cart._product_is_not_exist_with_this_uuid_', {
            lang,
          }),
        );
      }
      //check already is present in cart...
      const isProductIsAlreadyInCart = await this.cartRepository.findOne(
        { id: true, product_id: true },
        { product_id: isProductExist.id, user_id: auth.id },
      );
      if (isProductIsAlreadyInCart) {
        throw new ConflictException(
          this.i18n.t('cart._product_is_already_exist_in_cart_', {
            lang,
          }),
        );
      }
      //add product to cart....
      const cartPayload = {
        product_id: isProductExist.id,
        user_id: auth.id,
        quantity: payload.quantity,
        price: payload.price,
        created_by: auth.id,
      };
      const product = await this.cartRepository.create(cartPayload);
      if (product) {
        return {
          status: true,
          message: this.i18n.t(
            'cart._product_successfully_added_in_cart_',
            {
              lang,
            },
          ),
        };

      }
      throw new BadRequestException(
        this.i18n.t("cart._error_while_adding_product_to_cart_", {
          lang,
        })
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to remove the product from cart.
   */
  async removeFromCart(uuid: string, auth: any) {
    try {
      const lang = this.getLang();
      const isProductIsExistInCart = await this.cartRepository.findOne(
        { id: true, product_id: true },
        { uuid: uuid },
      );
      if (!isProductIsExistInCart) {
        throw new NotFoundException(
          this.i18n.t('cart._we_could_not_find_what_you_are_looking_for', {
            lang,
          }),
        );
      }
      const product = await this.cartRepository.delete({
        uuid: uuid,
      });
      if (product) {
        return {
          status: true,
          message: this.i18n.t(
            'cart._product_successfully_removed_from_cart_',
            {
              lang,
            },
          ),
        };
      }
      throw new BadRequestException(
        this.i18n.t('cart._error_while_removing_product_from_cart_', {
          lang,
        }),
      );
    } catch (error) {
      throw error;
    }
  }

  /**
   * @description
   * Function to update the cart details.
   */
  async updateCart(uuid: string, auth: any, payload: UpdateCartBody) {
    try {
      const lang = this.getLang();
      // //Checking product in cart is exist or not
      let condition = { uuid: uuid };
      const IscartItemExist = await this.cartRepository.findOne(
        { uuid: true, id: true },
        condition,
      );
      if (!IscartItemExist) {
        throw new NotFoundException(
          this.i18n.t('cart._we_could_not_find_what_you_are_looking_for', {
            lang,
          }),
        );
      }
      const isProductExist = await this.productService.fetchProduct(
        { uuid: true, id: true },
        { uuid: payload.product_uuid },
      );
      if (!isProductExist) {
        throw new NotFoundException(
          this.i18n.t('cart._product_is_not_exist_with_this_uuid_', {
            lang,
          }),
        );
      }
      //Checking cart with same product_id and user_id already exist.
      const anotherCartProductWithSameName = await this.cartRepository.findOne(
        { id: true, uuid: true },
        {
          uuid: { not: uuid },
          AND: [
            { user_id: auth.id },
            {
              product_id: payload.product_uuid,
            },
          ],
        },
      );
      if (anotherCartProductWithSameName) {
        throw new BadRequestException(
          this.i18n.t('cart._record_already_exists', {
            lang,
          }),
        );
      }

      //Preparing update payload
      const updatePayload = {
        product_id: isProductExist.id,
        price: payload.price,
        quantity: payload.quantity,
        user_id: auth.id,
        updated_at: new Date(),
        updated_by: auth?.id,
      };
      const updateCart = await this.cartRepository.update(
        { uuid: uuid },
        updatePayload,
      );
      if (updateCart) {
        return {
          status: true,
          message: this.i18n.t('cart._cart_updated_successfully', {
            lang,
          }),
        };
      }

      throw new BadRequestException(
        this.i18n.t('cart._error_while_updating_cart', {
          lang,
        }),
      );
    } catch (error) {
      throw error;
    }
  }
}
