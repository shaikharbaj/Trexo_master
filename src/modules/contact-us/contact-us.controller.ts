/**
 * @fileoverview
 * ContactUs controller file to handle all the contact us requests.
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
import { CONTACT_US_MASTER_MS_PATTERN } from './pattern';
import { MS_CONFIG } from 'ms.config';
import { ContactUsService } from './contact-us.service';
import { Data, Auth, Page, QueryString, Uuid } from 'src/common/decorators';
import {
  CreateContactUsDto,
  ReplyContactUsDto
} from './dto';
import e from 'express';

@Controller()
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) { }
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
   * Message pattern handler to fetchAll contact us information
   */
  @MessagePattern(
    CONTACT_US_MASTER_MS_PATTERN[MS_CONFIG.transport].fetchAllContactUs,
  )
  async fetchAllContactUs(@Page() page: number, @QueryString() { searchText }: any) {
    try {
      return await this.contactUsService.fetchAllContactUs(page, searchText);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }


  /**
   * @description
   * Message pattern handler to fetch contact us information of given contact us id
   */
  @MessagePattern(
    CONTACT_US_MASTER_MS_PATTERN[MS_CONFIG.transport].findContactUsById,
  )
  async findContactUsById(@Uuid() uuid: string) {
    try {
      return await this.contactUsService.findContactUsById(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to create contact us
   */
  @MessagePattern(CONTACT_US_MASTER_MS_PATTERN[MS_CONFIG.transport].createContactUs)
  async createContactUs(@Auth() auth: any, @Data() data: CreateContactUsDto) {
    try {
      return await this.contactUsService.createContactUs(auth, data);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

  /**
   * @description
   * Message pattern handler to delete contact us
   */
  @MessagePattern(CONTACT_US_MASTER_MS_PATTERN[MS_CONFIG.transport].deleteContactUs)
  async deleteContactUs(@Uuid() uuid: string, @Auth() auth: any) {
    try {
      return await this.contactUsService.deleteContactUs(uuid);
    } catch (error) {
      throw this.exceptionHandler(error);
    }
  }

}
