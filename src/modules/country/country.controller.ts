/**
 * @fileoverview
 * Country controller file to handle all the country type requests.
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
import { COUNTRY_MASTER_MS_PATTERN } from "./pattern";
import { MS_CONFIG } from "ms.config";
import { CountryService } from "./country.service";
import { Auth, Data, Uuid, Page, QueryString } from "src/common/decorators";
import { CreateCountryDto, ToggleCountryDto, UpdateCountryDto } from "./dto";

@Controller()
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

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
   * Message pattern handler to fetchAll country information
   */
  @MessagePattern(
    COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllCountry
  )
  async fetchAllCountry(
    @Page() page: number,
    @QueryString() { searchText }: any
  ) {
    try {
      return await this.countryService.fetchAllCountry(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetchAll country information for dropdown
   */
  @MessagePattern(
    COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllCountryForDropdown
  )
  async fetchAllCountryForDropdown() {
    try {
      return await this.countryService.fetchAllCountryForDropdown();
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetchAll deleted country information
   */
  @MessagePattern(
    COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedCountry
  )
  async fetchAllDeletedCountry(
    @Page() page: number,
    @QueryString() { searchText }: any
  ) {
    try {
      return await this.countryService.fetchAllDeletedCountry(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch country information of given country id
   */
  @MessagePattern(
    COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].findCountryById
  )
  async findCountryById(@Uuid() uuid: string) {
    try {
      return await this.countryService.findCountryById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create country
   */
  @MessagePattern(COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].createCountry)
  async createCountry(@Auth() auth: any, @Data() data: CreateCountryDto) {
    try {
      return await this.countryService.createCountry(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to country visibility i.e: active,inactive
   */
  @MessagePattern(
    COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleCountryVisibility
  )
  async toggleCountryVisibility(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: ToggleCountryDto
  ) {
    try {
      return await this.countryService.toggleCountryVisibility(
        uuid,
        auth,
        data
      );
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update country
   */
  @MessagePattern(COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].updateCountry)
  async updateCountry(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateCountryDto
  ) {
    try {
      return await this.countryService.updateCountry(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete country
   */
  @MessagePattern(COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteCountry)
  async deleteCountry(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.countryService.deleteCountry(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore deleted country
   */
  @MessagePattern(COUNTRY_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreCountry)
  async restoreCountry(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.countryService.restoreCountry(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
