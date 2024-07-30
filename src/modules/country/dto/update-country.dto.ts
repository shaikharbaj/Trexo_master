/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean, IsOptional, Matches } from 'class-validator';

export class UpdateCountryDto {
  @IsNotEmpty({ message: 'Please enter country name.' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'Name must contain only alphabetic characters.',
  })
  readonly country_name: string;

  @IsNotEmpty({ message: 'Please enter ISO code.' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'ISO code must contain only alphabetic characters.',
  })
  readonly iso_code: string;

  @IsNotEmpty({ message: 'Please enter mobile code.' })
  readonly mobile_code: number;

  @IsNotEmpty({ message: 'Please enter currency code.' })
  @Matches(/^[A-Za-z\s]+$/, {
    message: 'currency code must contain only alphabetic characters.',
  })
  readonly currency_code: string;

  @IsOptional()
  @IsBoolean({ message: 'Please enter valid value.' })
  readonly is_active: boolean;
}
