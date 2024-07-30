/**
 * @fileoverview
 * Cart controller file to handle all the cart requests.
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
import { CART_PRODUCT_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { Data, Auth, Page, QueryString, Uuid } from 'src/common/decorators';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartDto } from './dto';

@Controller()
export class CartController {
  constructor(private readonly cartService: CartService) {}

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
   * Message pattern handler to fetchAll the product from cart
   */
  @MessagePattern(
    CART_PRODUCT_MS_PATTERN[MS_CONFIG.transport].fetchAllCartProduct,
  )
  async fetchAllCart(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.cartService.fetchAllCart(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to add product to cart
   */
  @MessagePattern(CART_PRODUCT_MS_PATTERN[MS_CONFIG.transport].AddProductToCart)
  async AddToCart(@Auth() auth: any, @Data() data: AddToCartDto) {
    try {
      return await this.cartService.AddToCart(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to remove the product from cart
   */
  @MessagePattern(
    CART_PRODUCT_MS_PATTERN[MS_CONFIG.transport].RemoveProductFromCart,
  )
  async removeFromCart(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.cartService.removeFromCart(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

    /**
   * @description
   * Message pattern handler to update cart
   */
    @MessagePattern(CART_PRODUCT_MS_PATTERN[MS_CONFIG.transport].UpdateCart)
    async updateCart(
      @Uuid() uuid: string,
      @Auth() auth: any,
      @Data() data: UpdateCartDto
    ) {
      try {
        return await this.cartService.updateCart(uuid, auth, data);
      } catch (error) {
        throw this.exceptionHandler(error);
      }
    }
}
