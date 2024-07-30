/* eslint-disable prettier/prettier */
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateDivisionDto {

    @IsNotEmpty({ message: 'Please enter slug.' })
    readonly slug: string;

    @IsNotEmpty({ message: 'Please enter division name.' })
    readonly division_name: string;

    @IsOptional()
    @IsBoolean({ message: 'Please enter valid is_active value.' })
    readonly is_active: boolean;
}
