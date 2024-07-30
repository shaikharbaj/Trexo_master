/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsIn, IsOptional, Matches, IsString } from 'class-validator';

export class UpdateCityDto {
  @IsNotEmpty({ message: 'Please enter state id.' })
  @IsString()
  readonly state_uuid: string;

  @IsNotEmpty({ message: 'Please enter city name.' })
  @Matches(/^[A-Za-z\s&-]+$/, { message: 'Name must contain only alphabetic characters.' })
  readonly name: string;

  @IsOptional()
  // @IsBoolean({ message: 'Please enter valid value.' })
  @IsIn(['true', 'false'], { message: 'Is active should be true or false.' })
  readonly is_active: boolean;
}