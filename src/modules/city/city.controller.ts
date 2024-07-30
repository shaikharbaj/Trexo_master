/**
 * @fileoverview
 * city controller file to handle all the city requests.
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
} from "@nestjs/common";
import { MessagePattern, RpcException } from "@nestjs/microservices";
import { MS_CONFIG } from "ms.config";
import { CITY_MASTER_MS_PATTERN } from "./pattern";
import { CityService } from "./city.service";
import { Auth, Data, Page, QueryString, Uuid } from "src/common/decorators";
import { CreateCityDto, ToggleCityDto, UpdateCityDto } from "./dto";

@Controller()
export class CityController {
  constructor(private readonly cityService: CityService) {}
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
        message: "Internal server error",
      });
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all city
   */
  @MessagePattern(CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllCity)
  async fetchAllCity(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.cityService.fetchAllCity(+page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all city for dropdown
   */
  @MessagePattern(
    CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllCityForDropdown
  )
  async fetchAllCityForDropdown(@Uuid() uuid: string) {
    try {
      return await this.cityService.fetchAllCityForDropdown(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all Deleted city
   */
  @MessagePattern(
    CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedCity
  )
  async fetchAllDeletedCity(
    @Page() page: number,
    @QueryString() { searchText }: any
  ) {
    try {
      return await this.cityService.fetchAllDeletedCity(+page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch city information of given city id
   */
  @MessagePattern(CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].findCityById)
  async findCityById(@Uuid() uuid: string) {
    try {
      return await this.cityService.findCityById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create city
   */
  @MessagePattern(CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].createCity)
  async createCity(@Auth() auth: any, @Data() data: CreateCityDto) {
    try {
      return await this.cityService.createCity(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update city
   */
  @MessagePattern(CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].updateCity)
  async updateCity(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateCityDto
  ) {
    try {
      return await this.cityService.updateCity(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore deleted city
   */
  @MessagePattern(
    CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreDeletedCity
  )
  async restoreDeletedCity(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.cityService.restoreDeletedCity(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete city
   */
  @MessagePattern(CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteCity)
  async deleteCity(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.cityService.deleteCity(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to city visibility i.e: active,inactive
   */
  @MessagePattern(
    CITY_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleCityVisibility
  )
  async toggleVehicleTypeVisibility(
    @Auth() auth: any,
    @Uuid() uuid: string,
    @Data() data: ToggleCityDto
  ) {
    try {
      return await this.cityService.toggleCityVisibility(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
