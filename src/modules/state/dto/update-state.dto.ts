/* eslint-disable prettier/prettier */
import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class UpdateStateDto {
  @IsNotEmpty({ message: 'Please enter country uuid.' })
  @IsString()
  readonly country_uuid: string;

  @IsNotEmpty({ message: 'Please enter state name.' })
  @Matches(/^[A-Za-z\s&]+$/, {
    message: 'Name must contain only alphabetic characters.',
  })
  readonly name: string;

  @IsNotEmpty({ message: 'Please enter short code.' })
  @Matches(/^[A-Za-z\s&]+$/, {
    message: 'Short code must contain only alphabetic characters.',
  })
  readonly short_code: string;

  @IsOptional()
  @IsIn(['true', 'false'], { message: 'Is active should be true or false.' })
  readonly is_active: boolean;
}
