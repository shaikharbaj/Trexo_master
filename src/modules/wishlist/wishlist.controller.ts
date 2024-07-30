/**
 * @fileoverview
 * Wishlist controller file to handle all the wishlist requests.
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
  BadGatewayException,
  BadRequestException,
  ConflictException,
  Controller,
  ForbiddenException,
  GatewayTimeoutException,
  NotFoundException,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { WISHLIST_PRODUCT_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { Data, Auth, Page, QueryString, Uuid, Id } from 'src/common/decorators';
import { WishlistService } from './wishlist.service';
import { AddToWishListDto, RemoveFromWishListDto } from './dto';

@Controller()
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  /**
   * @description
   * Message format exception
   */
  exceptionHandler(error: any) {
    if (error instanceof BadRequestException) {
      return new RpcException({
        statusCode: 400,
        message: error.message,
      });
    } else if (error instanceof UnauthorizedException) {
      return new RpcException({
        statusCode: 401,
        message: error.message,
      });
    } else if (error instanceof ForbiddenException) {
      return new RpcException({
        statusCode: 403,
        message: error.message,
      });
    } else if (error instanceof NotFoundException) {
      return new RpcException({
        statusCode: 404,
        message: error.message,
      });
    } else if (error instanceof ConflictException) {
      return new RpcException({
        statusCode: 409,
        message: error.message,
      });
    } else if (error instanceof BadGatewayException) {
      return new RpcException({
        statusCode: 502,
        message: error.message,
      });
    } else if (error instanceof ServiceUnavailableException) {
      return new RpcException({
        statusCode: 503,
        message: error.message,
      });
    } else if (error instanceof GatewayTimeoutException) {
      return new RpcException({
        statusCode: 504,
        message: error.message,
      });
    } else {
      return new RpcException({
        statusCode: 500,
        message: 'Internal server error',
      });
    }
  }

  /**
   * @description
   * Message pattern handler to fetchAll the product from wishlist
   */
  @MessagePattern(
    WISHLIST_PRODUCT_MS_PATTERN[MS_CONFIG.transport].fetchAllWishlistProduct,
  )
  async fetchAllWishList(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.wishlistService.fetchAllWishList(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to add product to wishlist
   */
  @MessagePattern(
    WISHLIST_PRODUCT_MS_PATTERN[MS_CONFIG.transport].AddProductToWishList,
  )
  async AddToWishlist(@Auth() auth: any, @Data() data: AddToWishListDto) {
    try {
      return await this.wishlistService.AddToWishlist(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to remove the product from wishlist
   */
  @MessagePattern(
    WISHLIST_PRODUCT_MS_PATTERN[MS_CONFIG.transport].RemoveProductFromWishList,
  )
  async removeFromWishList(@Id() id: number, @Auth() auth: any) {
    try {
      return await this.wishlistService.removeFromWishList(+id, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
