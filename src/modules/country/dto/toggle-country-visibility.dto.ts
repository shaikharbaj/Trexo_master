/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean } from 'class-validator';

export class ToggleCountryDto {
  @IsNotEmpty({ message: 'Please enter visibility type.' })
  @IsBoolean({ message: 'Please enter valid value.' })
  readonly is_active: boolean;
}
