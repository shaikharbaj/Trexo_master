/**
 * @fileoverview
 * State controller file to handle all the state requests.
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
import { STATE_MASTER_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { StateService } from './state.service';
import { Data, Auth, Page, QueryString, Uuid } from 'src/common/decorators';
import { ToggleStateDto, UpdateStateDto, CreateStateDto } from './dto';

@Controller()
export class StateController {
  constructor(private readonly stateService: StateService) {}

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
   * Message pattern handler to create state
   */
  @MessagePattern(STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].createState)
  async createState(@Auth() auth: any, @Data() data: CreateStateDto) {
    try {
      return await this.stateService.createState(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all state
   */
  @MessagePattern(STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllState)
  async fetchAllState(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.stateService.fetchAllState(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all state for dropdown
   */
  @MessagePattern(
    STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllStateForDropdown,
  )
  async fetchAllStateForDropdown(@Uuid() uuid: string) {
    try {
      return await this.stateService.fetchAllStateForDropdown(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch all deleted state
   */
  @MessagePattern(
    STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllDeletedState,
  )
  async fetchAllDeletedState(
    @Page() page: number,
    @QueryString() { searchText }: any,
  ) {
    try {
      return await this.stateService.fetchAllDeletedState(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to fetch state information of given id
   */
  @MessagePattern(STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].findStateById)
  async findStateById(@Uuid() uuid: string) {
    try {
      return await this.stateService.findStateById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to update state
   */
  @MessagePattern(STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].updateState)
  async updateState(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: UpdateStateDto,
  ) {
    try {
      return await this.stateService.updateState(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to restore deleted state
   */
  @MessagePattern(
    STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].restoreDeletedState,
  )
  async restoreDeletedState(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.stateService.restoreDeletedState(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete state
   */
  @MessagePattern(STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteState)
  async deleteState(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.stateService.deleteState(uuid, auth);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to state visibility i.e: active,inactive
   */
  @MessagePattern(
    STATE_MASTER_MS_PATTERN[MS_CONFIG.transport].toggleStateVisibility,
  )
  async toggleStateVisibility(
    @Uuid() uuid: string,
    @Auth() auth: any,
    @Data() data: ToggleStateDto,
  ) {
    try {
      return await this.stateService.toggleStateVisibility(uuid, auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }
}
