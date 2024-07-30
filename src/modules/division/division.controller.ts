/**
 * @fileoverview
 * Division controller file to handle all the division requests.
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
import { DIVISION_MASTER_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { DivisionService } from './division.service';
import { Data, Auth, Page, QueryString, Uuid } from 'src/common/decorators';
import {
  CreateDivisionDto,
  ToggleDivisionVisibilityDto,
  UpdateDivisionDto
} from './dto';

@Controller()
export class DivisionController {
  constructor(private readonly divisionService: DivisionService) { }
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
   * Message pattern handler to fetchAll division information
   */
  @MessagePattern(
    DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDivision,
  )
  async fetchAllDivision(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.divisionService.fetchAllDivision(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetchAll deleted division information
   */
  @MessagePattern(
    DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedDivision,
  )
  async fetchAllDeletedDivision(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.divisionService.fetchAllDeletedDivision(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
* @description
* Message pattern handler to fetch all division for dropdown
*/
  @MessagePattern(DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDivisionForDropdown)
  async fetchAllDivisionForDropdown() {
    try {
      return await this.divisionService.fetchAllDivisionForDropdown();
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }


  /**
   * @description
   * Message pattern handler to fetch division information of given division id
   */
  @MessagePattern(
    DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].findDivisionById,
  )
  async findDivisionById(@Uuid() uuid: string) {
    try {
      return await this.divisionService.findDivisionById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create division
   */
  @MessagePattern(DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].createDivision)
  async createDivision(@Auth() auth: any, @Data() data: CreateDivisionDto) {
    try {
      return await this.divisionService.createDivision(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to division visibility i.e: active,inactive
   */
  @MessagePattern(
    DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleDivisionVisibility,
  )
  async toggleDivisionVisibility(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: ToggleDivisionVisibilityDto,
  ) {
    try {
      return await this.divisionService.toggleDivisionVisibility(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update division
   */
  @MessagePattern(DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].updateDivision)
  async updateDivision(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateDivisionDto,
  ) {
    try {
      return await this.divisionService.updateDivision(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete division
   */
  @MessagePattern(DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteDivision)
  async deleteDivision(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.divisionService.deleteDivision(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore deleted division
   */
  @MessagePattern(DIVISION_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreDivision)
  async restoreDivision(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.divisionService.restoreDivision(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
