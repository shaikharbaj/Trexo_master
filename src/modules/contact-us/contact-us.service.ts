/**
 * @fileoverview
 * Contact us service file to handle all contact us logic functionality.
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
  Injectable,
  NotFoundException
} from '@nestjs/common';
import { ContactUsRepository } from './repository';
import {
  CreateContactUsBody,
} from './types';

@Injectable()
export class ContactUsService {
  constructor(
    private contactUsRepository: ContactUsRepository,
  ) { }

  /**
 * @description
 * Creating a global variable " select " to use multiple times
 */
  public select: any = {
    uuid: true,
    email: true,
    name: true,
    user_message: true,
    is_active: true,
    created_at: true,
    is_deleted: true,
  };

  /**
 * @description
 * Function to check if contact us exist by given condition
 */
  async isExistByCondition(condition: any) {
    const contactUs = await this.contactUsRepository.findOneWithoutDelete(
      this.select,
      condition,
    );
    return contactUs;
  }

  /**
 * @description
 * Function to fetch all the contact us
 */
  async fetchAllContactUs(page: number, searchText: string) {
    try {
      const contactUsCondition = {
        select: this.select,
        where: {
          is_deleted: false
        },
      };

      if (searchText) {
        contactUsCondition['where']['OR'] = [
          {
            email: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            name: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
          {
            user_message: {
              contains: searchText,
              mode: 'insensitive',
            },
          },
        ];
      }

      const contactUs = await this.contactUsRepository.findManyWithPaginate(
        page,
        contactUsCondition.select,
        contactUsCondition.where
      );
      return {
        status: true,
        message: 'Contact us fetched successfully.',
        data: contactUs,
      };
    } catch (error) {
      throw error;
    }
  }


  /**
 * @description
 * Function to fetch the contact us by id
 */
  async findContactUsById(uuid: string) {
    try {
      let condition = { uuid: uuid };
      const contactUs = await this.contactUsRepository.findOne(
        this.select,
        condition,
      );

      if (!contactUs) {
        throw new NotFoundException('Data not found');
      }
      return {
        status: true,
        message: 'Contact us data fetched successfully',
        data: contactUs,
      };
    } catch (error) {
      throw error;
    }
  }


  /**
 * @description
 * Function to create contact us
 */
  async createContactUs(auth: any, payload: CreateContactUsBody) {
    try {

      //Preparing contact us create payload
      const contactUsPayload = {
        name: payload.name,
        email: payload.business_email,
        user_message: payload.message,
        is_active: payload.is_active === true ? true : false,
        created_by: auth.id,
      };
      const createdContactUs = await this.contactUsRepository.create(contactUsPayload);

      if (createdContactUs) {
        return {
          status: true,
          message: 'Contact us created successfully',
        };
      }
      throw new BadRequestException('Error while creating contact us.');
    } catch (error) {
      throw error;
    }
  }


  /**
    * @description
    * Function to hard delete the contact us
    */
  async deleteContactUs(uuid: string) {
    try {
      // Checking if record is deleted or not
      const contactUs = await this.contactUsRepository.findOne(this.select, {
        uuid: uuid,
      });
      if (!contactUs) {
        throw new NotFoundException('Data not found');
      }

      const deletedContactUs = await this.contactUsRepository.delete(
        { uuid: contactUs.uuid },
      );

      if (deletedContactUs) {
        return {
          status: true,
          message: 'Contact us data deleted successfully',
        };
      }
      throw new BadRequestException('Error while deleting contact us.');
    } catch (error) {
      throw error;
    }
  }

}

