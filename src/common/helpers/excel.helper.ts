import { Injectable } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import * as xlsx from 'xlsx';

@Injectable()
export class ExcelHelper {
  constructor() {}

  //This function return allowed header for given type of import
  public fetchAllowedHeders(type: string) {
    switch (type) {
      case 'vehicle_type':
        return ['vehicle_type'];
      case 'fuel_type':
        return ['fuel_type'];
      case 'make':
        return ['vehicle_type','make_name'];
      case 'model':
        return ['make','model_name','vehicle_type'];
      case 'transmission_type':
        return ['transmission_type'];
      case 'rsd':
        return ['rsd'];
      case 'tax':
        return ['tax'];
      case 'coupon':
        return ['tax'];
      case 'zone':
        return ['direction_name', 'zone_states'];
      case 'yard':
        return [
          'yard_name',
          'yard_address',
          'city',
          'state',
        ];
      case 'body_type':
        return ['body_type'];
      case 'owner_type':
        return ['owner_type'];
      case 'km_driven':
        return ['km_from', 'km_to'];
      case 'features':
        return [
          'feature_name',
          'tooltip',
          'restriction_refresh',
          'restriction_type',
          'restriction_value',
          'hook_name',
        ];
        case 'associationMaster':
        return [
          'name_in_our_website',
          'seller_format_names',
        ];
        case 'combinationMaster':
          return [
            'name',
            'combined_parameters',
          ];
        case 'states':
          return [
            'state_name',
            'short_code',
            'is_active',
          ];
          case 'cities':
          return [
            'state_name',
            'city_name',
            'is_active',
          ];
        case 'rto':
          return ['reg_no', 'place', 'state'];
      default:
        return [];
    }
  }

  //This function read excel file and return data in json format
  public async readFile(file: any, type: any) {
    const workbook = xlsx.read(file, { type: type });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
    return data;
  }

  //This function validate the headers of the excel file
  public async validateExcelHeader(headers: any, type: string) {
    const allowedHeaders = this.fetchAllowedHeders(type);
    const missingHeaders = [];
    if (allowedHeaders.length === 0) {
      throw new RpcException(
        'Excel headers which are provided is not allowed by the system.',
      );
    }
    allowedHeaders.forEach((header: string, index: number) => {
      if (headers.includes(header) === false) {
        missingHeaders.push(header);
      }
    });
    if (missingHeaders.length > 0) {
      throw new RpcException(
        `Following columns are missing in uploaded excel ${missingHeaders.toString()}`,
      );
    }
    return true;
  }

  //This function format excel data in proper key value pair
  public async formatExcelData(data: any) {
    const headers = data[0];
    const formattedData = [];
    data.forEach((row: any, rowIndex: number) => {
      if (rowIndex > 0 && row.length > 0) {
        let rowObj = {};
        row.forEach((rowData: any, rowDataIndex: number) => {
          rowObj[headers[rowDataIndex]] = rowData;
        });
        formattedData.push(rowObj);
      }
    });
    return formattedData;
  }

   //This function format excel data in proper key value pair
   public zip(keys: string[], values: any): Record<string, any> {
    return keys.reduce(
      (result, key, index) => {
        result[key] = values[index];
        return result;
      },
      {} as Record<string, any>,
    );
  }
}
