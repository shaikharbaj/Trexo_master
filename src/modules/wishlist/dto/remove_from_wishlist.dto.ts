import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class RemoveFromWishListDto {
    
  @IsNotEmpty({ message: '_product_id_is_required' })
  @IsInt({ message: '_id_must_be_interger_' })
  id: number;
}
