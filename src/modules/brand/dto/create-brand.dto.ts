/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsOptional, Matches } from "class-validator";

export class CreateBrandDto {
  @IsNotEmpty({ message: "_please_enter_brand_name" })
  // @Matches(/^[A-Za-z0-9\s&-]+$/, {
  //     message: 'Make type must contain only alphanumeric characters.',
  // })
  readonly brand_name: string;

  @IsOptional()
  @IsBoolean({ message: "_please_enter_valid_value" })
  readonly is_active: boolean;
}
