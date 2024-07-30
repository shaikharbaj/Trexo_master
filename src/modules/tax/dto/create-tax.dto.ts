/* eslint-disable prettier/prettier */
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from 'class-validator';

enum TaxType {
  Tax,
  Fee_And_Charges
}

enum TaxValueType {
  Fixed,
  Percent
}

export class CreateTaxDto {
  @IsNotEmpty({ message: 'Please enter tax name.' })
  @IsString({ message: 'Tax name must be a string.' })
  readonly tax_name: string;

  @IsNotEmpty({ message: 'Please enter tax description.' })
  @IsString({ message: 'Tax descriptionname must be a string.' })
  readonly description: string;

  @IsNotEmpty({ message: 'Please enter tax type.' })
  @IsEnum(TaxType, { message: 'Invalid tax type.' })
  readonly tax_type: TaxType;

  @IsNotEmpty({ message: 'Please enter tax value type.' })
  @IsEnum(TaxValueType, { message: 'Invalid tax value type.' })
  readonly value_type: TaxValueType;

  @IsNotEmpty({ message: 'Please enter tax value.' })
  @IsNumber({}, { message: 'Tax value must be a number.' })
  readonly tax_value: number;

  @IsOptional()
  @IsBoolean({ message: 'Please enter valid value.' })
  readonly is_active: boolean;
}
