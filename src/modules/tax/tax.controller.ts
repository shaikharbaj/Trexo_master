/**
 * @fileoverview
 * Tax controller file to handle all the Tax requests.
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
  UnauthorizedException
} from '@nestjs/common';
import { MessagePattern, RpcException } from '@nestjs/microservices';
import { Auth, Data, Page, QueryString, Uuid } from 'src/common/decorators';
import { CreateTaxDto, ToggleTaxVisibilityDto, UpdateTaxDto } from './dto';
import { TaxService } from './tax.service';
import { TAX_MASTER_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';

@Controller()
export class TaxController {
  constructor(private readonly taxService: TaxService) { }

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
   * Message pattern handler to fetch all tax
   */
  @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllTax)
  async fetchAllTax(@Page() page: number, @QueryString() { type }: any) {
    try {
      return await this.taxService.fetchAllTax(page, type);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

    /**
   * @description
   * Message pattern handler to fetchAll deleted tax information
   */
    @MessagePattern(
      TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedTax,
    )
    async fetchAllDeletedTax(
      @Page() page: number,
      @QueryString() { searchText }: any,
    ) {
      console.log('in controller');
      
      try {
        return await this.taxService.fetchAllDeletedTax(page, searchText);
      } catch (error) {
        throw this.exceptionHandler(error);
      }
    }

  /**
   * @description
   * Message pattern handler to fetch tax information of given id
   */
  @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].findTaxById)
  async findTaxById(@Uuid() uuid: string) {
    try {
      return await this.taxService.findTaxById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create tax
   */
  @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].createTax)
  async createTax(@Auth() auth: any, @Data() data: CreateTaxDto) {
    try {
      return await this.taxService.createTax(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update tax
   */
  @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].updateTax)
  async updateTax(@Auth() auth: any, @Uuid() uuid: string, @Data() data: UpdateTaxDto) {
    try {
      return await this.taxService.updateTax(auth, uuid, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete tax
   */
  @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteTax)
  async deleteTax(@Auth() auth: any, @Uuid() uuid: string) {
    try {
      return await this.taxService.deleteTax(auth, uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to tax visibility i.e: active,inactive
   */
  @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleTaxVisibility)
  async toggleTaxVisibility(
    @Uuid() uuid: string,
    @Data() data: ToggleTaxVisibilityDto,
    @Auth() auth: any,
  ) {
    try {
      return await this.taxService.toggleTaxVisibility(uuid, data, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to import tax file
   */
  @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].importTax)
  async importTax(@Auth() auth: any, @Data() file: any) {
    try {
      return await this.taxService.importTax(auth, file);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handlerto fetch taxes by condition
   */
  @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchTaxesByCondition)
  async fetchTaxesByCondition(@Data() { select, where }: any) {
    try {
      return await this.taxService.fetchTaxesByCondition(select, where);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

    /**
   * @description
   * Message pattern handler to restore deleted tax
   */
    @MessagePattern(TAX_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreTax)
    async restoreTax(@Uuid() uuid: string, @Auth() auth: any) {
      try {
        return await this.taxService.restoreTax(uuid, auth);
      } catch (error) {
        throw this.exceptionHandler(error);
      }
    }
}
