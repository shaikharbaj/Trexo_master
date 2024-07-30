/**
 * @fileoverview
 * Brand controller file to handle all the brand requests.
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
  UsePipes,
} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { BRAND_MASTER_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { BrandService } from './brand.service';
import { Data, Auth, Page, QueryString, Uuid } from 'src/common/decorators';
import {
  CreateBrandDto,
  ToggleBrandVisibilityDto,
  UpdateBrandDto
} from './dto';

@Controller()
export class BrandController {
  constructor(private readonly brandService: BrandService) { }
  
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
   * Message pattern handler to fetchAll brand information
   */
  @MessagePattern(
    BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllBrand,
  )
  async fetchAllBrand(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.brandService.fetchAllBrand(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetchAll deleted brand information
   */
  @MessagePattern(
    BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedBrand,
  )
  async fetchAllDeletedBrand(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.brandService.fetchAllDeletedBrand(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
* @description
* Message pattern handler to fetch all brand for dropdown
*/
  @MessagePattern(BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllBrandForDropdown)
  async fetchAllBrandForDropdown() {
    try {
      return await this.brandService.fetchAllBrandForDropdown();
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }


  /**
   * @description
   * Message pattern handler to fetch brand information of given brand id
   */
  @MessagePattern(
    BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].findBrandById,
  )
  async findBrandById(@Uuid() uuid: string) {
    try {
      return await this.brandService.findBrandById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create brand
   */
  @MessagePattern(BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].createBrand)
  async createBrand(@Auth() auth: any, @Data() data: CreateBrandDto) {
    try {
      return await this.brandService.createBrand(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to brand visibility i.e: active,inactive
   */
  @MessagePattern(
    BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleBrandVisibility,
  )
  async toggleBrandVisibility(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: ToggleBrandVisibilityDto,
  ) {
    try {
      return await this.brandService.toggleBrandVisibility(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update brand
   */
  @MessagePattern(BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].updateBrand)
  async updateBrand(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateBrandDto,
  ) {
    try {
      return await this.brandService.updateBrand(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete brand
   */
  @MessagePattern(BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteBrand)
  async deleteBrand(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.brandService.deleteBrand(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore deleted brand
   */
  @MessagePattern(BRAND_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreBrand)
  async restoreBrand(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.brandService.restoreBrand(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
