/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsBoolean, IsOptional } from 'class-validator';

export class CreateContactUsDto {

    @IsNotEmpty({ message: "Please enter business email." })
    readonly business_email: string;

    @IsNotEmpty({ message: "Please enter name." })
    readonly name: string;

    @IsNotEmpty({ message: "Please enter your message." })
    readonly message: string;

    @IsOptional()
    @IsBoolean({ message: 'Please enter valid value.' })
    readonly is_active: boolean;
}