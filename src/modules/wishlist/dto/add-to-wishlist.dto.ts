import { IsNotEmpty, IsString } from 'class-validator';

export class AddToWishListDto {
  @IsNotEmpty({ message: '_product_uuid_is_required' })
  @IsString({ message: '_product_uuid_must_be_a_string' })
  product_uuid: string;
}
