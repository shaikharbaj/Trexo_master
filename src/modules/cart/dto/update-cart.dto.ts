import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class UpdateCartDto {
  @IsNotEmpty({ message: '_product_uuid_is_required' })
  @IsString({ message: '_product_uuid_must_be_a_string' })
  product_uuid: string;

  @IsNotEmpty({ message: '_quantity_is_required_' })
  @IsNumber({}, { message: '_quantity_must_be_number_' })
  @Min(0, { message: '_quantity_can_not_be_negative_' })
  quantity: number;

  @IsNotEmpty({ message: '_price_is_required_' })
  @IsNumber({}, { message: '_price_must_be_number_' })
  @Min(0, { message: '_price_cannot_be_negative_' })
  price: number;
}